const Landing = require('../models/landing')
const confLanding = require('../models/confLanding')
const VisitaLanding = require('../models/visitaLanding')
var ObjectId = require('mongodb').ObjectId;

const express = require('express');
const app = express();
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '/public')));


/// Para cerar un landing hay que crear su configuración (titulo, texto, footer, img)
/// Y su información (nombre, descripcion, empresa, creador, template, fechaCreación, liga)
/// en req.body recibimos  objeto infoLanding y configLanding
const createLanding = function(req, res){    
    const newLanding = new Landing(req.body.infoLanding)
    var confLand = req.body.configLanding
    newLanding.save().then(function(){        
        const landingId = newLanding._id;
        confLand["landingId"] = landingId
        console.log(confLand)
        const newConfLanding = new confLanding(confLand)
        console.log(newConfLanding)
        newConfLanding.save().then(function(){
          console.log("Creado landing y configuracion")
          return res.send({newLanding,newConfLanding})
        }).catch(function(error2){
          console.log("Creado landing NO configuracion")
          console.log(error2)
          return res.status(400).send(error2)          
        })
    }).catch(function(error){
        console.log("Creado NO landing NO configuracion")
        console.log(error)
        return res.status(400).send(error)
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

const irLanding = function(req, res){
  template = req.params.template
  code = req.params.code
  Landing.aggregate([
      {
          $match:{
              "codeLanding" : code
          }
      },  
      {
          $lookup:{
              "from" : "conflandings",
              "foreignField" : "landingId",
              "localField" : "_id",
              "as" : "conflanding"
          }
      },
      {
          $project:{
              "titulo": { "$arrayElemAt": [ "$conflanding.titulo", 0 ] },
              "texto": { "$arrayElemAt": [ "$conflanding.texto", 0 ] },
              "footer": { "$arrayElemAt": [ "$conflanding.footer", 0 ] },
              "imagen": { "$arrayElemAt": [ "$conflanding.imagen", 0 ] }                              
          }
      }
  ], (aggregateError, aggregateResult)=>{
      if(!aggregateError){
        console.log(aggregateResult)
        VisitaLanding.registerVisit(req, aggregateResult[0]._id).then(function(company){
          const datos = aggregateResult[0]
          res.render(
            template,
            {
              titulo : datos.titulo,
              texto : datos.texto,
              footer : datos.footer,
              img : datos.imagen
            }
          )
        }).catch(function(error) {
          return res.status(401).send({ error: error, msg:'No se pudo registrar visita' })
        })        
      }
      else
          return res.status(404).send(aggregateError)
  })
}

const getLandingAll = function(req, res) {
  Landing.aggregate([        
      {
          $lookup:{
            "localField" : "empresaLanding",
            "from" : "empresas",
            "foreignField" : "_id",
            "as" : "empresaLanding"
          }
      },
      {
          $project:{
            "nombreLanding" : "$nombreLanding",
            "codeLanding" : "$codeLanding",
            "fechaCreacion" : "$fechaCreacion",
            "ligaLanding" : "$ligaLanding",
            "templateChoice" : "$templateChoice",
            "descripcionLanding" : "$descripcionLanding",
            "creator": { "$arrayElemAt": [ "$empresaLanding.nombre", 0 ] }                             
          }
      }
  ], (aggregateError, aggregateResult)=>{
      if(!aggregateError)
          return res.send(aggregateResult)
      else
          return res.status(404).send(aggregateError)        
  })
}

const getLandingEmpresa = function(req, res) {
  const empresa = req.params.empresa
  Landing.aggregate([
      {
          $match:{
              "empresaLanding" : ObjectId(empresa)
          }
      },  
      {
        $lookup:{
          "localField" : "createdBy",
          "from" : "users",
          "foreignField" : "_id",
          "as" : "creator"
        }
      },
      {
        $project:{
          "nombreLanding" : "$nombreLanding",
          "codeLanding" : "$codeLanding",
          "fechaCreacion" : "$fechaCreacion",
          "ligaLanding" : "$ligaLanding",
          "templateChoice" : "$templateChoice",
          "descripcionLanding" : "$descripcionLanding",
          "creator": { "$arrayElemAt": [ "$creator.nombre", 0 ] }                             
        }
      }
  ], (aggregateError, aggregateResult)=>{
      if(!aggregateError)
          return res.send(aggregateResult)
      else
          return res.status(404).send(aggregateError)        
  })
}

const getVisitasLandingsAll = function(req, res) {
  Landing.aggregate([
      {
          $lookup:{
              "localField" : "_id",
              "from" : "visitalandings",
              "foreignField" : "landingId",
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

const getVisitasLandingsEmpresa = function(req, res) {
  const empresa = req.params.empresa
  Landing.aggregate([
      {
        $match:{
            "empresaLanding" : ObjectId(empresa)
        }
      },
      {
          $lookup:{
              "localField" : "_id",
              "from" : "visitalandings",
              "foreignField" : "landingId",
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

const getNavegadoresLandingsAll = function(req, res) {
  Landing.aggregate([
      {
          $lookup:{
              "localField" : "_id",
              "from" : "visitalandings",
              "foreignField" : "landingId",
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

const getNavegadoresLandingsEmpresa = function(req, res) {
  const empresa = req.params.empresa
  Landing.aggregate([
      {
        $match:{
            "empresaLanding" : ObjectId(empresa)
        }
      },
      {
          $lookup:{
              "localField" : "_id",
              "from" : "visitalandings",
              "foreignField" : "landingId",
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

  module.exports = {
    createLanding: createLanding,
    getLandingEmpresa : getLandingEmpresa,
    getLanding : getLanding,
    getLandingAll : getLandingAll,
    getVisitasLandingsAll : getVisitasLandingsAll,
    getVisitasLandingsEmpresa : getVisitasLandingsEmpresa,
    getNavegadoresLandingsAll : getNavegadoresLandingsAll,
    getNavegadoresLandingsEmpresa : getNavegadoresLandingsEmpresa,
    irLanding : irLanding
  }