const mongoose = require('mongoose')
const validator = require('validator')

const confLandingSchema = new mongoose.Schema({
	landingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Landings'
    }, 
	titulo:{
		type: String,
		required: true		
	},
	texto:{
        type: String,
		required: true
    },
    footer:{
        type: String		
    },
    imagen:{
        type: String
    }
}) 

const ConfLandings = mongoose.model('confLandings', confLandingSchema)
module.exports = ConfLandings
