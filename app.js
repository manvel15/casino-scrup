const puppeteer = require("puppeteer");
const fs = require('fs');

let pages = fs.readFileSync('./casinos.json'); // casino_bonuses.json casino_bonuses.json casino_games.json
let item = JSON.parse(pages);

// version 1
;(async (urls) => {
    const urlPages = [83,95,0,20,10,14,3,46];

    let index = 1;
    for await(const url of urls) {
      let i = 1;
      let pageLength = new Array(urlPages[index]);
      for await(const j of pageLength) {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        console.log(url+'/'+i)
        await page.goto(`${url}/${i}`);
          const data = await page.evaluate((fibaG) => {
            const cartItems = document.getElementsByClassName('card-list__item');
            const data = []
            for(let j = 0; j < cartItems.length-1;j++) {
              data.push({
                name: cartItems[j].querySelector('.card__desc-body').innerText,
                title: cartItems[j].querySelector('.card__desc-title').innerText,
                rating: cartItems[j].querySelector('.star-rating').dataset.rating,
                imgPath: cartItems[j].querySelector('.card__media--overlay > img').dataset.srcset
              });

            }
          return data;
        });
        await browser.close()
        i++;
        console.log(data);
      }
      index++;
    }
})(Object.values(item))