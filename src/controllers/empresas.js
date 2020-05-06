const Empresa = require('../models/empresa')


const getComps = function(req, res) {
  Empresa.find({}).then(function(empresas) {
    res.send(empresas)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const getComp = function(req, res) {
  const _id = req.body.id;
  Empresa.findOne({_id}).then(function(company) {      
    if( !company ) {
      res.status(404).send(error)
    }
    res.send(company)
  }).catch( function(error) {
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
}