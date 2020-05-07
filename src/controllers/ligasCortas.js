const Liga = require('../models/ligascortas')


const createLiga = function(req, res){
    const newLiga = new Liga(req.body)
    newLiga.save().then(function() {
        return res.send(newLiga)
    }).catch(function(error) {
        return res.status(400).send(error)
    })
}



  module.exports = {
    createLiga : createLiga
  }