const validator = require('validator')
const mongoose = require('mongoose')
const useragent = require('express-useragent');
const express = require('express')
const app = express()
app.use(useragent.express());
var request = require('request');
var rp = require('request-promise');



var secret = process.env.SECRET || require('../config.js').secret


const visitaLigaSchema = mongoose.Schema({
  ligaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Ligas'
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
  fecha:{
    type:Date
  }
})

visitaLigaSchema.statics.registerVisit = function(req,idLiga) {
    return new Promise( function(resolve, reject) {
        //Necesitamos el id de la liga que estamos visitando, que llega en idLiga
        //Obtener los datos del req y guardar en VisitaLiga
        const ipReq = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var geo;
        rp('https://freegeoip.app/json/'+ipReq)
          .then (function (body){
            console.log(body);
            geo = body.country_name;
            console.log("Pais es :");
            console.log(geo);
            const data = {
                ligaId : idLiga,
                navegador : req.useragent.browser,
                ip : ipReq,
                geolocalizacion : geo,
                fecha : new Date()
            }
            const visita = new VisitaLiga(data)
            visita.save().then(function(visita) {
              return resolve(visita)
            }).catch( function(error) {
              return reject('Error creando visita')
            })        
          })
          .catch(function (err){
            console.log("No pude encontrar pais")
            const data = {
              ligaId : idLiga,
              navegador : req.useragent.browser,
              ip : ipReq,
              geolocalizacion : 'undefined',
              fecha : new Date()
            }
            const visita = new VisitaLiga(data)
            visita.save().then(function(visita) {
              return resolve(visita)
            }).catch( function(error) {
              return reject('Error creando visita')
            }) 
          });        
    })
  }

const VisitaLiga = mongoose.model('VisitaLiga', visitaLigaSchema)
module.exports = VisitaLiga