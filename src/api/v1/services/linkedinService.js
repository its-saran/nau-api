import puppeteer from 'puppeteer-extra';
import StealthPlugin from'puppeteer-extra-plugin-stealth'
import config from '../config/configuration.js';
import utils from '../utils/utils.js';

const platform = 'Linkedin'

const startLinkedin = async ({jobKeyword, jobLocation, maxJobs = 970}) => { //Linkedin will stop working after listing 970 jobs
  try {
    console.log(jobKeyword, jobLocation, maxJobs)
      puppeteer.use(StealthPlugin());

      const launchOptions = config.linkedin.launchOptions
      const userAgent = config.linkedin.userAgent
      const viewportSize = config.linkedin.viewportSize
      
      jobKeyword = encodeURIComponent(jobKeyword.toLowerCase())
      jobLocation =  encodeURIComponent(jobLocation.toLowerCase())

      const browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      await page.setUserAgent(userAgent);
      await page.setViewport(viewportSize); 

      console.log('Browser loaded successfully!')

      console.log('Started Scrapping Linkedin!')

      try {
        const url = `https://in.linkedin.com/jobs/search?keywords=${jobKeyword}&location=${jobLocation}&position=1&pageNum=0`

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.jobs-search__results-list');
        const totalJobs = await page.$eval('.results-context-header__job-count', el => el.textContent.trim())
        console.log(`Expected jobs: ${totalJobs}`)

        const viewedAll = '.see-more-jobs__viewed-all.hidden'
        const loadMore = 'button.infinite-scroller__show-more-button--visible'

        let selectorFound = true;
        let pageNum = 0;
        let extractedItems

        while (selectorFound) {

          if (extractedItems >= maxJobs) {
            console.log('Max jobs listed')
            break;
          }

          try {
            await page.waitForSelector(viewedAll, { timeout: 5000 });
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            try {
                await page.waitForSelector(loadMore, {timeout: 3000});
                pageNum++

                await utils.waitFor(3000)
                await page.click(loadMore)
                // console.log(`Manual loading`)

                const jobItems = await page.$$('.job-search-card')
                extractedItems = jobItems.length
                console.log(`Page No: ${pageNum}, total: ${extractedItems} jobs found`)

            } catch (error) {
                // console.log('Automatic loading')

                pageNum++
                const jobItems = await page.$$('.job-search-card')
                extractedItems = jobItems.length
                console.log(`Page No: ${pageNum}, total: ${extractedItems} jobs found`)

            }
            // selectorFound = true;
          } catch (error) {
            console.log('You\'ve loaded all jobs for this search');
            selectorFound = false;
          }
        }

        let jobsArray = []

        const jobItems = await page.$$('.jobs-search__results-list > li')
        let i = 0

        for (const job of jobItems) {
            if (i >= maxJobs) {
                console.log('Max jobs extracted')
                break; 
            }
            await job.click();
            await utils.waitFor(3000)
            await page.waitForSelector('.show-more-less-html__markup')

            let salary
            let status
            let applicants
            let description
            let location

            const title = await job.$eval('.base-search-card__title', el => el.textContent.trim());
            const company = await job.$eval('.base-search-card__subtitle', el => el.textContent.trim());
            location = await job.$eval('.job-search-card__location', el => el.textContent.trim());
            // const posted_date = await job.$eval('time[datetime]', el => el.getAttribute('datetime').trim());
            const posted = await job.$eval('time[datetime]', el => el.textContent.trim());
            const url = await job.$eval('a[data-tracking-control-name="public_jobs_jserp-result_search-card"]', el => el.getAttribute('href').trim())

            //location
            if(location.includes('India')) {
                location = location.replace(', India', '')
            }

            //Salary
            try {
                salary = await job.$eval('.job-search-card__salary-info', el => el.textContent.trim())
            } catch (error) {
                salary = ''
            }

            //status
            try {
                status = await job.$eval('.result-benefits__text', el => el.textContent.trim())
                if(status.includes('early')){
                    status = 'Apply Soon'
                }                
                if(status.includes('Actively')){
                    status = 'Open'
                }

            } catch (error) {
                status = ''
            }
            
            //Applicants
            try {
                applicants = await page.$eval('.num-applicants__caption', el => el.textContent.trim())
                applicants = applicants.replace(' applicants', '')

                if(applicants.includes('among')){
                applicants = applicants.replace('Be among the first ', 'First ')
                }

                if(applicants.includes('Over')){
                applicants = applicants.replace('Over ', '')
                applicants = applicants.concat('+')
                }

            } catch (error) {
                applicants = ''
            }

            //Description
            try {
                description = await page.$eval('.show-more-less-html__markup', el => el.textContent.trim())
            } catch (error) {
                description = ''
            }

            //Criteria
            const jobCriteria = await page.$$eval('.description__job-criteria-item', elements => elements.map(el => el.innerText.trim()));

            const rawSeniority = jobCriteria.find(item => item.includes('Seniority level'));
            const rawType = jobCriteria.find(item => item.includes('Employment type'));
            const rawFunction = jobCriteria.find(item => item.includes('Job function'));
            const rawIndustries = jobCriteria.find(item => item.includes('Industries'));
            
            const seniority = rawSeniority ? rawSeniority.replace('Seniority level\n', '').trim() : '';
            const type = rawType ? rawType.replace('Employment type\n', '').trim() : '';
            const functions = rawFunction ? rawFunction.replace('Job function\n', '').trim() : '';
            const industries = rawIndustries ? rawIndustries.replace('Industries\n', '').trim() : '';

            const jobArrayItem = {
                platform, title, company, location, salary,
                posted, status, applicants, seniority, 
                type, functions, industries, url, description
            }

            jobsArray = [...jobsArray, jobArrayItem];
            i++
            console.log(`Job No: ${i}`)

        }
        console.log('Scraping Linkedin completed!')
        await browser.close()
        return jobsArray

      } catch (error) {
          console.error(error);
      }

  } catch (error) {
      console.error(error);
      return error
  }
}

export { startLinkedin }
