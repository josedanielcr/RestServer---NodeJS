const { request, response } = require("express");


const validarArchivo = ( req = request , res = response , next) => {

    //verifico que venga aunque sea un archivo a la peticion
    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();
}



module.exports = {
    validarArchivo
}