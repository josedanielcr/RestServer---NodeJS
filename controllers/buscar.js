const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;


const { Usuario, Categoria , Producto } = require('../models');


const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]


const buscarUsuarios = async( termino = '' , res = response ) => {

    const esMondgoID = ObjectId.isValid( termino );

    if( esMondgoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results : ( usuario ) ? [ usuario ] : []
        })
    }

    //busquedas insensibles se nececita una expresion regular
    const regex = new RegExp( termino , 'i' );

    //forma con la que en mongo se hacen busquedas usando el OR
    const usuarios = await Usuario.find( {
        $or: [ { nombre : regex } , { correo : regex } ],
        $and : [ { estado : true } ]
    });


    res.json({
        results : usuarios
    });

}

const buscarCategoria = async( termino = '' , res = response ) => {

    const esMondgoID = ObjectId.isValid( termino );

    if( esMondgoID ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results : ( categoria ) ? [ categoria ] : []
        })
    }

    //busquedas insensibles se nececita una expresion regular
    const regex = new RegExp( termino , 'i' );

    //forma con la que en mongo se hacen busquedas usando el OR
    const categorias = await Categoria.find( { nombre : regex , estado : true });

    res.json({
        results : categorias
    });

}

const buscarProductos = async( termino = '' , res = response ) => {

    const esMondgoID = ObjectId.isValid( termino );

    if( esMondgoID ) {
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json({
            results : ( producto ) ? [ producto ] : []
        })
    }

    //busquedas insensibles se nececita una expresion regular
    const regex = new RegExp( termino , 'i' );

    //forma con la que en mongo se hacen busquedas usando el OR
    const productos = await Producto.find( { nombre : regex , estado : true }).populate('categoria', 'nombre');

    res.json({
        results : productos
    });

}


const buscar = ( req = request , res = response ) => {

    const { coleccion , termino } = req.params;

    //verificar cuales son las colecciones permitidas dentro de la aplicacion
    if ( !coleccionesPermitidas.includes( coleccion ) ){
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino , res );
        break;
            
        case 'categoria':
            buscarCategoria( termino , res );
        break;

        case 'productos':
            buscarProductos( termino , res ); 
        break;

        default: 
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

}





module.exports = {
    buscar
}