const express = require ('express')
const router = express.Router()

const users = require('./controllers/users.js')
const empresas = require('./controllers/empresas.js')
const ligas = require('./controllers/ligasCortas.js')
const visitasLigas = require('./controllers/visitasLigas.js')
const auth = require('./middleware/auth')


//Rutas para acceder a API 
//router.get('/users', auth, users.getUser) //Show all 
router.post('/login', users.login) //Login
router.post('/logout', auth, users.logout) //Close token
router.post('/users', users.createUser)  // signup
router.patch('/users', auth, users.updateUser) //update user
router.delete('/users', auth, users.deleteUser) //Delete user 

router.get('/getCompanies', empresas.getComps)
router.get('/getCompany', empresas.getComp)
router.post('/createCompany', empresas.createComp)

router.get('/ligas/:empresa', ligas.getLigasEmpresa)
router.get('/ligasVisitas/:empresa', ligas.getVisitasLigasEmpresa)
router.get('/liga/:liga', ligas.irLiga)
router.get('/getLiga/:idLiga', ligas.getLiga)
router.post('/createLiga', ligas.createLiga)

router.get('/visitas/:liga', visitasLigas.getVisitasLiga)
router.get('/numvisitas/:liga', visitasLigas.getContadorLiga)
//
/*
router.get('/todos/:id', auth, todos.getTodo)
router.get('/todos', auth, todos.getTodos)
router.post('/todos', auth, todos.createTodo)
router.patch('/todos/:id', auth, todos.updateTodo)
router.delete('/todos/:id', auth, todos.deleteTodo)*/

router.get('*', function(req, res) {
  res.send({
    error: 'Server Running /users /Login'
  })
})

module.exports = router