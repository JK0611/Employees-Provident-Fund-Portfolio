const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'extracted_docx', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
    console.error('document.xml does not exist at', xmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// A simple regex to extract all w:t text
const matches = xml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
if (!matches) {
    console.log("No w:t elements found.");
    process.exit(0);
}

const textList = matches.map(m => {
    const content = m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
    return content;
});

// Write extracted text to a text file for inspection
fs.writeFileSync(path.join(__dirname, 'extracted_text.txt'), textList.join('\n'));
console.log(`Extracted ${textList.length} text fragments to scratch/extracted_text.txt`);

// Let's also look for URLs or TradingView symbol paths specifically
const urls = [];
const urlRegex = /https?:\/\/[^\s"<>]+/g;
let match;
while ((match = urlRegex.exec(xml)) !== null) {
    urls.push(match[0]);
}
fs.writeFileSync(path.join(__dirname, 'extracted_urls.txt'), [...new Set(urls)].join('\n'));
console.log(`Extracted ${urls.length} URLs to scratch/extracted_urls.txt`);
