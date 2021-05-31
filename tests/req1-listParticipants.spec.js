require('dotenv').config();

const { expect } = require('@jest/globals');
const puppeteer = require('puppeteer');
const resetDB = require('./actions/resetDB');

const BASE_URL = 'http://localhost:3000/';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

describe('1 - Liste os participantes', () => {
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

  it('Será validado que os 3 participantes são exibidos', async() => {
    await page.waitForSelector(dataTestid('participant-name'));

    const participantNames = await page.$$eval(dataTestid('participant-name'), (nodes) => nodes.map((n) => n.innerText));

    expect(participantNames[0]).toMatch('Tanjiro Kamado');
    expect(participantNames[1]).toMatch('Nezuko Kamado');
    expect(participantNames[2]).toMatch('Inosuke Hashibira');
  });

  it('Será validado que os 3 participantes possuem o botão para votar', async() => {
    await page.waitForSelector(dataTestid('vote-participant-0'));

    const buttonVote1 = await page.$eval(`button${dataTestid('vote-participant-0')}`, el => el.innerText);
    const buttonVote2 = await page.$eval(`button${dataTestid('vote-participant-1')}`, el => el.innerText);
    const buttonVote3 = await page.$eval(`button${dataTestid('vote-participant-2')}`, el => el.innerText);
    
    expect(buttonVote1).toEqual('Votar');
    expect(buttonVote2).toEqual('Votar');
    expect(buttonVote3).toEqual('Votar');    
  });
});
