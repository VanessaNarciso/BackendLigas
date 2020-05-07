const mongoose = require('mongoose')
const validator = require('validator')

const ligasSchema = new mongoose.Schema({
	nombreLiga:{
		type: String
	}, 
	codigoLiga:{
		type: String,
		required: true
	}, 
	ligaCorta :{
		type: String,
		required: true,
		unique: true,
	},
	ligaOriginal:{
		type: String,
		required: true
	},
	fechaCreacion:{
   		 type:Date
  },
  fechaModificacion:{
    	type:Date 
  },
  empresaLiga:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Empresa'
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}) 

ligasSchema.statics.getLiga = function(codeLiga) {
	console.log("Busco a : ",codeLiga)
	return new Promise( function(resolve, reject) {
	  Ligas.findOne({codigoLiga:codeLiga}).then(function(liga) {      
		if( !liga ) {
		  return reject('Url does not exist')
		}
		return resolve(liga.ligaOriginal)
	  }).catch( function(error) {
		return reject('Error!')
	  })
	})
  }

const Ligas = mongoose.model('Ligas', ligasSchema)
module.exports = Ligas
