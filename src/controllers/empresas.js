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


/*const getComp = function(req, res) {
  console.log(req.body)
  Empresa.getCompany(req.body.id).then(function(company){
    return res.send(company)
  }).catch(function(error) {
    return res.status(401).send({ error: error })
  })
}*/


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