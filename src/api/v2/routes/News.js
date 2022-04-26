require('dotenv').config()
const jwt = require('jsonwebtoken')
const users = require('../../../../database/users.json');

const router = require('express').Router();
const newspapers = require('../../../../database/newspapers.json');
const axios = require('axios');
const cheerio = require('cheerio');
const { body, validationResult} = require('express-validator');
const { check } = require('express-validator');

const articles = []//array of news (id,title,url,newspaperId,source)


//---------------------------------------------- FUNCTIONS -----------------------------------------------------

let count=1;//counter of newsID
//Function of getting data about climate change and then putting it in the articles array
newspapers.forEach(newspaper => {
    //Using Axios to get data from the news publication
    axios.get(newspaper.address)
    .then((response) => {//Creating the respons that we apear in the feed
        const html = response.data //saving the response
        const $ = cheerio.load(html) //pickup element
        //Search for anything that talks about the climate change
            $('a:contains("climate")', html).each(function (){
                //Grabing the text in the A tag
                const title = $(this).text()//Picking the text
                const url = $(this).attr('href')//Picking the Url
                articles.push({id:count,title, url:newspaper.base + url, newspaperId:newspaper.id, source: newspaper.name})//Pushing the titles and the url in the array articles
                count++;
            })               
})
}) 


//---------------------------------------------- ROUTES -------------------------------------------------------

//--- GETS

 //Get all news (newsId,title,url,newspaperId,source) DONE
router.get('/', authenticateToken , (req,res) => {
     //Display the articles
     console.log('request: GET /news') 
     res.status(200).json(articles)    
 });
 //Get news (newsId,title,url,newspaperId,source) by id DONE
router.get('/:newsId', authenticateToken , (req,res) => {
     //Display the articles
     const newsId = req.params.newsId;
     console.log('request: GET /news/'+newsId+'') 
     const news = articles.find(news => news.id === parseInt(newsId));
     if(!news) return res.status(404).send("The news with the provided ID does not exist.");
     res.status(200).json(articles[newsId-1])//-1 because it start with 0 rathen 1   

});
//---------------------------------------------- AUTH -------------------------------------------------------

//--- AUTH TOKEN function
function authenticateToken(req,res,next) {
    // Get the Token from the header
    // Bearer TOKEN
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)//didn't send a token or a valid one
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
      if(err) return res.sendStatus(403)//this token is not valide so you don't have access
      req.user = user
      next()
    })
  }

module.exports = router;