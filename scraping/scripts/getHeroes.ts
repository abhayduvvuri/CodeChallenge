const puppeteer = require("puppeteer");
import { writeFile } from "fs";
import { resolve } from "path";
import Hero from "../../models/hero";
import { v4 as uuid } from 'uuid';

const baseURL = 'https://www.marvel.com';

async function getElText(page, selector) {
	return await page.evaluate((selector) => {
		return document.querySelector(selector).innerText
	}, selector);
}

async function getElHTML(page, selector) {
	return await page.evaluate((selector) => {
		return document.querySelector(selector).innerHTML
	}, selector);
}

async function getHeroes() {
  let heroes = [];
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();

  await page.goto(baseURL + '/characters');
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitFor(2000);
  await page.waitForSelector('#terrigen-page');
  await navigationPromise;
  
  for(let i = 1; i < 13; i++) {
    
    const id = uuid(); 

    const nameSelector = '#content_grid-2 > div > div.grid-base.grid__6 div:nth-child('+i.toString()+') > a > div.card-body.is-sliding > p';
    await page.waitForSelector(nameSelector);
    const name = await getElText(page, nameSelector);
    
    console.log(name);

    const picSelector = '#content_grid-2 > div > div.grid-base.grid__6 div:nth-child('+i.toString()+') > a > div.card-thumb-frame > figure > img';
    const photo = await page.$eval(picSelector, img => img.src);
    console.log(photo); 

    const bioPageSelector = '#content_grid-2 > div > div.grid-base.grid__6 div:nth-child('+i.toString()+') > a';
    const bioPage = await page.$eval(bioPageSelector, ahref => ahref.href);
    await page.goto(bioPage + '/in-comics');
    
    let bio = '';
    try{
    const bioSelector = '#page-wrapper > div.page__contents.character-comics-report-page';
    await page.waitForSelector(bioSelector);
    bio = await getElText(page, bioSelector);
    console.log(bio);

     
    } catch(err){
      console.log("error scraping for :" + name);

    }  
    heroes.push({id, name, photo, bio});
    await page.goto(baseURL + '/characters');
  }
  
  
  await browser.close();

  writeFile(
    resolve(__dirname, "../heroes.json"),
    JSON.stringify(heroes, null, 2),
    err => {
      if (err) {
        throw err;
      }
      console.log("Finished writing file");
    }
  );
}

getHeroes();
