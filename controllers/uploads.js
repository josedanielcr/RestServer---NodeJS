
const { request, response } = require("express");

const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo }      = require("../helpers/");
const { Usuario , Producto } = require('../models');



const cargarArchivo = async( req = request , res = response ) => {

    try {
        //no se mandan las extensiones y carpeta porque el archivo helper esta usando las que estan por defecto
        const nombre = await subirArchivo( req.files , undefined , 'imgs' );

        //para mandar de archivos de otro tipo de extension ejemplo txt , md
        //const nombre = await subirArchivo( req.files , [ 'txt','md' ] , 'textos' );
        res.json({ nombre });
    } catch (error) {
        res.status(400).json({
            msg : error
        })
    }

}

//para archivos dentro del servidor en la seccion de uploads
const modificarImagen = async( req = request , res = response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg : 'Se me olvido validar esto'
            })
    }

    //hacer limpieza de la imagen previa
    if ( modelo.imagen ){
        //borrar la imagen del servidor
        const pathImagen = path.join( __dirname , '../uploads', coleccion , modelo.imagen );
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen );
        }
    }

    const nombreArchivo = await subirArchivo( req.files , undefined , coleccion );
    modelo.imagen = nombreArchivo;

    await modelo.save();

    res.json( modelo );

}

//manera desde cloudinary ( la que se va a usar )
const modificarImagenCloudinary = async( req = request , res = response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg : 'Se me olvido validar esto'
            })
    }


    //hacer limpieza de la imagen previa
    if ( modelo.imagen ){
       const nombreArr     = modelo.imagen.split('/');
       const nombre        =  nombreArr[ nombreArr.length - 1 ];
       const [ public_id ] =  nombre.split('.');
       cloudinary.uploader.destroy( public_id );
    }

    //cloudinary
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(  tempFilePath );

    modelo.imagen = secure_url;

    await modelo.save();

    res.json( modelo );

}




const mostrarImagen = async( req = request , res = response ) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg : 'Se me olvido validar esto'
            })
    }

    if( modelo.imagen ){
        const pathImagen = path.join( __dirname , '../uploads', coleccion , modelo.imagen );
        if( fs.existsSync( pathImagen ) ){
           return res.sendFile( pathImagen );
        }
    }

    const pathImagen = path.join( __dirname , '../assets','no-image.jpg');
    res.sendFile( pathImagen );

}


module.exports = {
    cargarArchivo,
    modificarImagen,
    mostrarImagen,
    modificarImagenCloudinary
}