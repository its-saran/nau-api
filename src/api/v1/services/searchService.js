import axios from 'axios'
import cheerio from 'cheerio'
import puppeteer from 'puppeteer-extra';
import StealthPlugin from'puppeteer-extra-plugin-stealth'
import config from '../config/configuration.js';


const platforms = ['Naukri', 'Linkedin', 'Indeed']

const startSearch = {
  naukri: async function({jobKeyword, jobLocation}) {
    try {
        console.log(`Started Scrapping ${platforms[0]}!`)
    
        const headers = config.naukri.headers
        const noOfResults = config.naukri.noOfResults
        const pageNo = 1
    
        jobLocation = jobLocation && encodeURIComponent(jobLocation.toLowerCase());
        jobKeyword = jobKeyword && encodeURIComponent(jobKeyword.toLowerCase());

        const url = `https://www.naukri.com/jobapi/v3/search?noOfResults=${noOfResults}&searchType=adv&pageNo=${pageNo}&urlType=search_by_key_loc&keyword=${jobKeyword}&location=${jobLocation}`
          
        const response = await axios.get(url, {headers});
        const data = response.data
        const totalJobs = data.noOfJobs
        console.log(`Total jobs: ${totalJobs}`)
        return totalJobs
  
    } catch (error) {
        console.error(error);
        return error
    }
  },
  linkedin: async function({jobKeyword, jobLocation}) {
    try {
        console.log(`Started Scrapping ${platforms[1]}`)

        const headers = config.naukri.headers

        jobLocation = jobLocation && encodeURIComponent(jobLocation.toLowerCase());
        jobKeyword = jobKeyword && encodeURIComponent(jobKeyword.toLowerCase());

        const url = `https://in.linkedin.com/jobs/search?keywords=${jobKeyword}&location=${jobLocation}&position=1&pageNum=1`

        const response = await axios.get(url, {headers});
        const html = response.data

        const $ = cheerio.load(html);

        const jobCountElement = $('.results-context-header__job-count');
        const totalJobs = jobCountElement.text();
        console.log('Total jobs:', totalJobs);

        return parseInt(totalJobs)
    } catch (error) {
        console.error(error);
        return error
    }
  },
  indeed: async function({jobKeyword, jobLocation}) {
    try {
        console.log(`Started Scrapping ${platforms[2]}`)
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
        await browser.close()
        console.log('Browser closed successfully!')

        console.log(`Total jobs: ${totalJobs}`)
        return parseInt(totalJobs)
    } catch (error) {
        console.error(error);
        return error 
    }
  }
}

export { startSearch }
  
