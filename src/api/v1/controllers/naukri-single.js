import config from '../config/configuration.js';
import axios from 'axios'

const platform = 'naukri'

async function naukri({jobKeyword, jobLocation, experience, sortBy, maxJobs=100000}) {
    try {
        console.log('Started Scrapping Naukri!')

        const headers = config.naukri.headers
        const noOfResults = config.naukri.noOfResults
        let pageNo = 1

        const locationLabel = jobLocation && jobLocation.toLowerCase();
        const keywordLabel = jobKeyword && jobKeyword.toLowerCase();

        jobLocation = jobLocation && encodeURIComponent(jobLocation.toLowerCase());
        jobKeyword = jobKeyword && encodeURIComponent(jobKeyword.toLowerCase());

        let url
        let cmIdType

        url = `https://www.naukri.com/jobapi/v3/search?noOfResults=${noOfResults}&searchType=adv&pageNo=${pageNo}`

        if (jobLocation && jobKeyword) {
          url = url + `&urlType=search_by_key_loc&keyword=${jobKeyword}&location=${jobLocation}`
          cmIdType = 1
        } else if (jobLocation && !jobKeyword) {
          url = url + `&urlType=search_by_location&searchType=adv&location=${jobLocation}`
          cmIdType = 2
        } else if (!jobLocation && jobKeyword) {
          url = url + `&urlType=search_by_keyword&keyword=${jobKeyword}`
          cmIdType = 3
        }

        experience !== undefined && (url += `&experience=${experience}`);
        sortBy && (url += `&sort=${sortBy}`);

        const response = await axios.get(url, {headers});
        const data = response.data
        const totalJobs = data.noOfJobs

        const jobDetials = data.jobDetails
        let jobData = []
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

          let cmId
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

          if (cmIdType == 1) {
              cmId = `${platform}-${keywordLabel.replace(/ /g, '-')}-${jobId}`
            } else if (cmIdType == 2) {
              cmId = `${platform}-${locationLabel.replace(/ /g, '-')}-${jobId}`
            } else if (cmIdType == 3) { 
              cmId = `${platform}-${keywordLabel.replace(/ /g, '-')}-${jobId}`
            }
            
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
              cmId, title, company, location, ratings,
              reviews, salary, experience, skills, postedDate, 
              jobUrl, jobId, groupId, companyUrl, companyId, description
          }
          jobData.push(jobObject);
        })
        console.log('Scrapping Finished!')
        return jobData

    } catch (error) {
        // console.error(error);
        return [{'error': error}]
    }
}

export const scrapeNaukri = async(req, res) => {
  const rawData = await naukri({jobKeyword:'developer', jobLocation:'kochi'})
  res.send(rawData)
  console.log(rawData)
}







