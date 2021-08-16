const { response } = require("express");
const bcryp = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async( req , res = response ) => {

    const { correo , password } = req.body;

    //verificar si el email existe
    const usuario = await Usuario.findOne( { correo } );
    if ( !usuario ) {
        return res.status(400).json({
            msg: 'usuario/password no son correctos'
        });
    } 

    //verificar si el usuario esta activo
    if ( !usuario.estado ) {
        return res.status(400).json({
            msg: 'usuario/password no son correctos - estado : false'
        });
    } 

    //verificar la contrasenha
    const validPassword = bcryp.compareSync( password , usuario.password );
    if( !validPassword ) {
        return res.status(400).json({
            msg: 'usuario/password no son correctos - password'
        });
    }


    //generar el JWT
    const token = await generarJWT( usuario.id );

    try {

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            msg: 'Hable con la persona administradora'
        })
    }
}




module.exports = {
    login
}