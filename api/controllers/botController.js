const puppeteer = require('puppeteer');
const axios = require('axios');
const convert = require('xml-js');

module.exports = {
    getBlogList: async function (req, res) {
        let urlParam = req.query.url;
        let url = (urlParam.charAt(urlParam.length - 1) === '/') ? urlParam.substring(0, urlParam.length - 1) : urlParam;
        let blogList = new Array();
        let sitemap = await axios.get(url+'/sitemap.xml')
        .then((response) => {
            return JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}));
        })
        .catch((err) => {
            res.send(err)
        })
        
        // res.json(sitemap);
        if(sitemap._comment){
            // Yoast SEO Plugin Sitemaps
            
            /* !!!!!! Solve the case in which you have more than one /post-sitemap urls. For e.g, https://lifehack.org */
            let postSitemap = await axios.get(url+'/post-sitemap.xml')
            .then((response) => {
                return JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}));
            })
            .catch((err) => {
                res.send(err)
            })
            blogList = postSitemap.urlset.url.map(elem => elem.loc._text);
        } else {
            // Other Sitemaps
            blogList = sitemap.urlset.url.map(elem => elem.loc._text);
        }

        res.json({
            totalArticles: blogList.length,
            articleList: blogList
        });
    }
}