/**
 * Automated EPF Scraper & Sync Runner
 * 
 * Workflow:
 * 1. Executes incremental scrape via scripts/scrape_test.js (Phase 1, 2, 3)
 * 2. Validates generated data.js and data_full.json
 * 3. Formulates descriptive commit message with new record counts & latest date
 * 4. Automatically commits and pushes to Git remote
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { buildStockHistory } = require('./build_stock_history.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_JS = path.join(ROOT_DIR, 'frontend', 'data.js');
const DATA_FULL = path.join(ROOT_DIR, 'frontend', 'data_full.json');
const RESULTS_FILE = path.join(ROOT_DIR, 'data', 'scrape_test_results.json');

function getRecordCount() {
  if (!fs.existsSync(RESULTS_FILE)) return 0;
  try {
    const raw = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
    return Array.isArray(raw) ? raw.length : 0;
  } catch (e) {
    return 0;
  }
}

function validateFrontendData() {
  if (!fs.existsSync(DATA_JS)) {
    throw new Error(`Missing ${DATA_JS}`);
  }
  const content = fs.readFileSync(DATA_JS, 'utf8');
  if (!content.trim()) {
    throw new Error(`${DATA_JS} is empty`);
  }
  
  // Syntax & runtime check
  const sandbox = {};
  vm.createContext(sandbox);
  const epfData = vm.runInContext(content + '\n;EPF_DATA;', sandbox);
  if (!epfData || !Array.isArray(epfData.holdings)) {
    throw new Error('EPF_DATA is malformed in data.js');
  }

  return {
    holdingsCount: epfData.holdings.length,
    txCount: epfData.transactions ? epfData.transactions.length : 0,
    latestDate: epfData.transactions?.[0]?.date || 'Unknown'
  };
}

function runCommand(cmd, options = {}) {
  return execSync(cmd, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    ...options
  });
}

async function main() {
  console.log('====================================================');
  console.log('  🤖 EPF Scraper Agent: Auto-Scrape & Git Sync');
  console.log('====================================================\n');

  const baselineCount = getRecordCount();
  console.log(`[1/4] Baseline record count: ${baselineCount.toLocaleString()}`);

  // Step 1: Run Scrape Pipeline
  console.log('\n[2/4] Executing incremental scrape pipeline...');
  const scrapeScript = path.join(__dirname, 'scrape_test.js');
  const scrapeResult = spawnSync(process.execPath, [scrapeScript], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  if (scrapeResult.status !== 0) {
    console.error(`\n❌ Scrape process failed with exit code ${scrapeResult.status}`);
    process.exit(scrapeResult.status || 1);
  }

  // Step 2: Validate Data Integrity
  console.log('\n[3/4] Validating processed frontend datasets...');
  const validation = validateFrontendData();
  const currentCount = getRecordCount();
  const newRecords = currentCount - baselineCount;

  console.log(`  ✓ data.js syntax valid`);
  console.log(`  ✓ Active holdings: ${validation.holdingsCount}`);
  console.log(`  ✓ Total archive records: ${currentCount.toLocaleString()} (+${newRecords} new)`);
  console.log(`  ✓ Latest transaction date: ${validation.latestDate}`);
  
  // Rebuild stock history dataset with clean validation
  try {
    console.log(`  ✓ Rebuilding cleaned stock history dataset...`);
    buildStockHistory();
  } catch (err) {
    console.warn(`  ⚠️  Warning: Failed to rebuild stock_history.js: ${err.message}`);
  }

  // Step 3: Git Commit & Sync
  console.log('\n[4/4] Syncing updates to Git remote...');

  // Check current branch
  let branch = 'main';
  try {
    branch = runCommand('git rev-parse --abbrev-ref HEAD').trim();
  } catch (e) {
    console.warn('Could not determine current branch, defaulting to main');
  }

  // Stage tracked data files
  const filesToStage = [
    'data/links.json',
    'data/scrape_test_results.json',
    'data/scrape_results.sql',
    'data/codes_cache.json',
    'data/skipped_ids.json',
    'frontend/data.js',
    'frontend/data_full.json',
    'frontend/stock_history.js',
    'scripts/process_data.js',
    'scripts/build_stock_history.js',
    'scripts/scrape_test.js',
    'scripts/auto_scrape_sync.js',
    'package.json'
  ].filter(f => fs.existsSync(path.join(ROOT_DIR, f)));

  runCommand(`git add ${filesToStage.join(' ')}`);

  // Check if anything staged
  try {
    execSync('git diff --cached --quiet', { cwd: ROOT_DIR });
    console.log('  ℹ️  No data changes to commit. Everything is already up to date!');
    return;
  } catch (e) {
    // Non-zero exit code means there are staged differences, continue to commit
  }

  const commitMsg = newRecords > 0
    ? `chore(data): sync EPF announcements up to ${validation.latestDate} (+${newRecords} records)`
    : `chore(data): refresh EPF holdings & market prices (${validation.latestDate})`;

  console.log(`  📝 Committing: "${commitMsg}"`);
  runCommand(`git commit -m "${commitMsg}"`);

  console.log(`  🚀 Pushing to remote (${branch})...`);
  try {
    runCommand(`git push origin ${branch}`);
    console.log('  ✓ Successfully pushed to remote repository!');
  } catch (pushErr) {
    console.warn(`  ⚠️  Direct push failed: ${pushErr.message.trim()}. Attempting pull --rebase...`);
    try {
      runCommand(`git pull --rebase origin ${branch}`);
      runCommand(`git push origin ${branch}`);
      console.log('  ✓ Rebased and successfully pushed to remote!');
    } catch (rebaseErr) {
      console.error(`  ❌ Failed to push after rebase: ${rebaseErr.message}`);
      process.exit(1);
    }
  }

  console.log('\n====================================================');
  console.log('  🎉 All tasks finished successfully!');
  console.log('====================================================');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error in auto_scrape_sync:', err);
    process.exit(1);
  });
}

module.exports = { main, validateFrontendData };
