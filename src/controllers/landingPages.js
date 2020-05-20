const Landing = require('../models/landing')
const confLanding = require('../models/conflanding')
var ObjectId = require('mongodb').ObjectId;

const createLanding = function(req, res){
    const newLanding = new Landing(req.body)
    newLanding.save().then(function(){
        return res.send(newLanding)
    }).catch(function(error){
        return res.status(400).send(error)
    })
}

const getLandingEmpresa = function(req, res) {
    const empresa = req.params.empresa
    console.log(req.params.empresa)
    Landing.find({empresaLanding: empresa}).then(function(mislanding) {
      res.send(mislanding)
    }).catch(function(error){
      res.status(404).send(error)
    })
}

const getLanding = function(req, res) {
    const landingId = req.params.landingId
    console.log(req.params.landingId)
    Landing.findOne({_id: landingId}).then(function(landing) {
      res.send(landing)
    }).catch(function(error){
      res.status(404).send(error)
    })
}

  module.exports = {
    createLanding: createLanding,
    getLandingEmpresa : getLandingEmpresa,
    getLanding : getLanding
  }