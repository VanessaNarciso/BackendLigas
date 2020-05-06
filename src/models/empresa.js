const validator = require('validator')
const mongoose = require('mongoose')

var secret = process.env.SECRET || require('../config.js').secret


const empresaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  razon_social: {
    type: String,
    required: true
  },
  domicilio: {
    type: String

  }, 
  numero:{
    type:String
  },
  pais:{
    type:String
  },
  fechaCreacion:{
    type:Date
  },
  fechaModificacion:{
    type:Date 
  }
})

//Relación con user
empresaSchema.virtual('user',{
  ref: 'usuario',
  localField: '_id', 
  foreignField: 'partOf'
})


//Get company by id
empresaSchema.statics.getCompany = function(id) {
  return new Promise( function(resolve, reject) {
    Empresa.findOne({id}).then(function(company) {      
      if( !company ) {
        return reject('Company does not exist')
      }
      return resolve(company)
    }).catch( function(error) {
      return reject('Error!')
    })
  })
}


const Empresa = mongoose.model('Empresa', empresaSchema)
module.exports = Empresa