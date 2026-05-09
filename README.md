# Build System Documentation
## Generating Domain Study Documents (D1-D10)

---

## 📋 Overview

This directory contains a Node.js-based build system that generates professional Word documents (.docx) for each Databricks Certified Data Engineer Professional domain (D1-D10). The build scripts compile structured domain data into beautifully formatted study guides with tables of contents, exam traps, and comprehensive topic coverage.

---

## 📁 File Structure

### Build Scripts
```
build_d_helpers.js     → Shared helper module (formatting, styling, document generation)
build_d1_full.js       → Domain 1: Developing Code for Data Processing
build_d2_full.js       → Domain 2: Data Ingestion & Acquisition  
build_d3_full.js       → Domain 3: Data Transformation, Cleansing & Quality
build_d4_full.js       → Domain 4: Data Sharing & Federation
build_d5_full.js       → Domain 5: Monitoring and Alerting
build_d6_full.js       → Domain 6: Cost and Performance Optimization
build_d7_full.js       → Domain 7: Ensuring Data Security & Compliance
build_d8_full.js       → Domain 8: Data Governance
build_d9_full.js       → Domain 9: Debugging and Deploying
build_d10_full.js      → Domain 10: Data Modelling
```

### Generated Output (`.docx` files)
```
Domain1_Complete_Study_Notes.docx   ← Generated from build_d1_full.js
Domain2_Complete_Study_Notes.docx   ← Generated from build_d2_full.js
... (D3-D10 similarly)
```

---

## 🛠️ Prerequisites

### Required Node.js Version
- Node.js 14 or higher
- npm (Node Package Manager)

### Required Packages
Install the `docx` package (for Word document generation):

```bash
npm install docx
```

Or install from the workspace directory:
```bash
cd /Users/mohammednadhims/Downloads/Ibrahim_Data
npm install docx
```

---

## ▶️ How to Run the Build Scripts

### Option 1: Build a Single Domain

Run a specific domain build script:

```bash
# Build Domain 1
node build_d1_full.js

# Build Domain 5
node build_d5_full.js

# Build Domain 10
node build_d10_full.js
```

### Option 2: Build All Domains at Once

Create a batch script or run sequentially:

```bash
# macOS / Linux
for i in {1..10}; do node build_d${i}_full.js; done

# Or individually with timestamps
node build_d1_full.js && echo "✓ D1 complete" && \
node build_d2_full.js && echo "✓ D2 complete" && \
node build_d3_full.js && echo "✓ D3 complete" && \
node build_d4_full.js && echo "✓ D4 complete" && \
node build_d5_full.js && echo "✓ D5 complete" && \
node build_d6_full.js && echo "✓ D6 complete" && \
node build_d7_full.js && echo "✓ D7 complete" && \
node build_d8_full.js && echo "✓ D8 complete" && \
node build_d9_full.js && echo "✓ D9 complete" && \
node build_d10_full.js && echo "✓ D10 complete"
```

### Option 3: npm Scripts (Recommended)

Create an `package.json` file in the directory:

```json
{
  "name": "databricks-study-docs",
  "version": "1.0.0",
  "description": "Build system for Databricks certification study documents",
  "scripts": {
    "build": "npm run build:all",
    "build:all": "npm run build:d1 && npm run build:d2 && npm run build:d3 && npm run build:d4 && npm run build:d5 && npm run build:d6 && npm run build:d7 && npm run build:d8 && npm run build:d9 && npm run build:d10",
    "build:d1": "node build_d1_full.js",
    "build:d2": "node build_d2_full.js",
    "build:d3": "node build_d3_full.js",
    "build:d4": "node build_d4_full.js",
    "build:d5": "node build_d5_full.js",
    "build:d6": "node build_d6_full.js",
    "build:d7": "node build_d7_full.js",
    "build:d8": "node build_d8_full.js",
    "build:d9": "node build_d9_full.js",
    "build:d10": "node build_d10_full.js"
  },
  "dependencies": {
    "docx": "^8.12.0"
  }
}
```

Then run:
```bash
npm install
npm run build        # Build all domains
npm run build:d5     # Build Domain 5 only
npm run build:all    # Explicitly build all
```

---

## 📄 What Each Build Script Does

### Structure of Build Scripts

Each domain build script (`build_d#_full.js`) follows this pattern:

