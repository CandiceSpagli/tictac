const { Router } = require('express');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var userModel = require("../models/users")
var cityModel = require('../models/cities')


var journeySchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var journeyModel = mongoose.model('journey', journeySchema);

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*  SIGN UP*/
router.post('/sign-up', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      userfirtsname: req.body.userfirstnameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();
  
    req.session.users = {
      name: newUserSave.username,
      id: newUserSave._id,
    }
    console.log(req.session.user)
  
    res.redirect('/homepage')
  } else {
    res.redirect('/sign-in')
  }
  
});

/* SIGN-IN*/
router.post('/sign-in', async function (req,res,next){
  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password : req.body.passwordFromFront,
  })
  console.log('---------', searchUser)
  if(searchUser === null){
    res.redirect('/')
  }else{
    res.redirect('/homepage')
  }
}
);


/*GET HomePage if user is alrealdy sign up */
router.get('/homepage', function(req, res, next) {

  res.render('homepage', { title: 'CONNECTED' });
});


/*GET pageproposition */
router.post('/homefinal', async function(req, res, next) {
  console.log("----- REQBODY CITY", req.body)

var departfromfront = req.body.departcity;
console.log("FFDepart", departfromfront)

var arrivalfromfront = req.body.finalcity;
console.log("FFArrival", arrivalfromfront)

var datefromfront = req.body.calender;
console.log("FFDATE", datefromfront)

var journeyAskFF = {departfromfront, arrivalfromfront, datefromfront};
console.log("FF  JOURNEY", journeyAskFF)


var departbdd = await journeyModel.find({
  departure : departfromfront,
  arrival : arrivalfromfront,
  date : datefromfront
})
console.log('BDD  depart', departbdd)

  if (departbdd.length === 0)
  { res.redirect('/oups')
    console.log("VOYAGE perdu")
  }else{
    res.render("proposition", {departbdd})
    console.log("VOYAGE trouveee")
  }
});


//PROPOSITION
router.get('/proposition', async function(req, res, next) {

console.log("FFDepart")

  res.render('proposition');
});


//OUPS 
router.get('/oups', function(req, res, next) {
  res.render('oups', { title: 'Express' });
});

// confirmation

router.get('/confirmation', function(req, res, next) {
  res.render('confirmation', { title: 'My tickets' });
});



// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
