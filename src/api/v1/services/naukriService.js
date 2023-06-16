import config from '../config/configuration.js';
import axios from 'axios'
import utils from '../utils/utils.js';

const platform = 'Naukri'

const startNaukri = async ({jobKeyword, jobLocation, experience, sortBy, maxJobs=100000}) => {  // 100000 is a placeholder
  try {
      console.log(`Keyword: ${jobKeyword}, Location: ${jobLocation}, Rseults: ${maxJobs}`)
      console.log(`\nStarted Scrapping ${platform}}!`)

      const headers = config.naukri.headers
      const noOfResults = config.naukri.noOfResults
      let pageNo = 1

      const cmLocation = jobLocation && jobLocation.toLowerCase();
      const cmKeyword = jobKeyword && jobKeyword.toLowerCase();

      jobLocation = jobLocation && encodeURIComponent(jobLocation.toLowerCase());
      jobKeyword = jobKeyword && encodeURIComponent(jobKeyword.toLowerCase());

      let totalJobs = 100// 100 is placeholder
      let jobData = []

      for(let i = 0; i <= totalJobs && jobData.length < maxJobs; i += noOfResults) {``
          let url
          let cmIdType

          if (jobData.length === totalJobs) break;

          url = `https://www.naukri.com/jobapi/v3/search?noOfResults=${noOfResults}&searchType=adv&pageNo=${pageNo}`
          if (jobLocation && jobKeyword) {
              url = url + `&urlType=search_by_key_loc&keyword=${jobKeyword}&location=${jobLocation}`
          } else if (jobLocation && !jobKeyword) {
              url = url + `&urlType=search_by_location&searchType=adv&location=${jobLocation}`
          } else if (!jobLocation && jobKeyword) {
              url = url + `&urlType=search_by_keyword&keyword=${jobKeyword}`
          }
          
          experience !== undefined && (url += `&experience=${experience}`);
          sortBy && (url += `&sort=${sortBy}`);

          const response = await axios.get(url, {headers});
          const data = response.data
          totalJobs = data.noOfJobs
          
          const jobDetials = data.jobDetails
          jobDetials.map(job => {

              const getReviewsCount = () => {
                if (typeof(job.ambitionBoxData) !== 'undefined') {
                  return job.ambitionBoxData.ReviewsCount;
                } else {
                  return ''
                }
              } 
              const getRatings = () => {
                if (typeof(job.ambitionBoxData) !== 'undefined') {
                  return job.ambitionBoxData.AggregateRating;
                } else {
                  return ''
                }
              } 

              const reviews = getReviewsCount()
              const ratings = getRatings()
              const jobId = job.jobId
              const groupId = job.groupId
              const title = job.title
              const company = job.companyName
              const skills = job.tagsAndSkills != '' ? job.tagsAndSkills.replace(/,/g, ", ") : "";
              let salary = job.placeholders[1].label === 'Not disclosed' ? '' : job.placeholders[1].label;
              const postedDate = job.createdDate
              const jobUrl = `https://www.naukri.com${job.jdURL}`
              const description = job.jobDescription
              const experience = job.placeholders[0].label
              const location = job.placeholders[2].label
              const companyId = job.companyId
              const companyUrl = `https://www.naukri.com${job.staticUrl}`
              const cmId = `CM-N#${jobId}`

              if (salary.includes('Lacs')) {
                const salaryParts = salary.split(' Lacs PA')[0].split('-');
                const minSalary = Number(salaryParts[0]) * 100000;
                const maxSalary = Number(salaryParts[1]) * 100000;
                const formattedMinSalary = '₹' + minSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 });
                const formattedMaxSalary = '₹' + maxSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 });
                salary = `${formattedMinSalary} - ${formattedMaxSalary}` //PA
              } 

              if (salary !== '' && salary.includes('PA')) {
                salary = '₹' + salary.replace('PA', '').trim() 
              }

              const jobObject = {
                  cmId, cmKeyword, cmLocation, title, company, location, ratings,
                  reviews, salary, experience, skills, postedDate, 
                  jobUrl, jobId, groupId, companyUrl, companyId, description
              }

          jobData.push(jobObject);
          })

          pageNo++
          await utils.waitFor(config.naukri.delay)
          console.log(`${jobData.length}/${totalJobs} Data extracted`)
      }

      if (jobData.length <= maxJobs ) {
          console.log(`Total Items : ${jobData.length}`)
          console.log(`Scraping ${platform} completed!`)
          return jobData
      } else {
          const newJobData = jobData.slice(0, maxJobs)
          console.log(`Total Items : ${newJobData.length}`)
          console.log(`Scraping ${platform} completed!`)
          return newJobData
      }
  } catch (error) {
      console.error(error);
  }
}


export { startNaukri }
