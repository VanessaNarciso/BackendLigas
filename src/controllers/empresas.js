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
      return reject('Company does not exist')
    }
    return resolve(company)
  }).catch( function(error) {
    return reject('Wrong password!')
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