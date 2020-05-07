const Liga = require('../models/ligascortas')


const createLiga = function(req, res){
    const newLiga = new Liga(req.body)
    newLiga.save().then(function() {
        return res.send(newLiga)
    }).catch(function(error) {
        return res.status(400).send(error)
    })
}

const irLiga = function(req, res){
    console.log(req.params)
    const liga = req.params.liga
    Liga.getLiga(liga).then(function(urlorg){
        return res.redirect(urlorg)
    }).catch(function(error) {
        return res.status(401).send({ error: error })
    })
}

  module.exports = {
    createLiga : createLiga,
    irLiga : irLiga
  }