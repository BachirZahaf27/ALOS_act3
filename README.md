# ALOS_act3

* In this version of the API i add the Versioning & the JWT Authentication to my API.

### I- Versioning API :

### II- JWT Authentication :

* To add the JWT Authentication to my API we need to understand how it works first, this diagramme shows the Implementation of JWT Authentication:

 ![Untitled (1)](https://user-images.githubusercontent.com/61596276/165381125-e1582164-3701-46a6-a132-bd06c2780cc1.png)
 
### 1- Crypting the user Password :
 
* To crypt the the password we need to install "bcrypt" package:

       npm i bcrypt
                   
* Then we can hash the password by adding the Salt :

      // hash the password
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

### 2- Implement JWTokens : 

* To implement JWTokens for Authentication we need to install "dotenv" & "jsonwebtoken" package:
* Dotenv package:

       npm i dotenv
       
* Jsonwebtoken package :      
        
       npm i jsonwebtoken

* Then we need to make a Access Secret Token that jwt use to create the token:
A) create a .env file and use jwt crypto function to generate a random value:

       $ node
       > require('crypto').randomBytes(64).toString('hex')

B) we assign the return value to ACCESS_TOKEN_SECRET in the .env file.

* Third, we sign the user with the ACCESS_TOKEN_SECRET using JWT process:

      require('dotenv').config()
      const jwt = require('jsonwebtoken')
      ...
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({ accessToken: accessToken })

* 





