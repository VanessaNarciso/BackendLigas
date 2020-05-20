const Landing = require('../models/landing')
const confLanding = require('../models/confLanding')
var ObjectId = require('mongodb').ObjectId;

const express = require('express');
const app = express();
app.set('view engine', 'hbs')

/// Para cerar un landing hay que crear su configuración (titulo, texto, footer, img)
/// Y su información (nombre, descripcion, empresa, creador, template, fechaCreación, liga)
/// en req.body recibimos  objeto infoLanding y configLanding
const createLanding = function(req, res){    
    const newLanding = new Landing(req.body.infoLanding)
    const confLand = req.body.configLanding
    newLanding.save().then(function(){
        console.log(newLanding)
        const landingId = newLanding._id;
        confLand = {
          "landingId" : landingId,
          confLand
        }
        const newConfLanding = new confLanding(confLand)
        console.log(newConfLanding)
        newConfLanding.save().then(function(){
          console.log("Creado landing y configuracion")
          return res.send(newLanding,newConfLanding)
        }).catch(function(error){
          console.log("Creado landing NO configuracion")
          console.log(error)
          return res.status(400).send(error)          
        })
    }).catch(function(error){
        console.log("Creado NO landing NO configuracion")
        console.log(error)
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

const irLanding = function(req, res){
  template = req.params.template
  code = req.params.code
  Landing.aggregate([
      {
          $match:{
              "ligaLanding" : code
          }
      },  
      {
          $lookup:{
              "from" : "conflanding",
              "foreignField" : "idLanding",
              "localField" : "_id",
              "as" : "confLanding"
          }
      }
      /*{
          $project:{
              "nombreLiga" : "$nombreLiga",
              "codigoLiga" : "$codigoLiga",
              "fechaCreacion" : "$fechaCreacion",
              "fechaModificacion" : "$fechaCreacion",
              "ligaOriginal" : "$ligaOriginal",
              "ligaCorta" : "$ligaCorta",
              "createdBy" : "$createdBy",
              "creator": { "$arrayElemAt": [ "$creator.nombre", 0 ] },                              
          }
      }*/
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
    irLanding : irLanding
  }