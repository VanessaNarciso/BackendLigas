const Liga = require('../models/ligascortas')
const VisitaLiga = require('../models/visitaLiga')


const createLiga = function(req, res){
    const newLiga = new Liga(req.body)
    newLiga.save().then(function() {
        return res.send(newLiga)
    }).catch(function(error) {
        return res.status(400).send(error)
    })
}

const getLigasEmpresa = function(req, res) {
    console.log(req.body.idE)
    Liga.find({empresaLiga: req.body.idE}).then(function(misligas) {
      res.send(misligas)
    }).catch(function(error){
      res.status(404).send(error)
    })
  }

const irLiga = function(req, res){
    //Necesitamos enviar el req y el id de la liga que estamos checando
    const liga = req.params.liga
    Liga.getLiga(liga).then(function(liga){
        VisitaLiga.registerVisit(req, liga._id).then(function(company){
            return res.redirect(liga.ligaOriginal)
        }).catch(function(error) {
            return res.status(401).send({ error: error })
        })        
    }).catch(function(error) {
        return res.status(401).send({ error: error })
    })
}

  module.exports = {
    createLiga : createLiga,
    irLiga : irLiga,
    getLigasEmpresa : getLigasEmpresa
  }