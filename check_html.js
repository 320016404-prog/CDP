import fs from 'fs';
import * as cheerio from 'cheerio';
const htmlStr = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(htmlStr, { decodeEntities: false });
console.log('Body children:', $('body').children().map((i, el) => el.tagName + (el.attribs.class ? '.' + el.attribs.class.split(' ').join('.') : '')).get());
console.log('Main-area children:', $('.main-area').children().map((i, el) => el.tagName + (el.attribs.class ? '.' + el.attribs.class.split(' ').join('.') : '')).get());
console.log('Container children:', $('.main-area .container').children().map((i, el) => el.tagName + (el.attribs.id ? '#' + el.attribs.id : '')).get());
