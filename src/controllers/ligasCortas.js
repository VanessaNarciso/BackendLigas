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
    const empresa = req.params.empresa
    console.log(req.params.empresa)
    Liga.find({empresaLiga: empresa}).then(function(misligas) {
      res.send(misligas)
    }).catch(function(error){
      res.status(404).send(error)
    })
  }

const irLiga = function(req, res){
    //Necesitamos enviar el req y el id de la liga que estamos checando
    const ligaa = req.params.liga;
    console.log("Ir a: ",ligaa);
    Liga.getLiga(ligaa).then(function(liga){
        VisitaLiga.registerVisit(req, liga._id).then(function(company){
            return res.redirect(liga.ligaOriginal)
        }).catch(function(error) {
            return res.status(401).send({ error: error, msg:'No se pudo registrar visita' })
        })        
    }).catch(function(error) {
        return res.status(401).send({ error: error, msg:'No se pudo obtener esa liga'  })
    })
}

  module.exports = {
    createLiga : createLiga,
    irLiga : irLiga,
    getLigasEmpresa : getLigasEmpresa
  }