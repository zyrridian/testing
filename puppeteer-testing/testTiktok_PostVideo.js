const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // args:['--user-Sdata-dir=/user/data/directory/profile_n']
    // Set to false to run in non-headless mode
    // executablePath: '/path/to/chrome', // Provide the path to your Chrome/Chromium executable
  });

  const page = await browser.newPage();
  await page.goto('https://www.tiktok.com/login');
    await page.waitForSelector('.tiktok-7u35li-DivBoxContainer')
    await page.click('.tiktok-7u35li-DivBoxContainer')
  await page.waitForNavigation();
  await page.screenshot({ path: 'screenshot_continue_with_google.png' });
  await page.click('button[data-testid="btn-google"]');
  await page.waitForNavigation();
  await page.type('input[type="email"]', process.env.TIKTOK_EMAIL);
  await page.click('button[type="next"]'); // Click the "Next" button
  await page.waitForTimeout(5000); // Wait for a short time (adjust as needed)
  await page.type('input[type="password"]', process.env.TIKTOK_PASSWORD);
  await page.click('button[type="submit"]');
  await page.screenshot({ path: 'screenshot_google_login_credentials.png' });
  await page.waitForNavigation();
  await page.goto('https://www.tiktok.com');
  await page.waitForSelector('.main-content');
  await page.screenshot({ path: 'main_page.png' });

  // await browser.close();
})();
