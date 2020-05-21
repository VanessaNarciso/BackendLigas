const validator = require('validator')
const mongoose = require('mongoose')
const useragent = require('express-useragent');
const express = require('express')
const app = express()
app.use(useragent.express());
var request = require('request');
var rp = require('request-promise');



var secret = process.env.SECRET || require('../config.js').secret


const visitaLandingSchema = mongoose.Schema({
  landingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Landings'
  },
  navegador: {
    type: String,
    required: true
  },
  ip: {
    type: String
  },
  geolocalizacion:{
    type:String
  },
  tiempoEnPag:{
    type:Number
  },
  fecha:{
    type:Date
  }
})

visitaLandingSchema.statics.registerVisit = function(req,idLanding) {
  return new Promise( function(resolve, reject) {
      //Necesitamos el id de la landing que estamos visitando, que llega en idLanding
      //Obtener los datos del req y guardar en VisitaLanding
      const ipReq = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      rp('https://freegeoip.app/json/'+ipReq)
        .then (function (body){
          console.log(body);
          body=JSON.parse(body);
          console.log("Pais es :");
          console.log(body.country_name);
          const data = {
              ligaId : idLanding,
              navegador : req.useragent.browser,
              ip : ipReq,
              geolocalizacion : body.country_name,
              fecha : new Date(),
              tiempoEnPag : 0
          }
          console.log(data);
          const visita = new VisitaLanding(data)
          visita.save().then(function(visita) {
            return resolve(visita)
          }).catch( function(error) {
            return reject('Error creando visita')
          })        
        })
        .catch(function (err){
          console.log("No pude encontrar pais")
          const data = {
            landingId : idLanding,
            navegador : req.useragent.browser,
            ip : ipReq,
            geolocalizacion : 'undefined',
            fecha : new Date(),
            tiempoEnPag : 0
          }
          const visita = new VisitaLanding(data)
          visita.save().then(function(visita) {
            return resolve(visita)
          }).catch( function(error) {
            return reject('Error creando visita')
          }) 
        });        
  })
}

const VisitaLanding = mongoose.model('VisitaLanding', visitaLandingSchema)
module.exports = VisitaLanding