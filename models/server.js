const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');

const {
    dbConnection
} = require('../database/config');

class Server {


    constructor() {
        this.app            = express();
        this.port           = process.env.PORT;

        //rutas
        this.rutas          = {
            auth       : '/api/auth',
            buscar     : '/api/buscar',
            categorias : '/api/categorias',
            usuarios   : '/api/usuarios',
            uploads    : '/api/uploads',
            productos  : '/api/productos',
        }

        // conectar a la base de datos
        this.conectarDB();

        //middlewares : funciones que siempre se ejecutan cuando levantamos nuestro servidor o controlador, etc...
        this.middlewares();

        //rotas de mi aplicacion
        this.routes();
    }


    async conectarDB(){
        //leer del .env si estoy en produccion para saber cual base de datos usar
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //lectura y parseo del body
        this.app.use( express.json() );

        //directorio public
        this.app.use( express.static( 'public' ) );

        //FileUpload
        this.app.use(fileUpload( { 
            useTempFiles     : true, 
            tempFileDir      : '/tmp/',
            createParentPath : true } ) );
    }


    routes(){

        //paths
        this.app.use(this.rutas.auth, require('../routes/auth.routes'));
        this.app.use(this.rutas.usuarios, require('../routes/usuarios.routes'));
        this.app.use(this.rutas.categorias, require('../routes/categorias.routes'));
        this.app.use(this.rutas.productos , require('../routes/productos.routes'));
        this.app.use(this.rutas.buscar , require('../routes/buscar.routes'));
        this.app.use(this.rutas.uploads , require('../routes/uploads.routes'));
    }


    listen(){
        this.app.listen( this.port , () => {
            console.log( 'sevidor corriendo en el puerto ', this.port );
        });
    }

}


module.exports = Server;