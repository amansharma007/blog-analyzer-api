const puppeteer = require('puppeteer');

module.exports = {
    getBlogList: async function (req, res) {
        //This script will work for the blogs that are using the Yoast SEO plugin for their wordpress blogs.
        try {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            let url = 'https://cosplaybible.com';
            await page.goto(url + '/sitemap_index.xml');
            await page.waitForSelector('tbody tr');
            let rows = await page.$$('tbody tr');

            // Go to the link of post-sitemap
            for (let elem of rows) {
                let link = await elem.$eval('a', selec => selec.innerText);
                if (link === (url + '/post-sitemap.xml')) {
                    await page.goto(link);
                    break;
                }
            }

            // Get all the links from the post-sitemap & store it in the array
            await page.waitForSelector('tbody tr');
            rows = await page.$$('tbody tr');
            let allBlogLinks = new Array();
            for (let elem of rows) {
                let link = await elem.$eval('a', selec => selec.innerText);
                allBlogLinks.push(link);
            }

            //Removing the first element of the array
            allBlogLinks.shift();

            //Sending the response
            res.json({
                totalBlogs: allBlogLinks.length,
                blogLinks: allBlogLinks
            })
            
            //Closing the browser
            browser.close();
        } catch (e) {
            res.send(e);
        }
    }
}