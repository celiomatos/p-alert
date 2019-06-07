const puppeteer = require('puppeteer');
const fs = require('fs');
const mtz = require('moment-timezone');

async function run() {
var manaus = mtz.tz(new Date(), "America/Manaus");
const folder = 'capturas/palert/' + manaus.format().substring(0,13);

if(!fs.existsSync(folder)){
    fs.mkdirSync(folder);
}

const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
const page = await browser.newPage();
await page.setViewport({width: 1280, height: 800});

await page.goto(
`https://www.google.com/search?rlz=1C1GCEU_pt-BRBR821BR821&ei=ac72XKqwJcKc5wKxhLuIDQ&q=
spring+boot&oq=spring+boot&gs_l=psy-ab.3..0l10.653195.654967..655961...0.0..0.344.2774.2-10j1
......0....1..gws-wiz.......0i131j0i67j0i10.1ZjkHiTxEeM`);

const data = await page.$$eval('#search a', tds => tds.map((td) => {
  return td.href;
}));

for(let i = 0; i < data.length; i++){
	const noticia = await data[i];	
	console.log(noticia);
	try {
	    await page.goto(noticia);
	    const title = await page.title();
        await page.screenshot({ path: folder + '/' + title + '.png', fullPage: true });
	} catch(err){}
}

await browser.close();
}

run();