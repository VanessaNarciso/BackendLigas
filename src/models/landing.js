const mongoose = require('mongoose')
const validator = require('validator')

const landingSchema = new mongoose.Schema({
	nombreLanding:{
		type: String
	}, 
	ligaLanding:{
		type: String,
		required: true,
		unique: true,
	},
	fechaCreacion:{
   		 type:Date
    },
    fechaModificacion:{
    	type:Date 
    },
    empresaLanding:{
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

//Relación con visitaLanding
ligasSchema.virtual('visitaLanding',{
	ref: 'visitalanding',
	localField: '_id', 
	foreignField: 'landingId'
})

//Relación con confLanding
ligasSchema.virtual('confLanding',{
	ref: 'conflanding',
	localField: '_id', 
	foreignField: 'landingId'
})

const Landings = mongoose.model('Landings', landingSchema)
module.exports = Landings
