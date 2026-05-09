'use strict';
// Shared helpers for Domain build scripts (d3 through d10).
// Each per-domain script requires this module and supplies its own pages, TOC groups, and stats.

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak
} = require('docx');
const fs = require('fs');

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  navy:'1F3864', navyText:'FFFFFF',
  blue:'D6E4F0', green:'EAF4E8',
  grey:'F2F2F2', codeBlue:'EBF5FB',
  orange:'FEF3E2', red:'FDECEA',
  borderRed:'C0392B', borderOrg:'E67E22',
  white:'FFFFFF', ltNavy:'D6DCE4', silver:'F4F6F7',
};
const TW = 9360;

// ── Borders ───────────────────────────────────────────────────────────────────
const noBdr  = () => ({ style:BorderStyle.NONE, size:0, color:'FFFFFF' });
const noBdrs = () => ({ top:noBdr(),bottom:noBdr(),left:noBdr(),right:noBdr() });
const sBdr   = (c,s=4) => ({ style:BorderStyle.SINGLE, size:s, color:c });
const allBdrs= (c,s=4) => ({ top:sBdr(c,s),bottom:sBdr(c,s),left:sBdr(c,s),right:sBdr(c,s) });

// ── Text ──────────────────────────────────────────────────────────────────────
const txt = (t, o={}) => new TextRun({ text:String(t), font:'Arial', ...o });

// ── Cells ─────────────────────────────────────────────────────────────────────
function stdCell(children, fill, w=TW, borders=null) {
  return new TableCell({
    width:{size:w,type:WidthType.DXA},
    shading:{fill,type:ShadingType.CLEAR},
    borders: borders || noBdrs(),
    margins:{top:100,bottom:100,left:160,right:160},
    verticalAlign:VerticalAlign.TOP, children,
  });
}
function accentCell(children, fill, accent) {
  return new TableCell({
    width:{size:TW,type:WidthType.DXA},
    shading:{fill,type:ShadingType.CLEAR},
    borders:{top:noBdr(),bottom:noBdr(),right:noBdr(),left:sBdr(accent,18)},
    margins:{top:100,bottom:100,left:220,right:160},
    verticalAlign:VerticalAlign.TOP, children,
  });
}

// ── Paragraphs ────────────────────────────────────────────────────────────────
const row  = ch => new TableRow({children:ch});
const sp   = ()  => new Paragraph({children:[txt('')]});

function secLabel(label, color='333333') {
  return new Paragraph({spacing:{before:60,after:40},
    children:[txt(label,{bold:true,color,size:19})]});
}
function bul(text) {
  return new Paragraph({numbering:{reference:'bullets',level:0},spacing:{before:22,after:22},
    children:[txt(text,{size:18})]});
}
function xbul(text) {
  return new Paragraph({numbering:{reference:'xbullets',level:0},spacing:{before:20,after:20},
    children:[txt(text,{size:18})]});
}
function mono(text) {
  return new Paragraph({spacing:{before:7,after:7},
    children:[new TextRun({text:String(text),font:'Courier New',size:17})]});
}
function pageBreak() { return new Paragraph({children:[new PageBreak()]}); }

// ── Row helpers ───────────────────────────────────────────────────────────────
function secRow(label, fill, tc='333333') {
  return row([stdCell([secLabel(label,tc)],fill,TW)]);
}
function contentRow(paras,fill){ return row([stdCell(paras,fill,TW)]); }
function accentRow(paras,fill,accent){ return row([accentCell(paras,fill,accent)]); }

function headerRow(num, title) {
  return row([new TableCell({
    width:{size:TW,type:WidthType.DXA},
    shading:{fill:C.navy,type:ShadingType.CLEAR},
    borders:noBdrs(),
    margins:{top:140,bottom:140,left:200,right:200},
    children:[new Paragraph({spacing:{before:0,after:0},children:[
      txt(num+'  ',{bold:true,color:'A8C8E8',size:22}),
      txt(title,  {bold:true,color:C.navyText,size:22}),
    ]})],
  })]);
}

