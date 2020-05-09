const Liga = require('../models/ligascortas')
const VisitaLiga = require('../models/visitaLiga')


const createLiga = function(req, res){
    const newLiga = new Liga(req.body)
    newLiga.save().then(function() {
        return res.send(newLiga)
    }).catch(function(error) {
        return res.status(400).send(error)
    })
}

const getLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    console.log(req.params.empresa)
    Liga.find({empresaLiga: empresa}).then(function(misligas) {
      res.send(misligas)
    }).catch(function(error){
      res.status(404).send(error)
    })
}

const getLiga = function(req, res) {
    const idLiga = req.params.idLiga
    console.log(req.params.idLiga)
    Liga.findOne({_id: idLiga}).then(function(liga) {
      res.send(liga)
    }).catch(function(error){
      res.status(404).send(error)
    })
}
/*
const getVisitasLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    console.log(req.params.empresa)
    Liga.find({empresaLiga: empresa}).then(function(misligas) {
      var visitasTotales = 0;
      var isUpdating = true;
      for(var j=0; j<misligas.length; j++){
        const liga = misligas[j]._id;
        VisitaLiga.countDocuments({ligaId: liga}).then(function(num) {
            visitasTotales = visitasTotales+1;
        }).catch(function(error){
            res.status(404).send(error)
        })
        if(j == misligas.length-1){
            isUpdating = false;
        }
      }
      if(!isUpdating){
        res.send({'visitasTotales' : visitasTotales})
      }      
    }).catch(function(error){
      res.status(404).send(error)
    })
}
const getVisitasLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    Liga.ligasEmpresa(empresa).then(function(ligas){
        VisitaLiga.cuentaTotalLigas(ligas).then(function(total){
            return res.send(total)
        }).catch(function(error){
            return res.status(401).send({ error: error, msg:'No se pudo obtener esa liga'  })
        })
    }).catch(function(error){
        return res.status(401).send({ error: error, msg:'No se pudo obtener esa liga'  })
    })
}
*/

const getVisitasLigasEmpresa = function(req, res) {
    const empresa = req.params.empresa
    console.log("Empresa a buscar:")
    console.log(empresa)
    Liga.aggregate([
        {
            $match: {
                empresaLiga : empresa
            }
        },
        {
            $group:{
                _id : empresa,
                "LigasEmpresa" : {
                    "$sum" : 1
                }
            }
        }
    ], (aggregateError, aggregateResult)=>{
        if(!aggregateError){
            console.log("Resultado aggregate:")
            console.log(aggregateResult)
            return res.send(aggregateResult)
        }
        else
            return res.status(404).send(aggregateError)        
    })
}

const irLiga = function(req, res){
    //Necesitamos enviar el req y el id de la liga que estamos checando
    const ligaa = req.params.liga;
    console.log("Ir a: ",ligaa);
    Liga.getLiga(ligaa).then(function(liga){
        VisitaLiga.registerVisit(req, liga._id).then(function(company){
            return res.redirect(liga.ligaOriginal)
        }).catch(function(error) {
            return res.status(401).send({ error: error, msg:'No se pudo registrar visita' })
        })        
    }).catch(function(error) {
        return res.status(401).send({ error: error, msg:'No se pudo obtener esa liga'  })
    })
}

  module.exports = {
    createLiga : createLiga,
    irLiga : irLiga,
    getLigasEmpresa : getLigasEmpresa,
    getVisitasLigasEmpresa : getVisitasLigasEmpresa,
    getLiga : getLiga
  }