```javascript
// 1. Import helper module
const { buildAndWrite } = require('./build_d_helpers.js');

// 2. Define Table of Contents (TOC)
const tocConfig = {
  title: 'TABLE OF CONTENTS',
  subtitle: 'Domain X — Description — N Sub-Topics',
  groups: [
    ['Section Label', [
      ['01', 'Section.Topic', 'Topic Title'],
      ['02', 'Section.Topic', 'Topic Title'],
      // ... more entries
    ]],
    // ... more sections
  ],
};

// 3. Define Exam Traps Summary
const summaryConfig = {
  title: 'EXAM TRAPS MASTER SUMMARY',
  subtitle: 'Domain X — Description — All High-Priority Traps',
};

// 4. Define all topic pages with structured content
const pages = [
  {
    num: '01',
    title: '1.1.1 — Topic Title',
    what: ['point 1', 'point 2'],        // WHAT IT IS
    how: ['mechanism 1', 'mechanism 2'],   // HOW IT WORKS
    facts: ['fact 1', 'fact 2'],           // KEY FACTS
    ascii: true,                          // Use ASCII FLOW instead of CODE EXAMPLE
    code: ['line 1', 'line 2'],           // Code or ASCII flow lines
    mistakes: ['mistake 1', 'mistake 2'], // COMMON MISTAKES
    trap: ['trap 1', 'trap 2'],           // ⚠️ EXAM TRAP
  },
  // ... more pages
];

// 5. Call helper to build and write the document
buildAndWrite({
  pages,
  tocConfig,
  summaryConfig,
  outPath: './Domain1_Complete_Study_Notes.docx'
});
```

---

## 📊 Generated Document Structure

Each generated .docx file contains:

### 1. **Title Page** with stats
- Domain number and title
- Sub-topic count
- Section count
- Exam traps count
- Code/ASCII examples count
- Overview section matrix

### 2. **Table of Contents (TOC)**
- Organized by sections
- All sub-topics listed with:
  - Topic number
  - Topic code (e.g., 1.1.1)
  - Topic title
- Alternating row colors for readability

### 3. **Topic Pages** (Main Content)
Each topic page includes 6-7 sections with color-coded backgrounds:

| Section | Color | Content |
|---------|-------|---------|
| **WHAT IT IS** | Blue | Concept definitions and overview |
| **HOW IT WORKS** | Blue | Mechanisms and workflows |
| **KEY FACTS** | Green | Important points to memorize |
| **CODE / ASCII FLOW** | Light Blue | Code examples or ASCII diagrams |
| **COMMON MISTAKES** | Orange | Pitfalls to avoid (with left border accent) |
| **⚠️ EXAM TRAP** | Red | Exam-specific gotchas (with left border accent) |

### 4. **Exam Traps Master Summary**
- Compilation of all exam traps from every topic
- Quick reference for last-minute review
- Red background for emphasis

---

## 🎨 Document Styling & Features

### Color Scheme
```
Navy:      #1F3864 (headers)
Blue:      #D6E4F0 (WHAT IT IS, HOW IT WORKS sections)
Green:     #EAF4E8 (KEY FACTS section)
Grey:      #F2F2F2 (CODE EXAMPLE background)
Code Blue: #EBF5FB (ASCII FLOW background)
Orange:    #FEF3E2 (COMMON MISTAKES section)
Red:       #FDECEA (EXAM TRAP section)
```

### Typography
- **Font**: Arial (main text), Courier New (code/mono text)
- **Header Size**: 22pt for topic numbers, 28pt for main headers
- **Body Size**: 18pt for bullet points, 17pt for code
- **Spacing**: Optimized for readability with 60-100pt before/after sections

### Table Layout
- Full-width tables (9360 DXA units)
- Borders between sections
- Accent left borders (18pt) for COMMON MISTAKES and EXAM TRAP sections
- Proper vertical alignment (TOP)
- Generous margins for readability

### Formatting Features
- **Bullets**: Numbered for TOC entries, standard bullets for content
- **X-bullets**: Special accent bullets for COMMON MISTAKES and EXAM TRAP
- **Page Breaks**: Between each topic for clean document flow
- **Monospace**: Courier New for code and command examples

---

## 📝 Output Examples

### Example 1: Running a single build
```bash
$ node build_d1_full.js
✓ Domain1_Complete_Study_Notes.docx generated successfully
```

### Example 2: Building all domains
```bash
$ npm run build:all
✓ Domain1_Complete_Study_Notes.docx generated
✓ Domain2_Complete_Study_Notes.docx generated
✓ Domain3_Complete_Study_Notes.docx generated
✓ Domain4_Complete_Study_Notes.docx generated
✓ Domain5_Complete_Study_Notes.docx generated
✓ Domain6_Complete_Study_Notes.docx generated
✓ Domain7_Complete_Study_Notes.docx generated
✓ Domain8_Complete_Study_Notes.docx generated
✓ Domain9_Complete_Study_Notes.docx generated
✓ Domain10_Complete_Study_Notes.docx generated
```

---

## 🔧 Customization & Modification

### Adding a New Topic to an Existing Domain

1. Open the relevant build file (e.g., `build_d1_full.js`)
2. Find the `pages` array section
3. Add a new page object:

```javascript
{
  num: '07',  // Next available number
  title: '1.3.1 — New Topic Title',
  what: [
    'First definition point',
    'Second definition point',
  ],
  how: [
    'How it works point 1',
    'How it works point 2',
  ],
  facts: [
    'Key fact 1',
    'Key fact 2',
  ],
  code: [
    '# Example code line 1',
    '# Example code line 2',
  ],
  mistakes: [
    '✗ Common mistake 1',
    '✗ Common mistake 2',
  ],
  trap: [
    '✗ Exam trap 1',
    '✗ Exam trap 2',
  ],
}
```

