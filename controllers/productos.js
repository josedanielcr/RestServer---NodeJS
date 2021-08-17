const { request, response } = require("express");
const { Producto, Categoria } = require("../models");




//obtener productos
const obtenerProductos = async( req = request , res = response ) => {

    //saco los parametros del query del request
    const { limite = 5 , desde = 0 } = req.query;
    const query = { estado : true };

    //hago hago la peticion
    const [ total , productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
                .limit( Number( limite ) )
                .skip( Number( desde ) )
                .populate('usuario','nombre')
                .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

//obtener productos por id
const obtenerProducto = async( req = request , res = response ) => {

    const { id }  = req.params;

    const producto = await Producto.findById( id ).populate('usuario','nombre').populate('categoria', 'nombre');
    
    res.status(200).json({
        producto
    });

}

//crear un producto
const crearProducto = async( req = request , res = response ) => {

    const { estado , usuario , ...dataBody } = req.body;
    const nombre = dataBody.nombre;

    //revisar si existe una categoria igual registrada
    const productoDB = await Producto.findOne( { nombre } );

    if ( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        ...dataBody,
        nombre : dataBody.nombre.toUpperCase(),
        usuario : req.usuario._id
    }

    const producto = await new Producto( data );
    
    //guardar la categoria en la base de datos
    await producto.save();

    res.status(401).json( producto );
}


const actualizarProducto = async( req = request , res = response ) => {

    //obtener valores del body
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    //actualizo la categoria
    const productoModificado = await Producto.findOneAndUpdate( id , data, { new : true } );

    res.json({
        productoModificado
    })

}


const borrarProducto = async( req = request , res = response ) => {
    const { id } = req.params;

    //cambiar el estado del usuario (recomendado)
    const producto = await Producto.findByIdAndUpdate( id, { estado : false } , { new : true } );

    res.json( producto );
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}