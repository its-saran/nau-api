import config from '../config/configuration.js';
import axios from 'axios'


async function example() {
    try {
        console.log('Started Scrapping example.com!')

        const url = `https://example.com`
        const headers = config.naukri.headers

        const response = await axios.get(url, {headers});
        const data = response.data
        return data

    } catch (error) {
        return [{'error': error}]
    }
}

export const scrapeExample = async(req, res) => {
  const rawData = await example()
  res.send(rawData)
}
