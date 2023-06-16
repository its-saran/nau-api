import config from '../config/configuration.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from'puppeteer-extra-plugin-stealth'
import utils from '../utils/utils.js';

const platform = 'Indeed'

const startIndeed = async ({jobKeyword, jobLocation, maxJobs = 100000}) => {
    try {
        console.log(`Keyword: ${jobKeyword}, Location: ${jobLocation}, Results: ${maxJobs}`)
        puppeteer.use(StealthPlugin());

        const launchOptions = config.indeed.launchOptions
        const userAgent = config.indeed.userAgent
        const viewportSize = config.indeed.viewportSize

        const cmKeyword = jobKeyword.toLowerCase()
        const cmLocation = jobLocation.toLowerCase()
        
        jobKeyword = encodeURIComponent(jobKeyword.toLowerCase())
        jobLocation =  encodeURIComponent(jobLocation.toLowerCase())

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        await page.setUserAgent(userAgent);
        await page.setViewport(viewportSize); 

        console.log('\nBrowser loaded successfully!')

        console.log(`Started Scrapping ${platform}!`)
        let jobs = []
        
        try {
            const url =`https://in.indeed.com/jobs?q=${jobKeyword}&l=${jobLocation}`;
            await page.goto(url, { waitUntil: 'networkidle2' });
    
            await page.waitForSelector('.jobsearch-ResultsList')
            const totalJobs = await page.$eval('.jobsearch-JobCountAndSortPane-jobCount', element => element.textContent.replace(/\D/g,''))
            console.log(`Expected jobs : ${totalJobs}`)
    
            let pageNum = 0;
            let i = 0
            
            while (i <= maxJobs) {
                pageNum++;
                console.log(`Page No: ${pageNum}`)
    
                await page.waitForSelector('.jobTitle', {timeout: 60000});
                await utils.waitFor(1500)
    
                const closeButton = await page.$('.icl-CloseButton');
                if (closeButton) {
                    await page.click('.icl-CloseButton');
                }
                const jobItems = await page.$$('.jobsearch-ResultsList > li > .result')
                
                let jobsArray = []
    
                for (const job of jobItems) { 
                    await job.click()
                    await utils.waitFor(3000)
    
                    await page.waitForSelector('#jobDescriptionText', {timeout: 50000})
        
                    const title = await job.$eval('.jcs-JobTitle', el => el.textContent.trim());
                    const jobLink = await job.$eval('.jcs-JobTitle', el => el.getAttribute('href').trim())
                    const url = `https://in.indeed.com${jobLink}`
                    const urlObject = new URL(url);
                    let jobId = urlObject.searchParams.get("jk");
                    if (jobId==null) {
                        jobId = urlObject.searchParams.get("fccid");
                    }
        
                    const company = await job.$eval('.companyName', el => el.textContent.trim());
                    const location = await job.$eval('.companyLocation', el => el.textContent.trim());
        
                    let ratings
                    let reviews
                    let salary
                    let qualifications
                    let benefits
                    let type
                    let status
                    let vaccancies
                    // let situation
                    let responseRate
                    let reviewed
                    let posted
                    let description
    
                    //Company ratings
                    try {
                        ratings =  await page.$eval('.jobsearch-CompanyInfoContainer div[aria-label]', el => el.getAttribute('aria-label').trim())
                        const endIndex = ratings.indexOf(" out ");
                        ratings = ratings.substring(0, endIndex);
                    } catch (error) {
                        ratings = ''
                    }
        
                    //Company reviews and reviews url
                    try {
                        reviews =  await page.$eval('.jobsearch-CompanyInfoContainer span a', el => el.textContent.trim());
                        reviews = reviews.replace('reviews', '').trim()
                    } catch (error) {
                        reviews = ''
                    }
        
                    //Salary
                    try {
                        salary =  await page.$eval('#salaryInfoAndJobType span', el => el.textContent.trim());
                        const rawSalary =  await page.$eval('#salaryInfoAndJobType span', el => el.textContent.trim());
                        if (rawSalary.includes('month')) {
                            const salaryRegex = /₹([\d,]+)\s*-\s*₹([\d,]+)/;
                            const matches = salaryString1.match(salaryRegex);
                            if (!matches) {
                              console.log('Invalid input format');
                            }
                            const salaryMin = parseInt(matches[1].replace(/,/g, ''));
                            const salaryMax = parseInt(matches[2].replace(/,/g, ''));
                            const yearlySalaryMin = (salaryMin * 12).toLocaleString('en-IN');
                            const yearlySalaryMax = (salaryMax * 12).toLocaleString('en-IN');
                            salary = `₹${yearlySalaryMin} - ₹${yearlySalaryMax}`
                        } else if(rawSalary.includes('Up')){
                            salary = rawSalary.replace(' a year', '');
                            salary = salary.replace('Up to ', '')
                        } else {
                            salary = rawSalary.replace(' a year', '');
                        }
                    } catch(err) {
                        salary = ''
                    }
                
                    //Qualifications
                    try {
                        const qelement = await page.$$eval('#qualificationsSection > div ul li', el => el.map(el => el.textContent.trim()));
                        qualifications = qelement.join(', ');
                    } catch(err) {
                        qualifications = ''
                    }
        
                    //Benefits & Perks
                    try {
                        const belement = await page.$$eval('#jobDetailsSection .css-1oqmop4 span', el => el.map(el => el.textContent.trim().replace(/,$/, '')));
                        benefits = belement.join(', ');
                    } catch(err) {
                        benefits = ''
                    }
        
                    //job Tye
                    try {
                        const jelement = await page.$$eval('#jobDetailsSection > div', el => el.map(el => el.textContent.trim()));
                        type = jelement.find(el => el.includes('Job type')).replace('Job type', '').trim();
                        // // type = jelement.join(', ');
    
                        if (type.length > 2) {
                                const regex = /(?<!^)(?<![A-Z])\s*[A-Z]/g;
                                type = type.replace(regex, (match) => {
                                    if (match.startsWith(" ")) {
                                        return match;
                                    } else {
                                        return ", " + match;
                                    }
                                });
                        } else {
                                type = ''
                        }
                    } catch(err) {
                        type = ''
                    }
        
                    //Hiring Insights
                    try {
                        const hiringInsights = await page.$$eval('.css-q7fux.eu4oa1w0 > p', el => el.map(el => el.textContent.trim()));
                        status = hiringInsights.find(item => item.includes('hiring')) || '';
                        if (status.includes('Urgently')) {
                            status = 'Apply Soon'
                        }
    
                        vaccancies = hiringInsights.find(item => item.includes('candidate')) || '';
                        if (vaccancies.includes('candidate')) {
                            vaccancies = vaccancies.match(/Hiring(.*)candidate/)[1].trim()
                        }
                    
                        responseRate = hiringInsights.find(item => item.includes('Application')) || '';
                        if (responseRate.includes('Application')) {
                            responseRate = responseRate.replace('Application response rate: ', '').trim()
                        }
                    
                        // situation = hiringInsights.find(item => item.includes('On-going')) || '';
                    } catch(err) {
                        status = ''
                        vaccancies = ''
                        // situation = ''
                        responseRate = ''
                    }
        
                    //Job Activity
                    try {
                        const jobActivity = await page.$$eval('.css-5vsc1i.eu4oa1w0', el => el.map(el => el.textContent.trim()));
                        reviewed = jobActivity.find(item => item.includes('reviewed')) || '';
                        if (reviewed.includes('Employer')) {
                            reviewed = reviewed.replace('Employer reviewed job ', '').trim()
                        } 
    
                        posted = jobActivity.find(item => item.includes('Posted')) || '';
                        if (posted.includes('Posted')) {
                            posted = posted.replace('Posted ', '').trim()
                        } 
    
                    } catch(err) {
                        reviewed= ''
                        posted = ''
                    }
        
                    //Job Description
                    try {
                        description = await page.$eval('#jobDescriptionText', el => el.textContent.trim());
                    } catch (error) {
                        description = ''
                    }

                    const cmId = `CM-I#${jobId}`
        
                    const jobArrayItem = {
                        platform, cmId, cmKeyword, cmLocation, jobId, title, company, location, ratings, 
                        reviews, salary, qualifications, benefits, type, 
                        status, vaccancies, responseRate,
                        reviewed, posted, url, description
                    }
    
                    jobsArray = [...jobsArray, jobArrayItem];
                    i++
                    console.log(`Job No: ${i}`)
                    
                }
    
                jobs = [...jobs, ...jobsArray]
    
                const nextPageButton = await page.$('a[data-testid="pagination-page-next"]');
                if (!nextPageButton) {
                    break;
                }
    
                await page.waitForSelector('a[data-testid="pagination-page-next"]')
                await nextPageButton.click();
            }
    
            console.log(`Total pages scraped: ${pageNum}`)
            await browser.close();
    
        } catch (error) {
            console.error(error);
        }
    
        if (jobs.length <= maxJobs ) {
            console.log(`Total jobs scraped : ${jobs.length}`)
            console.log(`Scraping ${platform} completed!`)
            return jobs
        } else {
            const newJobs = jobs.slice(0, maxJobs)
            console.log(`Total Items : ${newJobs.length}`)
            console.log(`Scraping ${platform} completed!`)
            return newJobs
        }
    } catch (error) {
        console.error(error);
        return error 
    }
}

export { startIndeed }