const validator = require('validator')
const mongoose = require('mongoose')
const useragent = require('express-useragent');
const express = require('express')
const app = express()
const expressip = require('express-ip');
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);



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
        const ipInfo = req.ipInfo;
        const data = {
            ligaId : idLiga,
            navegador : req.useragent.browser,
            ip : req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            geolocalizacion : ipInfo.city+', '+ipInfo.country,
            fecha : new Date()
        }
        const visita = new VisitaLiga(data)
        visita.save().then(function(visita) {
        return resolve(visita)
      }).catch( function(error) {
        return reject('Error creando visita')
      })
    })
  }

const VisitaLiga = mongoose.model('VisitaLiga', visitaLigaSchema)
module.exports = VisitaLiga