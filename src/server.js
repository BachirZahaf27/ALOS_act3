require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const users = require('../database/users.json');
const { is } = require('express/lib/request');
const utils = require('./utils/validation')
const jwt = require('jsonwebtoken')
const newspapers = require('../database/newspapers.json');//...../database/newspapers


//--- Middleware
app.use(express.json());


//--- IMPORTE ROUTES
const v1newsRoute = require('./api/v1/routes/News')
const v1newspapersRoute = require('./api/v1/routes/Newspapers')
const v2newsRoute = require('./api/v2/routes/News')
const v2newspapersRoute = require('./api/v2/routes/Newspapers')
const v2usersRoute = require('./api/v2/routes/Users')


//--- ROUTES Middlewares
app.use('/api/v1/news', v1newsRoute);
app.use('/api/v1/newspapers', v1newspapersRoute);
app.use('/api/v2/news', v2newsRoute);
app.use('/api/v2/newspapers', v2newspapersRoute);
app.use('/api/v2/users', v2usersRoute);


//ROUTES
app.get('/api', (req,res) => {
  console.log('WE ARE AT HOME')//
  res.send('\t\t\tClimate Change API \n\n https://bachir-zahaf.gitbook.io/live-climate-change-api/')
})

/*
// 1-Get user info
app.get('/api/users', authenticateToken , (req,res) => {
 res.status(200).json(users.filter(user => user.username === req.user.username))

})

// 2-Create a user
app.post('/api/users/signup', async (req,res) => {
  try{
    // AUTHNTIFICATION
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const user = {
      username: req.body.username,
      password: hashedPassword
    }
    users.push(user)
    res.status(201).send('User Created')
  }
  catch{res.status(500).send('ERROR')}
  
})

// 3-Login a user
app.post('/api/users/login', async (req,res) => {
  // AUTHNTIFICATION
  // Search for the username in the DB
  const user = users.find(user => user.username === req.body.username)
  if(user == null) {
    return res.status(400).send('User Not Found')
  }
  try{
    // Compare the entered password with the dcrypted password
    if(await bcrypt.compare(req.body.password, user.password)) {
      
      // Implemant JWTokens
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({ accessToken: accessToken })
      //res.status(200).send('Logged in')
    } else { 
      res.status(200).send('Not Allowed')
    }

  } catch {
    return res.status(400).send('User Not Found')
  } 
})

//--- AUTH TOKEN function
function authenticateToken(req,res,next) {
  // Get the Token from the header
  // Bearer TOKEN
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)//didn't send a token or a valid one
  // Verify if the token exist in the DB
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
    if(err) return res.sendStatus(403)//this token is not valide so you don't have access
    req.user = user
    next()
  })
}
*/

//--- LISTENING
app.listen(3000, () => {
    console.log('Climate Change API is running')
    console.log('Server is Listening')
  });
module.exports = app;