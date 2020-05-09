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
        rp('https://freegeoip.app/json/'+ipReq)
          .then (function (body){
            console.log(body);
            body=JSON.parse(body);
            console.log("Pais es :");
            console.log(body.country_name);
            const data = {
                ligaId : idLiga,
                navegador : req.useragent.browser,
                ip : ipReq,
                geolocalizacion : body.country_name,
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

visitaLigaSchema.statics.visitasLiga = function(idLiga){
	console.log("Cuento visitas de : ",idLiga);
	  return new Promise( function(resolve, reject) {
      VisitaLiga.countDocuments({ligaId: liga}).then(function(num) {		  	 
		    return resolve({'visitas' : num})
		  }).catch( function(error) {
		    return reject(error)
		  })
	  })
}

visitaLigaSchema.statics.cuentaTotalLigas = function(ligas){
	console.log("Sumo visitas de : ",ligas);
	  return new Promise( function(resolve, reject) {
      var total = 0;
      console.log("tengo que sumar total ligas : "+ligas.length)
      for(var i=0; i<ligas.length; i++){      
        console.log("Sumo las ligas paso "+i+" de "+ligas.length)
        VisitaLiga.countDocuments({ligaId: ligas[i]._id}).then(function(num) {		 
          console.log("Esta liga tiene un total de visitas de:")
          console.log(num)
          total = total+num
        }).catch( function(error) {
          return reject(error)
        })
      }
      console.log("Total visitas : ")
      console.log(total)
      return resolve({'totalVisitas':total})
	  })
}

const VisitaLiga = mongoose.model('VisitaLiga', visitaLigaSchema)
module.exports = VisitaLiga