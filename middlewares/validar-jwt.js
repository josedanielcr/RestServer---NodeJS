const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');



const validarJWT = async( req = request , res = response , next )  => {

    const token = req.header('x-token');


    //verifica que si venga el jwt en los headers de la peticion
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );
        const usuarioAutenticado = await Usuario.findById( uid );

        //si el usuario no exite entonces hago esto
        if ( !usuarioAutenticado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            })
        }

        req.usuario = usuarioAutenticado;

        // verificar si el usuario autenticado esta activo
        if( !usuarioAutenticado.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario = estado : false'
            })
        }


        next();

    } catch ( error ) {
        console.log( error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}


module.exports = {
    validarJWT
}