const { request, response } = require("express");
const { Categoria } = require( '../models/' );


//obtener todas las categorias
const obtenerCategorias = async( req = request , res = response ) => {

    //saco los parametros del query del request
    const { limite = 5 , desde = 0 } = req.query;
    const query = { estado : true };

    //hago hago la peticion
    const [ total , categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
                .limit( Number( limite ) )
                .skip( Number( desde ) )
                .populate('usuario','nombre')
    ]);

    res.json({
        total,
        categorias
    });
}


const obtenerCategoria = async( req = request , res = response ) => {

    const { id }  = req.params;

    const categoria = await Categoria.findById( id ).populate('usuario','nombre');
    
    res.status(200).json({
        categoria
    });

}


const crearCategoria = async( req = request , res = response ) => {

    const nombre = req.body.nombre.toUpperCase();
    
    //revisar si existe una categoria igual registrada
    const categoriaDB = await Categoria.findOne( { nombre } );

    if ( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario : req.usuario._id
    }

    const categoria = await new Categoria( data );
    
    //guardar la categoria en la base de datos
    await categoria.save();

    res.status(401).json( categoria );
}


const actualizarCategoria = async( req = request , res = response ) => {

    //obtener valores del body
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = req.body.nombre.toUpperCase();

    //modifico el usuario para saber quien fue la ultima person que lo modifico
    data.usuario = req.usuario._id;

    //actualizo la categoria
    const categoriaModificada = await Categoria.findOneAndUpdate( id , data, { new : true } );

    res.json({
        categoriaModificada
    })

}

const borrarCategoria = async( req = request , res = response ) => {
    const { id } = req.params;

    //cambiar el estado del usuario (recomendado)
    const categoria = await Categoria.findByIdAndUpdate( id, { estado : false } , { new : true } );

    res.json( categoria );
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}