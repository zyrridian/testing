const express = require('express');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const fs = require('fs')
const path = require('path')
dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;

const isUserLoggedIn = async () => {
    // const cookieName = 'elements.session.5'
    // const cookies = await page.cookies()
    // const isLoggedIn = cookies.some(cookie => cookie.name === cookieName)
    // return isLoggedIn
    return true
}

async function waitUntilDownload(page) {
    return new Promise((resolve, reject) => {
        page._client().on('Page.downloadProgress', e => {
            if (e.state === 'completed') {
                resolve(); // Resolve without specifying a file name
            } else if (e.state === 'canceled') {
                reject(); // Reject if the download is canceled
            }
        });
    });
}


app.get('/api/download', async (req, res) => {

    try {

        const { keyword } = req.query;
        const userDataDir = '/Document/programming/testing/puppeteer-testing';
        const downloadPath = path.join(__dirname, 'downloads')
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir
        });

        const page = await browser.newPage()

        if (!isUserLoggedIn()) {
            await page.goto('https://elements.envato.com/sign-in');
            await page.type('input[name="username"]', process.env.ENVATO_USERNAME)
            await page.type('input[name="password"]', process.env.ENVATO_PASSWORD)
            await page.click('button[data-testid="submitButton"]')
            console.log('not login');
        } else {
            await page.goto('https://elements.envato.com/')
            console.log('login')
        }   

        const folder = `video-${Date.now()}`
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: `./downloads/${folder}`,
        })

        await page.waitForSelector('button[aria-label="Open search"]')
        await page.click('button[aria-label="Open search"]')
        await page.type('input[data-testid="search-form-input"]', keyword)
        await page.click('button[data-testid="search-form-button"]')
        await page.waitForSelector('div[data-testid="stock-video-item-type"]')
        await page.click('button[data-testid="item-card-download-button"]')
        await page.waitForSelector('button[data-testid="download-without-license"]')
        await page.click('button[data-testid="download-without-license"]')

        console.log('Download loading!');
        await waitUntilDownload(page);
        console.log('Download completed!');

        await browser.close();

        res.status(200).json({
            message: "success",
            result: {
                url: `http://192.168.1.25:3000/api/download/get/${folder}`
            }
        })
        
    } catch (error) {
        res.status(500).send(error.message)
    } 

});

app.get('/api/download/get/:folderName', async (req, res) => {

    const files = fs.readdirSync(`./downloads/${req.params.folderName}`);

    if (files.length === 0) {
        return res.status(404).send('No files found for download.');
    }

    const firstFile = files[0];
    const filePath = path.join(`./downloads/${req.params.folderName}`, firstFile);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    // setTimeOut(200000)

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
