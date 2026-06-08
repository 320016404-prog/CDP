import fs from 'fs';
import * as cheerio from 'cheerio';

const plantelStr = fs.readFileSync('plantel.html', 'utf8');
const $p = cheerio.load(plantelStr, { decodeEntities: false });

const players = [];

$p('.player-card').each((i, el) => {
    const info = $p(el).find('.player-info');
    if (!info.length) return;
    
    let name = info.find('.player-name').text().trim();
    const golos = parseInt(info.attr('data-golos')) || 0;
    const assist = parseInt(info.attr('data-assist')) || 0;
    const minutos = parseInt(info.attr('data-minutos')) || 0;
    
    // Fallbacks if no image src? actually some are valid
    let imageSrc = $p(el).find('.player-img-wrapper img').first().attr('src');

    players.push({ name, golos, assist, minutos, imageSrc: imageSrc || "https://ui-avatars.com/api/?name="+encodeURIComponent(name)+"&background=1a1a1a&color=fff&size=128" });
});

// Sort to find tops
// For ties, usually sorting maintains order, but let's be careful. Since we're sorting stats descending:
const topGolos = [...players].sort((a, b) => b.golos - a.golos).slice(0, 5);
const topAssist = [...players].sort((a, b) => b.assist - a.assist).slice(0, 5);
const topMinutos = [...players].sort((a, b) => b.minutos - a.minutos).slice(0, 5);

// Now update index.html
let indexStr = fs.readFileSync('index.html', 'utf8');
const $i = cheerio.load(indexStr, { decodeEntities: false });

// 1. Goleadores
const goleadoresCard = $i('.top-stat-title:contains("Goleadores")').parent();
goleadoresCard.find('.top-player-row').remove();
topGolos.forEach((p, idx) => {
    goleadoresCard.append(`
          <div class="top-player-row">
            <div class="top-rank">${idx + 1}</div>
            <img src="${p.imageSrc}" class="top-player-img" alt="${p.name}">
            <div class="top-player-name">${p.name}</div>
            <div class="top-player-val">${p.golos}</div>
          </div>`);
});

// 2. Assistências
const assistCard = $i('.top-stat-title:contains("Assistências")').parent();
assistCard.find('.top-player-row').remove();
topAssist.forEach((p, idx) => {
    assistCard.append(`
          <div class="top-player-row">
            <div class="top-rank">${idx + 1}</div>
            <img src="${p.imageSrc}" class="top-player-img" alt="${p.name}">
            <div class="top-player-name">${p.name}</div>
            <div class="top-player-val">${p.assist}</div>
          </div>`);
});

// 3. Mais Minutos
const minutosCard = $i('.top-stat-title:contains("Mais Minutos")').parent();
minutosCard.find('.top-player-row').remove();
topMinutos.forEach((p, idx) => {
    minutosCard.append(`
          <div class="top-player-row">
            <div class="top-rank">${idx + 1}</div>
            <img src="${p.imageSrc}" class="top-player-img" alt="${p.name}">
            <div class="top-player-name">${p.name}</div>
            <div class="top-player-val">${p.minutos}</div>
          </div>`);
});

fs.writeFileSync('index.html', $i.html(), 'utf8');
console.log("Updated index.html");
