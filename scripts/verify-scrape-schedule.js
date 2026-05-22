const fs = require('fs');
const path = require('path');

const WORKFLOW_FILE = path.join(__dirname, '..', '.github', 'workflows', 'scrape.yml');
const MALAYSIA_OFFSET_MS = 8 * 60 * 60 * 1000;

const EXPECTED_SCHEDULES = [
  {
    label: 'midday',
    cron: '45 12 * * 1-5',
    timezone: 'Asia/Kuala_Lumpur',
  },
  {
    label: 'evening',
    cron: '15 17 * * 1-5',
    timezone: 'Asia/Kuala_Lumpur',
  },
];

function extractSchedules(workflowText) {
  const lines = workflowText.split(/\r?\n/);
  const schedules = [];

  for (let i = 0; i < lines.length; i++) {
    const cronMatch = lines[i].match(/^\s*-\s*cron:\s*['"]([^'"]+)['"]/);
    if (!cronMatch) {
      continue;
    }

    const followingLines = lines.slice(i + 1, i + 6).join('\n');
    const timezoneMatch = followingLines.match(/^\s*timezone:\s*['"]([^'"]+)['"]/m);

    schedules.push({
      cron: cronMatch[1],
      timezone: timezoneMatch ? timezoneMatch[1] : null,
    });
  }

  return schedules;
}

function assertExpectedSchedules(actualSchedules) {
  const failures = [];

  if (actualSchedules.length !== EXPECTED_SCHEDULES.length) {
    failures.push(`Expected ${EXPECTED_SCHEDULES.length} schedules, found ${actualSchedules.length}.`);
  }

  for (const expected of EXPECTED_SCHEDULES) {
    const actual = actualSchedules.find((schedule) => schedule.cron === expected.cron);

    if (!actual) {
      failures.push(`Missing ${expected.label} cron: ${expected.cron}`);
      continue;
    }

    if (actual.timezone !== expected.timezone) {
      failures.push(
        `${expected.label} cron should use timezone ${expected.timezone}, found ${actual.timezone || 'none'}.`
      );
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`[fail] ${failure}`);
    }
    process.exit(1);
  }
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function getMalaysiaParts(date) {
  const malaysiaDate = new Date(date.getTime() + MALAYSIA_OFFSET_MS);

  return {
    year: malaysiaDate.getUTCFullYear(),
    month: malaysiaDate.getUTCMonth() + 1,
    day: malaysiaDate.getUTCDate(),
    hour: malaysiaDate.getUTCHours(),
    minute: malaysiaDate.getUTCMinutes(),
    weekday: malaysiaDate.getUTCDay(),
  };
}

function malaysiaDateToUtc(year, month, day, hour, minute) {
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - MALAYSIA_OFFSET_MS);
}

function addMalaysiaDays(parts, days) {
  const utcDate = Date.UTC(parts.year, parts.month - 1, parts.day + days);
  const next = new Date(utcDate);

  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
    weekday: next.getUTCDay(),
  };
}

function allowsWeekday(field, weekday) {
  if (field === '*') {
    return true;
  }

  return field.split(',').some((part) => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      return weekday >= start && weekday <= end;
    }

    return Number(part) === weekday;
  });
}

function nextRuns(fromDate, limit = 6) {
  const runs = [];
  const fromMalaysia = getMalaysiaParts(fromDate);

  for (let dayOffset = 0; dayOffset < 21 && runs.length < limit; dayOffset++) {
    const day = addMalaysiaDays(fromMalaysia, dayOffset);

    for (const schedule of EXPECTED_SCHEDULES) {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.cron.split(/\s+/);

      if (dayOfMonth !== '*' || month !== '*') {
        throw new Error(`Unsupported cron shape in schedule verifier: ${schedule.cron}`);
      }

      if (!allowsWeekday(dayOfWeek, day.weekday)) {
        continue;
      }

      const runDate = malaysiaDateToUtc(
        day.year,
        day.month,
        day.day,
        Number(hour),
        Number(minute)
      );

      if (runDate > fromDate) {
        runs.push({ schedule, date: runDate });
      }
    }
  }

  return runs.sort((a, b) => a.date - b.date).slice(0, limit);
}

function formatMalaysia(date) {
  const parts = getMalaysiaParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)} MYT`;
}

function formatUtc(date) {
  return date.toISOString().replace(':00.000Z', 'Z');
}

function getFromDate() {
  const fromArg = process.argv.find((arg) => arg.startsWith('--from='));
  if (!fromArg) {
    return new Date();
  }

  const date = new Date(fromArg.slice('--from='.length));
  if (Number.isNaN(date.getTime())) {
    console.error(`[fail] Invalid --from date: ${fromArg}`);
    process.exit(1);
  }

  return date;
}

const workflowText = fs.readFileSync(WORKFLOW_FILE, 'utf8');
const actualSchedules = extractSchedules(workflowText);
assertExpectedSchedules(actualSchedules);

const fromDate = getFromDate();

console.log('[ok] scrape.yml has the expected weekday Malaysia-time schedules.');
console.log(`[info] Base time: ${formatMalaysia(fromDate)} / ${formatUtc(fromDate)}`);
console.log('[info] Next expected runs:');

for (const run of nextRuns(fromDate)) {
  console.log(`- ${run.schedule.label}: ${formatMalaysia(run.date)} / ${formatUtc(run.date)}`);
}
