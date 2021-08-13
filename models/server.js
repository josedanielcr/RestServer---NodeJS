const express = require('express');
var cors = require('cors');

class Server {


    constructor() {
        this.app = express()
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //middlewares : funciones que siempre se ejecutan cuando levantamos nuestro servidor
        this.middlewares();

        //rotas de mi aplicacion
        this.routes();
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
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));

    }


    listen(){
        this.app.listen( this.port , () => {
            console.log( 'sevidor corriendo en el puerto ', this.port );
        });
    }

}


module.exports = Server;