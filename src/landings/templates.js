const express = require('express');
const app = express()

app.set('view engine', 'hbs');
app.use(express.static(__assets+'/img'));

app.get('/', (req, res) => {
    res.render('template-1', {titulo: 'Empresa', descripcion: 'Lorem ipsum dolor', footer: 'Lorem ipsum dolo', imagen: 'assets/img/temp1.jpg'})
});

app.listen(300, () =>{

});