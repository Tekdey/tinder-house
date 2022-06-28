const constant = require("../../../config/constants");
const puppeteer = require("puppeteer");

/**
 * It fetches data from a website and returns it.
 * @param id - the page number
 * @returns An object with two properties: data and pages.
 */
async function fetchPost(id) {
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
    const postTitle = document.querySelectorAll(".generatedTitleWithHighlight");
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

module.exports = { fetchPost };
