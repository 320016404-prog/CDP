import fs from 'fs';
import * as cheerio from 'cheerio';

const files = [
  'index.html',
  'noticias.html',
  'clube.html',
  'galeria.html',
  'calendario.html',
  'plantel.html',
  'formacao.html',
  'contacto.html'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  
  const htmlStr = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(htmlStr, { decodeEntities: false });

  // 1. Move sections inside .container
  const container = $('.main-area .container');
  if (container.length > 0) {
    // Find all sections that are direct children of body or outside main-area
    $('body > section, body > footer, main > section, main > footer').each((i, el) => {
      // Append them to container
      container.append(el);
    });
  }

  // Rewrite
  fs.writeFileSync(file, $.html(), 'utf8');
}

console.log('Structure padded successfully!');
