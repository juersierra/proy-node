
const express = require('express');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 8080;
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer');


//Conectamos la app a una Base de Datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
});

//Conectamos la DB
const conectar = (conexion.connect((error) => {
        if (error) throw error;
        console.log('Base de Datos Conectada!!');
    })
); 

// Configuración de Middelwares
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({extended: false}));

//Configuramos la Vista de la Aplicación
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

/* app.get('/', (req, res) =>{
    res.send('Nos estamos conectando a una Base de Datos')
}); */


app.get('/', (req, res) =>{
    res.render('index', {
        titulo: 'Bienvenido a Nuestra app'
    })
});

app.get('/formulario', (req, res) =>{
    res.render('formulario', {titulo: 'Formulario para Completar'})
});

//verbo http para recibir datos
app.post('/formulario', (req, res) =>{
    //console.log(req.body);
    //Desestructuración
    const { nombre, precio, descripcion } = req.body;

    console.log(nombre);
    console.log(precio);
    console.log(descripcion);

    //Validación básica
    if(nombre == "" || precio == ""){
        let validacion = 'Faltan datos para ingresar el Producto'
        res.render('formulario', {
            titulo: 'Formulario para Completar',
            validacion
        })
    }else{
        console.log(nombre);
        console.log(precio);
        console.log(descripcion);

        //conectar();

        let data = {
            producto_nombre: nombre,
            producto_precio: precio,
            producto_descripcion: descripcion
        }

        let sql = "INSERT INTO PRODUCTOS SET ?"; 

        let query = conexion.query(sql, data, (err, results) =>{
            if (err) throw err;
            res.render('formulario', {titulo: 'Formulario para Completar'})
        });
        
    }
});


app.get('/productos', (req, res) =>{
    let sql = "SELECT * FROM PRODUCTOS";
    let query = conexion.query(sql, (err, results) =>{
        //console.log(results);
        if (err) throw err;
        res.render('productos', {
            titulo: 'Lista de Productos',
            results
        })
    });   
});

//Update
app.post('/update', (req, res) =>{

    console.log(req.body.producto_nombre);
    console.log(req.body.producto_precio);
    console.log(req.body.id);

    //res.send('Actualizamos los datos')
    //No olvidar el cambio del nombre de las variables -  formulario
let sql = "UPDATE PRODUCTOS SET producto_nombre='" + req.body.producto_nombre + 
    "', producto_precio='" + req.body.producto_precio + "' WHERE producto_id=" + 
    req.body.id;
    let query = conexion.query(sql, (err, results) =>{
        //console.log(results);
        if (err) throw err;
        res.redirect('productos')
    }); 
});

app.post('/delete', (req, res) =>{

    console.log(req.body.producto_id);

    //res.send('Eliminamos los datos')

    let sql = "DELETE FROM PRODUCTOS WHERE producto_id=" + req.body.producto_id;

    let query = conexion.query(sql, (err, results) =>{
        //console.log(results);
        if (err) throw err;
        res.redirect('productos')
    });

});


app.post('/login', (req, res) =>{
    console.log(req.body);
    const { usuario, password } = req.body;
    console.log(usuario);
    console.log(password);
    res.send('Tus datos son correctos')
})

app.get('/login', (req, res) =>{
    res.render('login', {titulo: 'Ingresa tus datos para el Login'})
})


app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Escríbenos'})
});


app.listen(Port, ()=>{
    console.log(`Servidor corriendo en el Puerto ${Port}`);
});

app.on('error', (error) =>{
    console.log(`Tenemos un error ${error}`);
});







