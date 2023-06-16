const config = {
  naukri: {
      headers: {
        'accept': 'application/json',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'appid': 109,
        'content-type': 'application/json',
        'systemid': 109,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
      noOfResults: 50, //max 100
      delay: 1000
  },
  indeed: {
      launchOptions: { 
        headless:false,
        slowMo:0,
        args:['--start-maximized', '--disable-infobars', '--no-first-run', '--disable-extensions']
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      viewportSize: {
        width: 1366,
        height: 661,
      },
      noOfResults: 50,
      delay: 1000
  },
  linkedin: {
      launchOptions: { 
        headless:false,
        slowMo:0,
        args:['--start-maximized', '--disable-infobars', '--no-first-run', '--disable-extensions']
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      viewportSize: {
        width: 1366,
        height: 661,
      },
      noOfResults: 50,
      delay: 1000
  }
};

export default config;