const { response, request } = require("express");
const bcryp = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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


const googleSignIn = async( req = request , res = response ) => {
    
    const { id_token } = req.body;
    try {

        const { correo , nombre , img } = await googleVerify( id_token );

        //busco un usuario para ver si existe uno con el mismo correo
        let usuario = await Usuario.findOne( { correo } );

        //si no existe entonces creo uno
        if ( !usuario ){
            //hay que crear uno
            const data = {
                nombre,
                correo,
                password : ':D',
                imagen : img,
                google: true
            }
            usuario = new Usuario( data );
            await usuario.save();
        }

        //si el usuario en DB tiene estado : false
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
   
}




module.exports = {
    login,
    googleSignIn
}