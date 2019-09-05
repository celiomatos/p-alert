const puppeteer = require("puppeteer");
const fs = require("fs");
const mtz = require("moment-timezone");

async function run() {
  var manaus = mtz.tz(new Date(), "America/Manaus");
  const folder = "capturas/palert/" + manaus.format().substring(0, 13);

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(
    `https://www.google.com.br/search?q=%22dermilson+chagas%22&lr=&hl=pt-BR&source=lnt&tbs=sbd:1,qdr:h&sa=X&ved=0ahUKEwiL-PiprP7aAhWCIJAKHXUyDXwQpwUIHw&biw=1360&bih=637`
  );

  const data = await page.$$eval("#search a", tds =>
    tds.map(td => {
      return td.href;
    })
  );

  var sites = "Links\n";
  var existeNoticia = false;
  for (let i = 0; i < data.length; i++) {
    const noticia = await data[i];
    try {
      if (
        !(
          noticia.includes("google.com") ||
          noticia.includes("youtube.com") ||
          noticia.includes("webcache.googleusercontent.com") ||
          noticia.includes("www.portaldogeneroso")
        )
      ) {
        await page.goto(noticia);
        console.log(">>>> " + noticia);
        const title = await page.title();
        const content = await page.content();
        if (content.toLowerCase().includes("dermilson")) {
          if (!existeNoticia && !fs.existsSync(folder)) {
            if (!fs.existsSync("capturas")) {
              fs.mkdirSync("capturas");
            }

            if (!fs.existsSync("capturas/palert")) {
              fs.mkdirSync("capturas/palert");
            }

            fs.mkdirSync(folder);
          }

          existeNoticia = true;
          await page.screenshot({
            path: folder + "/" + title + ".png",
            fullPage: true
          });
          sites += noticia + "\n";
        }
      }
    } catch (err) {
      console.log("Error in site >>>> " + noticia);
      await page.close();
    }
  }

  if (existeNoticia) {
    var stream = await fs.createWriteStream(folder + "/sites.txt");
    stream.once("open", function(fd) {
      stream.write(sites);
      stream.end();
    });
  }

  await browser.close();
}

run();
