const express = require('express')
const puppeteer = require('puppeteer')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config({ path: '../.env' })

// const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1'
const apiUrl = 'https://api.api-ninjas.com/v1/facts?limit=2'
const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.API_NINJAS_KEY
}

async function fetchData() {
    try {
        const response = await axios.get(apiUrl, {headers})
        const data = response.data
        console.log('Data from API: ', data)
    } catch (error) {
        console.log('Error fetching data: ', error.message)
    }
}

fetchData()