require('dotenv').config()
const bcrypt = require('bcrypt')
const users = require('../../../../database/users.json');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const router = require('express').Router();

// 1-Get user info
router.get('/', authenticateToken , (req,res) => {
  console.log('request: GET /users')  
    res.status(200).json(users.filter(user => user.username === req.user.username))
   
   })
   
// 2-Create a user
router.post('/signup', async (req,res) => {
     try{
       // AUTHNTIFICATION
       // hash the password
       const salt = await bcrypt.genSalt()
       const hashedPassword = await bcrypt.hash(req.body.password, salt)
       
       const user = {
         id: users.length+1,
         username: req.body.username,
         password: hashedPassword
       }
       //
       console.log(user);

let new_user = {
  ...user,
  "id":users.length + 1
}
console.log(new_user);
let new_users = [
  ...users,
  new_user
]
let data = JSON.stringify(new_users);

fs.writeFile('../database/users.json', data, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

console.log('This is after the write call');
       res.status(201).send('User Created')
     }
     catch{res.status(500).send('ERROR')}
     
})
   
// 3-Login a user
router.post('/login', async (req,res) => {
  // AUTHNTIFICATION
  // Search for the username in the DB
  const user = users.find(user => user.username === req.body.username)
    if(user == null) {
       return res.status(400).send('User Not Found.')
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







module.exports = router;