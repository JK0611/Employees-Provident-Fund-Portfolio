const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'extracted_docx', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let pMatch;
const paragraphs = [];

while ((pMatch = pRegex.exec(xml)) !== null) {
    const pContent = pMatch[1];
    const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
    let tMatch;
    let pText = "";
    while ((tMatch = tRegex.exec(pContent)) !== null) {
        pText += tMatch[1];
    }
    const cleanText = pText.trim();
    if (cleanText) {
        paragraphs.push(cleanText);
    }
}

const output = paragraphs.map((p, i) => `${i}: ${p}`).join('\n');
fs.writeFileSync(path.join(__dirname, 'paragraphs_with_index.txt'), output);
console.log('Saved paragraphs_with_index.txt');
