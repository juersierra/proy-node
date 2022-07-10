const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer');

//Conectamos la app a una Base de Datos.
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
})

const conectar = (
    conexion.connect((error) =>{
        if(error) throw error;
        console.log('base de datos conectada');
    })
);


//configuramos la vista de la aplicacion
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//Configuracion de middlewares (funcion que )
app.use(express.json()); //ahora entendes jason
app.use(express.static(path.join(__dirname, "/public"))); //cualquier archivo publico va aca
app.use(express.urlencoded({extended: false}));

console.log(__dirname);

// app.get('/', (req, res) =>{
//     res.send('nos estamos conectando a una base de datos');
// })

app.get('/', (req, res)=>{
    res.render('index', {titulo: 'GUILLES WEB'})
})
app.get('/statement', (req, res)=>{
    res.render('statement', {titulo: 'STATEMENT'})
})
app.get('/galerias', (req, res)=>{
    let sql = "SELECT * FROM MENSAJES";
    let query = conexion.query(sql, (err, results) => {
        console.log(results);
        if(err) throw err;
        res.render('galerias', {
            titulo: 'GALERIAS',
            results,
        }) 
    })
})

app.post('/update', (req, res) =>{
    console.log(req.body.idmensajes);
    console.log(req.body.asunto);
    console.log(req.body.mensaje);
    
    let sql = "UPDATE MENSAJES SET asunto='" + req.body.asunto + "', mensaje= '" + req.body.mensaje + "' WHERE idmensajes=" + req.body.idmensajes;
    let query = conexion.query(sql, (err, results) => {
        console.log(results);
        if(err) throw err;
        res.redirect('/')
    })
})
app.post('/delete', (req, res) =>{
    console.log(req.body.idmensajes);
    
    let sql = "DELETE FROM MENSAJES WHERE idmensajes= '" + req.body.idmensajes + "'";
    let query = conexion.query(sql, (err, results) => {
        console.log(results);
        if(err) throw err;
        res.redirect('/')
    })
})

// app.post('/mail', (req, res =>){

//     const {usuario, email} = req.body;
//     console.log(usuario);
//     console.log(email);

//     if(usuario == ""||email == ""){
//         let validacion = "Faltan datos";
//         res.render('mail', {
//             titulo: 'envia un mail',
//             validacion
//         })
//     }else{
//         console.log(usuario);
//         console.log(email);

//         async function main(){
//             let transporter = nodemailer.createTransport({
//                 host: 'smtp.gmail.com',
//                 port: '465',
//                 secure: 'true',
//                 auth:{
//                     user: 'juersierra@gmail.com',
//                     password: 'cnktbshzdllmrtif',
//                 }
//             })

//             let info = await transporter.sendMail({
//                 from: 'juersierra@gmail.com',
//             })
//         }
//         res.render('index',{
//             titulo:'bienvenido a nuestra app',
//             to: `${email}`,
//             subject: 'Gracias por tu compra',
//             html: `Gracias por confiar en nosotros para la compra de un lavarropas`,
//         })
//     }
    
    
// })

app.get('/contacto', (req, res)=>{
    res.render('contacto', {titulo: 'CONTACTANOS'})
})
//verbo http para recibir datos
app.post('/contacto', (req, res) =>{
    // res.send('Tus datos han sido recibidos')
    // console.log(req.body.nombre);
    // console.log(req.body.email);
    // console.log(req.body.asunto);    
    // console.log(req.body.mensaje);
    const {nombre, asunto, email, mensaje} = req.body;
    if (req.body.nombre == "" || req.body.email == ""){
        let validacion = "Faltan datos"
        res.render('contacto', {
            titulo: 'CONTACTANOS',
            validacion
        })
    }
    else {
        let validacion = "Mensaje enviado"
        let data = {
            nombre: nombre,
            email: email,
            asunto: asunto,
            mensaje: mensaje,
        }
        let sql = "INSERT INTO MENSAJES SET ?";
        let query = conexion.query(sql, data, (err, results) => {
            if(err) throw err;
            res.render('contacto', {
                titulo: 'CONTACTANOS',
                validacion
            }) 
        })
        
    }
})

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

app.on('error', (error) =>{
    console.log(`tenemos un error`);
})
 