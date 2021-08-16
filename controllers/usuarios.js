const { response } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const usuariosGet = async( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true }

    //.all ejecuta las dos al mismo tiempo tiempo, si una da error significa que las dos van a dar error
    const [ total , usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .limit( Number( limite ) )
            .skip( Number( desde ) )
    ]);

    res.json({
       total,
       usuarios
    });
}


const usuariosPost = async(req, res = response ) => {

    //hago la desestructuracion de lo que necesito del body y lo parseo al objeto de Usuario
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //encriptar la contrasenha
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password , salt );

    //guardar en la DB
    await usuario.save();

    res.json({
        msg: 'post API  - controlador',
        usuario
    });
};


const usuariosPut = async(req, res = response ) => {

    const { id } = req.params;
    const { _id ,password, google, correos,...resto } = req.body;

    //TODO: validar contra base de datos
    if ( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password , salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}


const usuariosDelete = async(req, res = response ) => {

    const { id } = req.params;

    //cambiar el estado del usuario (recomendado)
    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false } );


    res.json( usuario );
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}