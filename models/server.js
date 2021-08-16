const express = require('express');
var cors = require('cors');

const {
    dbConnection
} = require('../database/config');

class Server {


    constructor() {
        this.app          = express();
        this.port         = process.env.PORT;
        
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

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

    }


    routes(){

        //path para usuarios
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));

    }


    listen(){
        this.app.listen( this.port , () => {
            console.log( 'sevidor corriendo en el puerto ', this.port );
        });
    }

}


module.exports = Server;