4. Update the `tocConfig` to include the new topic in the appropriate section
5. Run: `node build_d#_full.js` to regenerate the document

### Changing Document Output Location

Modify the `outPath` parameter in the `buildAndWrite()` call:

```javascript
buildAndWrite({
  pages,
  tocConfig,
  summaryConfig,
  outPath: './output/Domain1_Study_Notes.docx'  // Custom path
});
```

### Adjusting Colors

Edit the color constants in `build_d_helpers.js`:

```javascript
const C = {
  navy:      '1F3864',   // Header navy blue
  blue:      'D6E4F0',   // WHAT IT IS / HOW IT WORKS
  green:     'EAF4E8',   // KEY FACTS
  grey:      'F2F2F2',   // CODE EXAMPLE
  orange:    'FEF3E2',   // COMMON MISTAKES
  red:       'FDECEA',   // EXAM TRAP
  // ... other colors
};
```

---

## ⚠️ Troubleshooting

### Issue: "Cannot find module 'docx'"
**Solution**: Install the docx package
```bash
npm install docx
```

### Issue: Permission denied when running script
**Solution**: Make the script executable
```bash
chmod +x build_d1_full.js
```

### Issue: .docx file not created
**Solution**: Check for Node.js errors
```bash
node build_d1_full.js 2>&1 | head -20
```

### Issue: Document is corrupted or won't open
**Solution**: Ensure docx package version matches (8.12.0+)
```bash
npm list docx
npm install docx@latest --save
```

---

## 📊 Document Statistics

### Domain 1
- **Sub-Topics**: 75
- **Sections**: 12
- **Exam Traps**: 150+
- **Code/ASCII Examples**: 75+

### Domain 2
- **Sub-Topics**: 15
- **Sections**: 5
- **Code Examples**: 15+

### Domain 3
- **Sub-Topics**: 27
- **Sections**: 4

*(Statistics vary by domain - see individual build_d#_full.js files for precise numbers)*

---

## 🔄 Batch Processing

### Generate all domains with logging
```bash
#!/bin/bash
# save as build_all.sh
set -e
DOMAINS=(1 2 3 4 5 6 7 8 9 10)
for domain in "${DOMAINS[@]}"; do
  echo "Building Domain $domain..."
  node build_d${domain}_full.js && echo "✓ Domain $domain complete" || echo "✗ Domain $domain failed"
done
echo "All domains built!"
```

Run with:
```bash
chmod +x build_all.sh
./build_all.sh
```

---

## 🚀 Advanced Usage

### Integration with CI/CD

Add to GitHub Actions workflow:
```yaml
name: Generate Study Documents
on: [push]
jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build:all
      - uses: actions/upload-artifact@v2
        with:
          name: study-documents
          path: Domain*.docx
```

### Watch Mode for Development

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Watch for changes and rebuild automatically
nodemon --watch build_d1_full.js --exec "node build_d1_full.js"
```

---

## 📚 Output File Locations

All generated documents are saved in the current working directory by default:

```
/Users/mohammednadhims/Downloads/Ibrahim_Data/
├── Domain1_Complete_Study_Notes.docx
├── Domain2_Complete_Study_Notes.docx
├── Domain3_Complete_Study_Notes.docx
├── Domain4_Complete_Study_Notes.docx
├── Domain5_Complete_Study_Notes.docx
├── Domain6_Complete_Study_Notes.docx
├── Domain7_Complete_Study_Notes.docx
├── Domain8_Complete_Study_Notes.docx
├── Domain9_Complete_Study_Notes.docx
└── Domain10_Complete_Study_Notes.docx
```

---

## ✅ Verification Checklist

After running build scripts:

- [ ] .docx files are created in the correct directory
- [ ] File sizes are reasonable (typically 500KB-2MB per domain)
- [ ] Documents open without corruption in Microsoft Word or Google Docs
- [ ] Table of contents displays correctly
- [ ] All colors and formatting appear as expected
- [ ] Topic pages have all 6-7 sections
- [ ] Page breaks are present between topics
- [ ] Exam traps summary is at the end

---

## 📞 Support & Documentation

### Dependencies
- **docx** (npm package): Document generation library
  - [npm docx](https://www.npmjs.com/package/docx)
  - [GitHub docx-js](https://github.com/dolanmiu/docx)

### Further Customization
Edit `build_d_helpers.js` to modify:
- Default table width and margins
- Color scheme
- Font families and sizes
- Border styles and spacing
- Bullet formatting

---

## 📝 Quick Start Checklist

1. ✅ Install Node.js 14+
2. ✅ Navigate to the directory: `cd /Users/mohammednadhims/Downloads/Ibrahim_Data`
3. ✅ Install dependencies: `npm install docx`
4. ✅ Run a build: `node build_d1_full.js`
5. ✅ Open the generated `.docx` file to verify
6. ✅ Build all domains: `for i in {1..10}; do node build_d${i}_full.js; done`

---

**Last Updated**: May 2026  
**Build System Version**: 1.0  
**Document Library**: docx v8.12.0+
