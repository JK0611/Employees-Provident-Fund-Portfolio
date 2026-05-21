const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'extracted_docx', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
    console.error('document.xml does not exist');
    process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// Extract all paragraphs
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

console.log(`Found ${paragraphs.length} paragraphs`);

const mappings = [];
let pendingCompany = null;

for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i];
    
    // Check if it contains http:// or https://
    const httpIdx = text.indexOf('http://') !== -1 ? text.indexOf('http://') : text.indexOf('https://');
    
    if (httpIdx !== -1) {
        if (httpIdx === 0) {
            // Standalone URL
            if (pendingCompany) {
                mappings.push({
                    company: pendingCompany,
                    logo_url: text
                });
                pendingCompany = null;
            } else {
                console.warn(`Standalone URL without pending company at paragraph ${i}: "${text}"`);
            }
        } else {
            // Inline Company + URL
            const comp = text.substring(0, httpIdx).trim();
            const url = text.substring(httpIdx).trim();
            mappings.push({
                company: comp,
                logo_url: url
            });
            pendingCompany = null; // Clear if we had anything pending
        }
    } else {
        // It's a company name (or some other text like header)
        if (pendingCompany) {
            console.log(`Overwriting pending company "${pendingCompany}" with "${text}" at paragraph ${i}`);
        }
        pendingCompany = text;
    }
}

// Check if any pending company left at the end
if (pendingCompany) {
    console.warn(`Trailing pending company at the end: "${pendingCompany}"`);
}

// Clean up company names and URLs
const cleanMappings = mappings.map(m => {
    // Clean company name
    let company = m.company;
    // Replace HTML entities like &amp; with &
    company = company.replace(/&amp;/gi, '&');
    // If it's something like "I\noicorp", replace newlines
    company = company.replace(/\n/g, '').replace(/\r/g, '');
    
    // Clean URL
    let logo_url = m.logo_url;
    // If URL contains HTML entities, clean it
    logo_url = logo_url.replace(/&amp;/gi, '&');
    
    return {
        company,
        logo_url
    };
});

console.log(`Successfully mapped ${cleanMappings.length} companies to logos.`);
fs.writeFileSync(path.join(__dirname, 'parsed_mappings.json'), JSON.stringify(cleanMappings, null, 4));
console.log('Saved to scratch/parsed_mappings.json');
