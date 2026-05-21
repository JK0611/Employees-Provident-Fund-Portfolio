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

// Helper to split a string into URL + trailing company name segments
function parseParagraphText(text) {
    const httpIndices = [];
    const httpRegex = /https?:\/\//g;
    let match;
    while ((match = httpRegex.exec(text)) !== null) {
        httpIndices.push(match.index);
    }
    
    if (httpIndices.length === 0) {
        return {
            isUrlContainer: false,
            text: text
        };
    }
    
    const leadingCompany = text.substring(0, httpIndices[0]).trim();
    const urlsAndTrailing = [];
    
    for (let i = 0; i < httpIndices.length; i++) {
        const start = httpIndices[i];
        const end = (i + 1 < httpIndices.length) ? httpIndices[i + 1] : text.length;
        const segment = text.substring(start, end).trim();
        
        // Separate the URL from any trailing company name
        const extRegex = /\.(svg|png|jpg|jpeg|gif)/i;
        const extMatch = extRegex.exec(segment);
        
        let url = segment;
        let trailingCompany = "";
        
        if (extMatch) {
            const extEndIdx = extMatch.index + extMatch[0].length;
            url = segment.substring(0, extEndIdx).trim();
            trailingCompany = segment.substring(extEndIdx).trim();
        } else {
            console.warn(`URL segment does not contain a known image extension: "${segment}"`);
        }
        
        urlsAndTrailing.push({
            url,
            trailingCompany
        });
    }
    
    return {
        isUrlContainer: true,
        leadingCompany,
        urlsAndTrailing
    };
}

for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i];
    const parsed = parseParagraphText(text);
    
    if (!parsed.isUrlContainer) {
        if (pendingCompany) {
            console.warn(`Warning: Overwriting pending company "${pendingCompany}" with "${parsed.text}" without matching a URL`);
        }
        pendingCompany = parsed.text;
    } else {
        if (parsed.leadingCompany) {
            if (pendingCompany) {
                console.warn(`Warning: Overwriting pending company "${pendingCompany}" with leading company "${parsed.leadingCompany}"`);
            }
            pendingCompany = parsed.leadingCompany;
        }
        
        for (const item of parsed.urlsAndTrailing) {
            if (pendingCompany) {
                mappings.push({
                    company: pendingCompany,
                    logo_url: item.url
                });
                pendingCompany = null;
            } else {
                console.error(`ERROR: URL "${item.url}" has no pending company!`);
            }
            
            if (item.trailingCompany) {
                pendingCompany = item.trailingCompany;
            }
        }
    }
}

if (pendingCompany) {
    console.warn(`Warning: Trailing pending company at the end: "${pendingCompany}"`);
}

// Clean up HTML entities and whitespace
const finalMappings = mappings.map(m => {
    let company = m.company.replace(/&amp;/gi, '&').replace(/\n/g, '').replace(/\r/g, '').trim();
    let logo_url = m.logo_url.replace(/&amp;/gi, '&').trim();
    return { company, logo_url };
});

console.log(`Successfully mapped ${finalMappings.length} companies to logos.`);
fs.writeFileSync(path.join(__dirname, 'perfect_mappings.json'), JSON.stringify(finalMappings, null, 4));
console.log('Saved to scratch/perfect_mappings.json');
