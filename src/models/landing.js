const mongoose = require('mongoose')
const validator = require('validator')

const landingSchema = new mongoose.Schema({
	nombreLanding:{
		type: String
	},
	descripcionLanding:{
		type: String
	},
	templateChoice:{
		type: String
	},
	ligaLanding:{
		type: String,
		required: true,
		unique: true,
	},
	codeLanding:{
		type: String,
		required: true,
		unique: true,
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
	},
	fechaCreacion:{
		type:Date
	}
})

//Relación con visitaLanding
landingSchema.virtual('visitaLanding',{
	ref: 'visitalanding',
	localField: '_id', 
	foreignField: 'landingId'
})

//Relación con confLanding
landingSchema.virtual('confLanding',{
	ref: 'conflanding',
	localField: '_id', 
	foreignField: 'landingId'
})

const Landings = mongoose.model('Landings', landingSchema)
module.exports = Landings
