const validator = require('validator')
const mongoose = require('mongoose')

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


//Register Company
empresaSchema.statics.registerCompany = function(company) {
  return new Promise( function(resolve, reject) {
    Empresa.create(company).then(function(company) {      
      return company      
    }).catch(error =>{
      throw Error(error);
    });
  })
}


const Empresa = mongoose.model('Empresa', empresaSchema)
module.exports = Empresa