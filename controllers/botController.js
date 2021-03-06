const puppeteer = require('puppeteer');
const axios = require('axios');
const convert = require('xml-js');

module.exports = {
    getBlogList: async function (req, res) {
        let urlParam = req.query.url;
        let blogList = new Array();
        let postSitemap;
        
        // Removing the / from the url input.
        let url = (urlParam.charAt(urlParam.length - 1) === '/') ? urlParam.substring(0, urlParam.length - 1) : urlParam;

        let sitemap = await axios.get(url + '/sitemap.xml')
            .then((response) => {
                return JSON.parse(convert.xml2json(response.data, {
                    compact: true,
                    spaces: 4
                }));
            })
            .catch((err) => {
                res.send(err)
            })

        if (sitemap._comment) {
            let counter = 0;
            // Yoast SEO Plugin Sitemaps
            let mainSitemap = sitemap.sitemapindex.sitemap;
            for (let x in mainSitemap) {
                if (mainSitemap[x].loc._text.search("/post-sitemap") > 0) {
                    counter++;
                }
            }

            // There are two cases for the counter. 
            // First is when there is only one /post-sitemap.xml link in yoast sitemap (Here, counter === 1)
            // Second is when there is more than one /post-sitemap.xml (Here, counter > 1)
            if (counter === 1) {
                postSitemap = await axios.get(url + '/post-sitemap.xml')
                    .then((response) => {
                        return JSON.parse(convert.xml2json(response.data, {
                            compact: true,
                            spaces: 4
                        }));
                    })
                    .catch((err) => {
                        res.send(err)
                    });
                blogList = postSitemap.urlset.url.map(elem => elem.loc._text);
            } else if(counter > 1) {
                for(let x=1; x <= counter; x++){
                    postSitemap = await axios.get(url + '/post-sitemap'+x+'.xml')
                    .then((response) => {
                        return JSON.parse(convert.xml2json(response.data, {
                            compact: true,
                            spaces: 4
                        }));
                    })
                    .catch((err) => {
                        res.send(err)
                    });
                    blogList = blogList.concat(postSitemap.urlset.url.map(elem => elem.loc._text));
                }
            }
        } else {
            // Other types of Sitemaps
            blogList = sitemap.urlset.url.map(elem => elem.loc._text);
        }

        res.json({
            totalArticles: blogList.length,
            articleList: blogList
        });
    }
}