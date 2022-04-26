require('dotenv').config()
const router = require('express').Router();
const utils = require('../../../utils/validation');
const newspapers = require('../../../../database/newspapers.json');//...../database/newspapers
const users = require('../../../../database/users.json');
const jwt = require('jsonwebtoken')
const { body, validationResult} = require('express-validator');
const { check } = require('express-validator');
const fs = require('fs');
const jornales= []//array of newspapers (id,website,source)


//---------------------------------------------- FUNCTIONS -----------------------------------------------------
//Define the dunction that push newspapers's (id,website,source) to jornales array
newspapers.forEach(newspaper => {
    //Pushing the titles and the url in the array articles    
    jornales.push({id:newspaper.id, name: newspaper.name, website:newspaper.website})
    });


//---------------------------------------------- ROUTES -------------------------------------------------------

//--- GETS

//Get all newspapers (id,website,source) ---- DONE
router.get('/', authenticateToken , (req,res) => {
    //Display the articles
    console.log('request: GET /newspapers')             
    res.status(200).json(jornales)    
});
//Get newspapers (id,website,source) by id ---- DONE
router.get('/:newspapersId', authenticateToken , (req,res) => {
    //Display the newspapers
    const newspaperId = req.params.newspapersId;
    console.log('request: GET /newspapers/'+newspaperId+'') 
    const newspaper = newspapers.find(newspaper => newspaper.id === parseInt(newspaperId));
    if(!newspaper) return res.status(404).send("The newspaper with the provided ID does not exist.");
    res.status(200).json(jornales[newspaperId-1])
    
});



//--- POSTES   ---- DONE?

router.post('/',authenticateToken, //---- Validation Using express-validator
//---- Sanitization
check('name').isLength({ min: 5 }).withMessage('must be at least 5 chars long').toLowerCase().trim().not().isEmpty().trim().escape(),
check('website').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('address').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('base').isURL().withMessage('its not a url ').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
(req,res) => {
// Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).send(errors);
}
  const newspaper = {
    id: newspapers.length + 1,
    name: req.body.name,
    website: req.body.website,
    address: req.body.address,
    base: req.body.base    
    };
    console.log(newspaper);

let new_newspaper = {
  ...newspaper,
  "id":newspapers.length + 1
}
console.log(new_newspaper);
let new_newspapers = [
  ...newspapers,
  new_newspaper
]
let data = JSON.stringify(new_newspapers);

fs.writeFile('../database/newspapers.json', data, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

console.log('This is after the write call');
res.status(200).json(new_newspaper)


console.log('This is after the write call');
//

})



//--- PUTS (MODIFY) ---- DONE

router.put('/:id',authenticateToken,
(req, res) => {
  const id= req.params.id;
    let index = newspapers.findIndex(newspaper => newspaper.id == id)

    // Validation
    if(!index) return res.status(404).send("The task with the provided ID does not exist.");
    //---- Validation Using Joi-validation
    const { error } = utils.validateTask(req.body);
    if(error) return res.status(400).send(error);

    console.log(id);
  
      const data=req.body;
      Object.entries(data).map(([key, value]) => {
        newspapers[index][key] = value
    });
    const new_data = JSON.stringify(newspapers);
fs.writeFile('../database/newspapers.json', new_data, (err) => {
  if (err) throw err;      });
  res.status(200).json(new_data)
     
});


//--- DELETE ---- DONE

router.delete("/:newspapersId", (request, response) => {
  const taskId = request.params.id;
  const task = newspapers.find(task => task.id === parseInt(taskId));
  //if(!task) return response.status(404).send("The newspaper with the provided ID does not exist.");

  const index = newspapers.indexOf(task);
  newspapers.splice(index, 1);
  response.send(task);
 
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