import config from '../config/configuration.js';
import axios from 'axios'


async function indeed() {
    try {
        console.log('Started Scrapping indeed.com!')

        const url = `https://in.indeed.com/Data-Analyst-jobs`
        const headers = config.naukri.headers

        const response = await axios.get(url, {headers});
        const data = response.data
        return data

    } catch (error) {
        return [{'error': error}]
    }
}

export const scrapeIndeed = async(req, res) => {
  const rawData = await indeed()
  res.send(rawData)
}
