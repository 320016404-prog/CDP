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

  // Move footer to the end of container
  const container = $('.main-area .container');
  const footer = container.find('footer.footer');
  
  if (container.length > 0 && footer.length > 0) {
    container.append(footer);
  }

  // Also, remove those Unsplash image usages and use local fallbacks like initials just in case, or remove the images since they are broken!
  // Wait, I can use a generic silhouette image or let the browser alt handle it.
  // The user says "a imagem toda desformatada". A broken image icon with text looks very unformatted.
  // Let's replace the Unsplash links with a placeholder UI avatar or a local soccer player silhouette.
  // I will use https://ui-avatars.com/api/?name=... for broken images.
  $('.top-player-row').each((i, el) => {
    const img = $(el).find('.top-player-img');
    const name = $(el).find('.top-player-name').text().trim();
    const src = img.attr('src');
    if (src && src.includes('unsplash.com')) {
      img.attr('src', `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=fff&size=128`);
    }
  });

  fs.writeFileSync(file, $.html(), 'utf8');
}

console.log('Fixed footer order and broken images!');
