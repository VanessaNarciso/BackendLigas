const express = require('express')
const app = express()
const Handlebar = require("handlebars");
const useragent = require('express-useragent');
var path = require('path');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('/public/'));



require('./db/db.js')
var cors = require('cors');
const router = require('./routes')

const User = require('./models/user.js')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(useragent.express());

app.set('view engine','hbs');


/*app.get('/template1/',(req,res) =>{
  if(!req.query.exists){
    res.render('template1');
  }else{
    res.render('index',{titulo: req.query.titulo,imgSrc: req.query.imgUrl,footer: req.query.footer})
  }
});*/

app.use(cors())
app.use(express.json()) // parsea a json
app.use(router)

app.listen(port, function() {
  console.log('Server up and running on port', port)
})