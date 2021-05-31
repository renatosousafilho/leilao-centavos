require('dotenv').config();

const { expect } = require('@jest/globals');
const puppeteer = require('puppeteer');
const resetDB = require('./actions/resetDB');

const BASE_URL = 'http://localhost:3000/';

jest.setTimeout(20000);

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

const getCurrentVotes = (page, index) => (page.$eval(dataTestid(`current-votes-${index}`), el => el.innerText));

describe('4 - Mostrar vencedor ao carregar a página', () => {
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

  it('Ao ter um um vencedor deve ser exibido assim que carregar a página', async () => {
    await page.waitForTimeout(500);
    
    // Current votes is 0
    expect(await getCurrentVotes(page, 0)).toEqual('0');

    // let buttonVote1;
    let buttonVote1 = await page.$(`button${dataTestid('vote-participant-0')}`);
    
  
    for (let i = 0; i <9; i++) {
      buttonVote1.click();
      await page.waitForTimeout(500);
      expect(await getCurrentVotes(page, 0)).toEqual(`${i + 1}`);
    }

    buttonVote1.click();
    await page.waitForTimeout(500);

    let page2 = await browser.newPage();
    await page2.goto(BASE_URL);
    await page2.waitForTimeout(500);

    const winnerCard = await page2.$(`${dataTestid('participant-winner')}`);

    const participantWinner = await winnerCard.$eval(`${dataTestid('participant-name')}`, (el) => el.innerText);
    expect(participantWinner).toEqual(participantWinner);

    // testar que os cards não sejam mais exibidos.
  });
});
