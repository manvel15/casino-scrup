const puppeteer = require("puppeteer");
const fs = require('fs');

let pages = fs.readFileSync('./casinos.json'); // casino_bonuses.json casino_bonuses.json casino_games.json
let item = JSON.parse(pages);

// version 1
;(async (urls) => {
    const urlPages = [20,10,14,3,46];
    const fileNames = ['sports', 'blacklisted', 'download','certified', 'crypto']
    let index = 1;
    for await(const url of urls) {
      let i = 1;
      let pageLength = new Array(urlPages[index-1]);

      const content = [];
      for await(const j of pageLength) {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        await page.goto(`${url}/${i}`);

        const pageData = await page.evaluate((fibaG) => {
          const cartItems = document.getElementsByClassName('card-list__item');
          const items = [];
          for(let j = 0; j < cartItems.length-1;j++) {
            items.push({
              name: cartItems[j].querySelector('.card__desc-body').innerText,
              title: cartItems[j].querySelector('.card__desc-title').innerText,
              rating: cartItems[j].querySelector('.star-rating').dataset.rating,
              imgPath: cartItems[j].querySelector('.card__media--overlay > img').dataset.srcset,
              href: cartItems[j].querySelector('a').getAttribute('href')
            });
          }
          return items;
        });

        await browser.close()
        i++;
        content.push(pageData);
        console.log(fileNames[index-1] + '   '+ 'i: ' + i);
      }
      fs.writeFileSync(`./item-list/${fileNames[index-1]}.json`, JSON.stringify(content));
      index++;
    }
})(Object.values(item))
