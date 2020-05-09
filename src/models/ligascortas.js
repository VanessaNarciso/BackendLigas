const mongoose = require('mongoose')
const validator = require('validator')

const ligasSchema = new mongoose.Schema({
	nombreLiga:{
		type: String
	}, 
	codigoLiga:{
		type: String,
		required: true,
		unique: true,
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

//Relación con visitaLiga
ligasSchema.virtual('visitasLigas',{
	ref: 'visitaLiga',
	localField: '_id', 
	foreignField: 'ligaId'
  })

ligasSchema.statics.getLiga = function(codeLiga) {
	console.log("Busco a : ",codeLiga);
	return new Promise( function(resolve, reject) {
	  Ligas.findOne({codigoLiga:codeLiga}).then(function(liga) {      
		if( !liga ) {
		  return reject('Url does not exist')
		}
		console.log("Mandaré a :",liga.ligaOriginal)
		return resolve(liga)
	  }).catch( function(error) {
		return reject('Error!')
	  })
	})
}

ligasSchema.statics.ligasEmpresa = function(idEmpresa){
	console.log("Busco ligas de : ",idEmpresa);
	return new Promise( function(resolve, reject) {
		Ligas.find({empresaLiga:idEmpresa}).then(function(ligas) {		  	 
			return resolve(ligas)
		}).catch( function(error) {
			return reject('Error!')
		})
	})
}

const Ligas = mongoose.model('Ligas', ligasSchema)
module.exports = Ligas
