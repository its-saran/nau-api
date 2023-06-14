import naukri from './modules/platform/naukri-single.js'
import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('To Scrape Naukri, go to http:localhost:8080/api/v1/scrape?keyword=data%20analytics&location=kochi')
})

app.get('/api/v1/scrape', async (req, res) => {
    const options = { 
        jobKeyword: req.query.keyword,
        jobLocation: req.query.location, 
    }
    const rawData = await naukri(options)
    await res.send(rawData)
})

export const single = app;