// ── PAGE BUILDER ──────────────────────────────────────────────────────────────
function buildPage(p) {
  const rows = [];
  rows.push(headerRow(p.num, p.title));

  if (p.what && p.what.length) {
    rows.push(secRow('WHAT IT IS', C.blue,'1A5276'));
    rows.push(contentRow(p.what.map(bul), C.blue));
  }
  if (p.how && p.how.length) {
    rows.push(secRow('HOW IT WORKS', C.blue,'1A5276'));
    rows.push(contentRow(p.how.map(bul), C.blue));
  }
  if (p.facts && p.facts.length) {
    rows.push(secRow('KEY FACTS', C.green,'1E8449'));
    rows.push(contentRow(p.facts.map(bul), C.green));
  }
  if (p.code && p.code.length) {
    const isAscii = p.ascii === true;
    rows.push(secRow(isAscii ? 'ASCII FLOW' : 'CODE EXAMPLE', isAscii ? C.codeBlue : C.grey,'2C3E50'));
    rows.push(contentRow(p.code.map(mono), isAscii ? C.codeBlue : C.grey));
  }
  if (p.mistakes && p.mistakes.length) {
    rows.push(secRow('COMMON MISTAKES', C.orange,'784212'));
    rows.push(accentRow(p.mistakes.map(xbul), C.orange, C.borderOrg));
  }
  if (p.trap && p.trap.length) {
    rows.push(secRow('⚠  EXAM TRAP', C.red,'922B21'));
    rows.push(accentRow(p.trap.map(xbul), C.red, C.borderRed));
  }

  return [
    new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],rows}),
    pageBreak(),
  ];
}

// ── TOC PAGE (parameterized) ──────────────────────────────────────────────────
// config: { title, subtitle, groups: [[label, [[num, code, title], ...]], ...] }
function tocPage(config) {
  const rows = [];
  rows.push(row([stdCell([
    new Paragraph({spacing:{before:100,after:60},
      children:[txt(config.title || 'TABLE OF CONTENTS',{bold:true,color:C.navyText,size:28})]}),
    new Paragraph({spacing:{before:0,after:100},
      children:[txt(config.subtitle || '',{color:'A8C8E8',size:20})]}),
  ],C.navy,TW)]));

  for (const [label, entries] of config.groups) {
    rows.push(row([stdCell([new Paragraph({spacing:{before:60,after:20},
      children:[txt(label,{bold:true,color:C.navy,size:18})]})],
      C.ltNavy,TW)]));

    for (const e of entries) {
      rows.push(row([stdCell([new Paragraph({spacing:{before:14,after:14},children:[
        txt(e[0]+'  ',{bold:true,color:C.navy,size:16}),
        txt(e[1]+'  —  ',{bold:true,color:'555555',size:14}),
        txt(e[2],{size:14,color:'222222'}),
      ]})], parseInt(e[0])%2===0 ? 'F8F9FA' : C.white, TW)]));
    }
  }

  return [new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],rows}),pageBreak()];
}

// ── EXAM TRAPS SUMMARY ────────────────────────────────────────────────────────
// pages: array of page objects (each must have num, title, trap)
// config: { title, subtitle }
function summaryPage(pages, config) {
  const rows=[];
  rows.push(row([stdCell([
    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:100,after:60},
      children:[txt(config.title || 'EXAM TRAPS MASTER SUMMARY',{bold:true,color:C.navyText,size:28})]}),
    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:100},
      children:[txt(config.subtitle || '',{color:'A8C8E8',size:18})]}),
  ],C.navy,TW)]));

  for(const p of pages){
    rows.push(row([stdCell([new Paragraph({spacing:{before:40,after:10},children:[
      txt(p.num+'  ',{bold:true,color:C.navy,size:18}),
      txt(p.title,{bold:true,color:'1A3A5C',size:18}),
    ]})],C.ltNavy,TW)]));
    if (p.trap && p.trap.length) {
      rows.push(accentRow(p.trap.map(xbul),C.red,C.borderRed));
    }
  }

  return [new Table({width:{size:TW,type:WidthType.DXA},columnWidths:[TW],rows}),pageBreak()];
}

// ── ASSEMBLE AND WRITE DOCUMENT ───────────────────────────────────────────────
// Convenience function each domain script calls at the end.
function buildAndWrite({pages, tocConfig, summaryConfig, outPath}) {
  const allContent = [
    ...tocPage(tocConfig),
  ];

  for (const p of pages) {
    allContent.push(...buildPage(p));
  }

  allContent.push(...summaryPage(pages, summaryConfig));

  const doc = new Document({
    numbering:{
      config:[
        { reference:'bullets',
          levels:[{level:0,format:LevelFormat.BULLET,text:'•',
            alignment:AlignmentType.LEFT,
            style:{paragraph:{indent:{left:720,hanging:360}}}}]},
        { reference:'xbullets',
          levels:[{level:0,format:LevelFormat.BULLET,text:'✗',
            alignment:AlignmentType.LEFT,
            style:{paragraph:{indent:{left:720,hanging:360}}}}]},
      ],
    },
    sections:[{
      properties:{
        page:{
          size:{width:12240,height:15840},
          margin:{top:720,right:720,bottom:720,left:720},
        },
      },
      children:allContent,
    }],
  });

  return Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(outPath, buf);
    console.log(`Written: ${outPath}  (${(buf.length/1024).toFixed(0)} KB)`);
  });
}

module.exports = {
  C, TW,
  buildPage, tocPage, summaryPage, buildAndWrite,
};
