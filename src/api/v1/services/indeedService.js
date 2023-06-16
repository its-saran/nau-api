import config from '../config/configuration.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from'puppeteer-extra-plugin-stealth'
import utils from '../utils/utils.js';

const platform = 'Indeed'

const startIndeed = async ({jobKeyword, jobLocation}) => {
    try {
        console.log(`Started Scrapping ${platform}`)
        puppeteer.use(StealthPlugin());

        const launchOptions = config.indeed.launchOptions
        const userAgent = config.indeed.userAgent
        const viewportSize = config.indeed.viewportSize
        
        jobKeyword = encodeURIComponent(jobKeyword.toLowerCase())
        jobLocation =  encodeURIComponent(jobLocation.toLowerCase())

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        await page.setUserAgent(userAgent);
        await page.setViewport(viewportSize); 

        console.log('Browser loaded successfully!')

        const url =`https://in.indeed.com/jobs?q=${jobKeyword}&l=${jobLocation}`;

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.jobsearch-ResultsList')
        console.log('Indeed loaded successfully!')

        const totalJobs = await page.$eval('.jobsearch-JobCountAndSortPane-jobCount', element => element.textContent.replace(/\D/g,''))
        console.log(`Expected jobs : ${totalJobs}`)
        await browser.close()

        console.log('Browser closed successfully!')
        return {'Expected Jobs': totalJobs}
    } catch (error) {
        console.error(error);
        return error 
    }
}

export { startIndeed }