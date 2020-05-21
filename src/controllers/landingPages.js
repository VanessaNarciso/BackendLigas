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
          res.render(
            template,
            {
              titulo : aggregateResult.titulo,
              texto : aggregateResult.texto,
              footer : aggregateResult.footer,
              img : aggregateResult.imagen
            }
          )
      }
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