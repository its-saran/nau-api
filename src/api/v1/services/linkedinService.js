import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config/configuration.js';

const platform = 'Linkedin'

async function startLinkedin({jobKeyword, jobLocation}) {
  try {
      console.log(`Started Scrapping ${platform}`)

      const headers = config.naukri.headers

      jobLocation = jobLocation && encodeURIComponent(jobLocation.toLowerCase());
      jobKeyword = jobKeyword && encodeURIComponent(jobKeyword.toLowerCase());

      const url = `https://in.linkedin.com/jobs/search?keywords=${jobKeyword}&location=${jobLocation}&position=1&pageNum=1`

      const response = await axios.get(url, {headers});
      const html = response.data

      const $ = cheerio.load(html);

      const jobCountElement = $('.results-context-header__job-count');
      const jobCountText = jobCountElement.text();
      console.log('Job count:', jobCountText);

      return html;
  } catch (error) {
      console.error(error);
      return error
  }
}


export { startLinkedin }
