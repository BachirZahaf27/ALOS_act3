# ALOS_act3

* In this version of the API i add the Versioning & the JWT Authentication to my API.

## Folder Structure

```
├─── database
|    ├─── users.json
│    └─── newspapers.json
└─── src
     ├─── api
     │    ├─── v1
     |    |    ├─── News.js
     │    │    └─── Newspapers.js
     │    └─── v2
     |         ├─── News.js
     │         ├─── Newspapers.js
     │         └─── Users.js
     ├─── test
     |    └─── tests.js
     ├─── utils
     |    └─── validation.js
     ├─── .env
     ├─── server.js
     ├─── package.json
     ├─── package-lock.json
     ├─── requst.rest
     └─── node_modles

```
## I- Versioning API :

### v1

The first version only queries newspapers and news.

### v2

In the second version, you can query users, in addition to everything in v1.
On top of that, v2 offers authentification and authorization to all routes.

#### Authentification
You can use */api/v2/user/signup* to register a user account

And */api/user/v2/login* to login to your existing account

All *v2* routes will check for the *access-token* header, no prefixes.


## II- JWT Authentication :

* To add the JWT Authentication to my API we need to understand how it works first, this diagramme shows the Implementation of JWT Authentication :

 ![Untitled (1)](https://user-images.githubusercontent.com/61596276/165381125-e1582164-3701-46a6-a132-bd06c2780cc1.png)
 
### 1- Crypting the user Password :
 
* To crypt the the password we need to install "bcrypt" package :

       npm i bcrypt
                   
* Then we can hash the password by adding the Salt :

      // hash the password
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

### 2- Implement JWTokens : 

* To implement JWTokens for Authentication we need to install "dotenv" & "jsonwebtoken" package :
* Dotenv package :

       npm i dotenv
       
* Jsonwebtoken package :      
        
       npm i jsonwebtoken
       

* Then we need to make a Access Secret Token that jwt use to create the token :

   A) create a .env file and use jwt crypto function to generate a random value :

       $ node
       > require('crypto').randomBytes(64).toString('hex')

   B) we assign the return value to ACCESS_TOKEN_SECRET in the .env file.
   
      ACCESS_TOKEN_SECRET=2d1e69089d7c7b1df2ebeee91a690f0883cbe8dfb05fef4f470bb4f3b1b2acce4421787c44f3e0f2a931ace65d0080823cdf0c4ef6e2f9262087ac393805f247

* Next, we sign the user with the ACCESS_TOKEN_SECRET using JWT process :

      require('dotenv').config()
      const jwt = require('jsonwebtoken')
      ...
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({ accessToken: accessToken })

### 3- Verify JWTokens :

* To verify JWToken we need to create authenticateToken function that we can call it as a middleware in all the endpoints :
* First we need to get the header from the request header:

      const authHeader = req.headers['authorization']  

* Sencond, we need to get the token from the header (Bearer token) by spliting it and taking only the second part (token):
 
      // Example : Authorization: Bearer Token
      const token = authHeader && authHeader.split(' ')[1] 

* Then, we can verify the token with ACCESS_TOKEN_SECRET using jwt verify function :

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)//this token is not valide so you don't have access
        req.user = user
        next()
      })
  
## III- Past version documentation :

       https://github.com/BachirZahaf27/ALOS_act2/blob/main/README.md
## IV- Documentation :

       https://bachir-zahaf.gitbook.io/live-climate-change-api/



