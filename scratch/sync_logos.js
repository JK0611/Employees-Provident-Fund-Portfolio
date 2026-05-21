const fs = require('fs');
const path = require('path');

// 1. Read perfect mappings
const mappingsPath = path.join(__dirname, 'perfect_mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

// 2. Normalize and clean the list for logo.json
// We will write this list to Logo/logo.json and frontend/logo.json
// Keep the casing readable, but clean up names
const logoJsonList = mappings.map(m => {
    // E.g. Mbsb -> MBSB, pbbank -> PBBANK, cimb -> CIMB, but Axiata -> Axiata
    let company = m.company.trim();
    if (['mbsb', 'pbbank', 'cimb', 'rhb', 'ytl', 'cbd', 'ihh', 'sdg', 'mrdiy', 'ioicorp'].includes(company.toLowerCase())) {
        company = company.toUpperCase();
    }
    return {
        company: company,
        logo_url: m.logo_url
    };
});

// Save to Logo/logo.json and frontend/logo.json
const logoJsonStr = JSON.stringify(logoJsonList, null, 4);
const rootLogoPath = path.join(__dirname, '..', 'Logo', 'logo.json');
const frontendLogoPath = path.join(__dirname, '..', 'frontend', 'logo.json');

fs.writeFileSync(rootLogoPath, logoJsonStr);
console.log('Saved updated Logo/logo.json');

fs.writeFileSync(frontendLogoPath, logoJsonStr);
console.log('Saved updated frontend/logo.json');

// 3. Build fallbackTvLogos map for frontend/app.js
const fallbackTvLogos = {};

// We map all parsed logos in uppercase
mappings.forEach(m => {
    const key = m.company.toUpperCase().trim();
    fallbackTvLogos[key] = m.logo_url;
});

// Add robust aliases
if (fallbackTvLogos['RHB'] && !fallbackTvLogos['RHBBANK']) {
    fallbackTvLogos['RHBBANK'] = fallbackTvLogos['RHB'];
}
if (fallbackTvLogos['RHBBANK'] && !fallbackTvLogos['RHB']) {
    fallbackTvLogos['RHB'] = fallbackTvLogos['RHBBANK'];
}
if (fallbackTvLogos['CBD']) {
    fallbackTvLogos['CDB'] = fallbackTvLogos['CBD'];
    fallbackTvLogos['CELCOMDIGI'] = fallbackTvLogos['CBD'];
}
if (fallbackTvLogos['CDB']) {
    fallbackTvLogos['CBD'] = fallbackTvLogos['CDB'];
    fallbackTvLogos['CELCOMDIGI'] = fallbackTvLogos['CDB'];
}
if (fallbackTvLogos['DIALOG GROUP'] && !fallbackTvLogos['DIALOG']) {
    fallbackTvLogos['DIALOG'] = fallbackTvLogos['DIALOG GROUP'];
}
if (fallbackTvLogos['DIALOG'] && !fallbackTvLogos['DIALOG GROUP']) {
    fallbackTvLogos['DIALOG GROUP'] = fallbackTvLogos['DIALOG'];
}

// Convert map to formatted JS object string
let jsMapString = 'const fallbackTvLogos = {\n';
const keys = Object.keys(fallbackTvLogos).sort();
keys.forEach((key, idx) => {
    const comma = idx === keys.length - 1 ? '' : ',';
    jsMapString += `  '${key}': '${fallbackTvLogos[key]}'${comma}\n`;
});
jsMapString += '};';

// 4. Read frontend/app.js and replace fallbackTvLogos
const appJsPath = path.join(__dirname, '..', 'frontend', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Find the block from "const fallbackTvLogos = {" to "};"
const startMarker = 'const fallbackTvLogos = {';
const startIdx = appJsContent.indexOf(startMarker);
if (startIdx === -1) {
    console.error('Could not find fallbackTvLogos in frontend/app.js');
    process.exit(1);
}

// Find the closing }; of fallbackTvLogos
// We look for the first }; after startIdx
const endIdx = appJsContent.indexOf('};', startIdx);
if (endIdx === -1) {
    console.error('Could not find end of fallbackTvLogos in frontend/app.js');
    process.exit(1);
}

const originalBlock = appJsContent.substring(startIdx, endIdx + 2);
appJsContent = appJsContent.replace(originalBlock, jsMapString);

fs.writeFileSync(appJsPath, appJsContent);
console.log('Successfully updated fallbackTvLogos in frontend/app.js');
