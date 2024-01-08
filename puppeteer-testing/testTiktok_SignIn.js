const express = require('express')
const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
dotenv.config({ path: '../.env'} );

const app = express()

app.get('/api/tiktok/signin', async (req, res) => {

  try {
    
    const userDataDir = '/Documents/programming/testing/puppeteer-testing'
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: userDataDir
    })

    const isLogin = false
    const page = await browser.newPage()

    if (!isLogin) {

      // await page.goto('https://tiktok.com/login')
      // await page.evaluate(() => {
      //   const rootDiv = document.querySelector('.tiktok-7pnfyo-DivLoginOptionContainer')
      //   if (rootDiv) {
      //     const childDivs = rootDiv.querySelectorAll('.tiktok-7u35li-DivBoxContainer')
      //     if (childDivs.length > 1) {
      //       childDivs[1].click()
      //     }
      //   }
      // })

      await page.goto('https://tiktok.com/login/phone-or-email/email')
      await page.type('input[name="username"]', process.env.TIKTOK_USERNAME)
      await page.type('input[type="password"]', process.env.TIKTOK_PASSWORD)
      await page.click('button[type="submit"]')

      // failed. cannot bypass slider rotation captcha



      // await page.click('div[class="tiktok-7u35li-DivBoxContainer"]')

    } else {

    }

  } catch (error) {
    res.status(500).send(error.message)
  }

})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})