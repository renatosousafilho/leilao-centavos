require('dotenv').config();

const { expect } = require('@jest/globals');
const puppeteer = require('puppeteer');
const resetDB = require('./actions/resetDB');

const BASE_URL = 'http://localhost:3000/';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

const getCurrentVotes = (page, index) => (page.$eval(dataTestid(`current-votes-${index}`), el => el.innerText));

describe('2 - Votar', () => {
  let browser;
  let page;

  beforeEach(async (done) => {
    await resetDB();
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
    page = await browser.newPage();
    await page.goto(BASE_URL);
    done();
  });

  afterEach(async (done) => {
    await browser.close();
    done();
  });

  it('Será validado que ao votar em um participante o número de votos deve aumentar', async() => {
    await page.waitForTimeout(500);
    let currentVotes = await getCurrentVotes(page, 0);
    // Current votes is 0
    expect(currentVotes).toEqual('0');

    // User from page 1 votes once
    const buttonVote1 = await page.$(`button${dataTestid('vote-participant-0')}`);
    buttonVote1.click();
    await page.waitForTimeout(500);
    
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('1');

    // User from page 1 votes again
    buttonVote1.click();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('2');


    // User from page 1 votes again
    buttonVote1.click();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('3');

    // User from page 2 should see current votes
    const page2 = await browser.newPage();
    await page2.setCacheEnabled(false);
    await page2.goto(BASE_URL);
    await page2.waitForTimeout(500);

    currentVotes = await getCurrentVotes(page2, 0);
    expect(currentVotes).toEqual('3');

    // Participant 1 should have 0 votes
    currentVotes = await getCurrentVotes(page2, 1);
    expect(currentVotes).toEqual('0');

    // User from page 2 vote in participant 2
    const buttonVote2 = await page.$(`button${dataTestid('vote-participant-1')}`);
    buttonVote2.click();
    await page2.waitForTimeout(500);

    // Participant 1 should have 1 vote in page 2
    currentVotes = await getCurrentVotes(page2, 1);
    expect(currentVotes).toEqual('1');

    // Participant 1 should have 1 vote in page 1
    await page.bringToFront();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 1);
    expect(currentVotes).toEqual('1');
  });
});
