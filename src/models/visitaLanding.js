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

const VisitaLanding = mongoose.model('VisitaLanding', visitaLandingSchema)
module.exports = VisitaLanding