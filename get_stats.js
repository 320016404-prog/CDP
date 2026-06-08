import fs from 'fs';
import * as cheerio from 'cheerio';

const plantelStr = fs.readFileSync('plantel.html', 'utf8');
const $p = cheerio.load(plantelStr);

const players = [];

$p('.player-card').each((i, el) => {
    const info = $p(el).find('.player-info');
    if (!info.length) return;
    
    let name = info.find('.player-name').text().trim();
    const golos = parseInt(info.attr('data-golos')) || 0;
    const assist = parseInt(info.attr('data-assist')) || 0;
    const minutos = parseInt(info.attr('data-minutos')) || 0;
    
    const imageSrc = $p(el).find('.player-img-wrapper img').first().attr('src');

    players.push({ name, golos, assist, minutos, imageSrc });
});

const topGolos = [...players].sort((a, b) => b.golos - a.golos).slice(0, 5);
const topAssist = [...players].sort((a, b) => b.assist - a.assist).slice(0, 5);
const topMinutos = [...players].sort((a, b) => b.minutos - a.minutos).slice(0, 5);

console.log(JSON.stringify({topGolos, topAssist, topMinutos}, null, 2));
