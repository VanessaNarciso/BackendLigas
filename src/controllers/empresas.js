const Empresa = require('../models/empresa')


const getComps = function(req, res) {
  Empresa.find({}).then(function(empresas) {
    res.send(empresas)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

/*const getComp = function(req, res) {
  const idC = req.body.empresa;
  Empresa.findOne({idC}).then(function(company) {      
    if( !company ) {
      res.status(404).send({ message: "Empresa no encontrada" })
    }
    res.send(company)
  }).catch( function(error) {
    res.status(500).send(error)
  })
}
*/
const getComp = function(req, res) {
  Empresa.findOne({_id : req.params.empresa}).then(function(empresaData) {
    res.send(empresaData)
  }).catch(function(error){
    res.status(500).send(error)
  })
}



const updateCompany = function(req, res) {
  const _id = req.params.empresa
  const updates = Object.keys(req.body)
  const allowedUpdates = ['nombre','razon_social', 'domicilio','numero','pais']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }
  Empresa.findByIdAndUpdate(_id, req.body ).then(function(user) {
    if (!user) {
      return res.status(404).send()
    }
    return res.send(user)
  }).catch(function(error) {
    res.status(500).send(error)
  })
}


const createComp = function(req, res){
  const empresa = new Empresa(req.body)
  empresa.save().then(function() {
    return res.send(empresa)
  }).catch(function(error) {
    return res.status(400).send(error)
  })
}


module.exports = {
  getComps : getComps,
  getComp : getComp,
  createComp : createComp,
  updateCompany: updateCompany
}