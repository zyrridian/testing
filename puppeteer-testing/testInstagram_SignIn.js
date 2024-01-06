const express = require('express');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;

app.get('/api/instagram/sign-in', async (req, res) => {

    try {

        const userDataDir = '/Document/programming/testing/puppeteer-testing';
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir
        });

        const page = await browser.newPage()

        await page.goto('https://www.instagram.com/accounts/login');

        // await page.waitForSelector('input[name="username"]')
        // await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME)
        // await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD)
        // await page.click('button[type="submit"]')
        console.log('username and password has been filled');

        // await browser.close();

        res.status(200).json({
            message: "success",
        })
        
    } catch (error) {
        res.status(500).send(error.message)
    } 

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
