const Liga = require('../models/ligascortas')
const VisitaLiga = require('../models/visitaLiga')

const getVisitasLiga = function(req, res) {
  const liga = req.params.liga
  console.log(req.params.liga)
  VisitaLiga.find({ligaId: liga}).then(function(visitas) {
    res.send(visitas)
  }).catch(function(error){
    res.status(404).send(error)
  })
}

const getContadorLiga = function(req, res) {
  const liga = req.params.liga
  console.log(req.params.liga)
  VisitaLiga.countDocuments({ligaId: liga}).then(function(num) {
    res.send({'visitas' : num})
  }).catch(function(error){
    res.status(404).send(error)
  })
}



  module.exports = {    
    getVisitasLiga : getVisitasLiga,
    getContadorLiga : getContadorLiga,
  }