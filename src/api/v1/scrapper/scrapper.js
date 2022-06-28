const constant = require("../../../config/constants");
const puppeteer = require("puppeteer");

class Scrapper {
  /**
   * It fetches data from a website and returns it.
   * @param id - the page number
   * @returns An object with two properties: data and pages.
   */
  static async bienIci(id) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      `${constant.site.bienIci.baseURL}recherche/location/gard-30/appartement/2-pieces-et-plus?prix-max=500&page=${id}&mode=galerie`
    );

    await page.waitForSelector(".sideListItem");
    await page.waitForSelector(".searchItemPhoto");
    await page.waitForSelector(".generatedTitleWithHighlight");
    await page.waitForSelector(".cityAndDistrict");
    await page.waitForSelector(".thePrice");
    await page.waitForSelector(".detailedSheetLink");

    await page.waitForSelector(".main-pagination");

    const posts = await page.evaluate(() => {
      let list = [];
      let prices = [];
      let links = [];
      const post = document.querySelectorAll(".sideListItem");
      const postImage = document.querySelectorAll(".searchItemPhoto");
      const postTitle = document.querySelectorAll(
        ".generatedTitleWithHighlight"
      );
      const postCity = document.querySelectorAll(".cityAndDistrict");
      const postPrice = document.querySelectorAll(".thePrice");
      const postLink = document.querySelectorAll(".detailedSheetLink");

      const pages = document.querySelector(".main-pagination").children.length;

      let prevLink;

      // link
      for (let i = 0; i < postLink.length; i++) {
        const link = postLink[i].href;

        if (link !== prevLink) {
          links.push(link);
        }
        prevLink = link;
      }

      // price
      for (let x = 0; x < postPrice.length; x++) {
        if (x % 2 === 0) {
          const price = postPrice[x].innerHTML;
          prices.push(price);
        }
      }

      for (let i = 0; i < post.length; i++) {
        const postData = {
          title: null,
          city: null,
          image: null,
          price: null,
          link: null,
        };

        postData.price = prices[i];
        postData.link = links[i];
        // image
        const img = postImage[i].currentSrc;
        postData.image = img;

        // title;
        const title = postTitle[i].textContent;
        postData.title = title;

        // city;
        const city = postCity[i].textContent;
        postData.city = city;

        // save data
        list.push(postData);
      }

      return { data: { pages, list } };
    });
    await browser.close();
    return posts;
  }

  static async nexity() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      `${constant.site.nexity.baseURL}annonces-immobilieres/location/logement+t9/tout/gard/moins-de-1000?nb_p%5B0%5D=2&nb_p%5B1%5D=3&nb_p%5B2%5D=4&nb_p%5B3%5D=5&nb_p%5B4%5D=6&nb_p%5B5%5D=7&nb_p%5B6%5D=8`
    );

    await page.waitForSelector(".annonces");
    await page.waitForSelector(".image");
    await page.waitForSelector(".description");
    await page.waitForSelector(".title");
    await page.waitForSelector(".sub-title");

    const posts = await page.evaluate(() => {
      let list = [];

      const post = document.querySelectorAll(".ais-hits--item");
      const postImage = document.querySelectorAll(".image source");
      const postTitle = document.querySelectorAll(".description > a > div");
      const postCity = document.querySelectorAll(".description .sub-title");
      const postPrice = document.querySelectorAll(
        ".description .inter-description .neuf"
      );
      const postLink = document.querySelectorAll(".description .offer-link");

      for (let i = 0; i < post.length; i++) {
        const postData = {
          title: null,
          city: null,
          image: null,
          price: null,
          link: null,
        };

        const title = postTitle[i].innerText;
        postData.title = title;

        const city = postCity[i].innerText;
        postData.city = city;

        const price = postPrice[i].innerText;
        postData.price = price;

        const link = postLink[i].href;
        postData.link = link;

        const image = postImage[i].srcset;
        if (!image.includes(".webp")) {
          postData.image = image;
        }

        list.push(postData);
      }
      return { data: { pages: 0, list } };
    });
    await browser.close();
    return posts;
  }
}
module.exports = Scrapper;
