var express = require('express');
var router = express.Router();
var us_states = require('../us_state.js');
const fetch = require('node-fetch');
var bodyParser = require('body-parser')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find My Election', states: us_states });
  next()
});

router.post('/', function(req, res, next) {
  let baseURL = `https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/`
  let city = req.body.city.toLowerCase()
  let state = req.body.state.toLowerCase()

  if(city == ""){
    fetch(`${baseURL}state:${state}`, {headers: {'Accept': 'application/json'}})
    .then(res => res.json())
    .then(data => gatherInfo(data, res))  
  } else{
    fetch(`${baseURL}state:${state}/place:${city}`, {headers: {'Accept': 'application/json'}})
    .then(res => res.json())
    .then(data => gatherInfo(data, res))  
  }
  
})

function gatherInfo(data, res){
  const description = []
  const date = []
    data.forEach(el => {
      description.push(el.description)
      date.push(el.date)
    });
    
    res.render('search', { title: 'results', des: {description} || 'none', date: {date} || 'none'} )      
}

module.exports = router;
