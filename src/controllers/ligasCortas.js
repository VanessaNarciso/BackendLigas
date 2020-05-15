const Liga = require('../models/ligascortas')
const VisitaLiga = require('../models/visitaLiga')
var ObjectId = require('mongodb').ObjectId;


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

const getLiga = function(req, res) {
    const idLiga = req.params.idLiga
    console.log(req.params.idLiga)
    Liga.findOne({_id: idLiga}).then(function(liga) {
      res.send(liga)
    }).catch(function(error){
      res.status(404).send(error)
    })
}

const getVisitasLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    Liga.aggregate([
        {
            $match:{
                "empresaLiga" : ObjectId(empresa)
            }
        },
        {
            $lookup:{
                "localField" : "_id",
                "from" : "visitaligas",
                "foreignField" : "ligaId",
                "as" : "visitas"
            }
        },
        {
            $project:{
                _id : null,
                "visita" : {
                    "$concatArrays" : "$visitas"
                }                
            }
        },
        {
            $unwind: "$visita"
        }
    ], (aggregateError, aggregateResult)=>{
        if(!aggregateError)
            return res.send(aggregateResult)
        else
            return res.status(404).send(aggregateError)        
    })
}

const getNavegadoresLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    Liga.aggregate([
        {
            $match:{
                "empresaLiga" : ObjectId(empresa)
            }
        },
        {
            $lookup:{
                "localField" : "_id",
                "from" : "visitaligas",
                "foreignField" : "ligaId",
                "as" : "visitas"
            }
        },
        {
            $project:{
                _id : null,
                "visita" : {
                    "$concatArrays" : "$visitas"
                }                
            }
        },
        {
            $unwind: "$visita"
        },
        {
            $group:{
                _id:"$visita.navegador",
                "visitas":{
                     "$sum":1
                }           
            }
        }
    ], (aggregateError, aggregateResult)=>{
        if(!aggregateError)
            return res.send(aggregateResult)
        else
            return res.status(404).send(aggregateError)        
    })
}

const updateLiga = function(req, res) {
  const id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['nombreLiga', 'codigoLiga', 'ligaCorta', 'ligaOriginal','fechaModificacion']
  // revisa que los updates enviados sean permitidos, que no envie una key que no permitimos
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }
  console.log(req.body)
  Liga.findOneAndUpdate(id, req.body ).then(function(liga) {
    if (!liga) {
      return res.status(404).send({ error: `Liga con id ${id} no encontrada.`})
    }    
    return res.send(liga)
  }).catch(function(error) {
    res.status(500).send(error)
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
    getLigasEmpresa : getLigasEmpresa,
    getVisitasLigasEmpresa : getVisitasLigasEmpresa,
    getNavegadoresLigasEmpresa : getNavegadoresLigasEmpresa,
    getLiga : getLiga,
    updateLiga : updateLiga
  }