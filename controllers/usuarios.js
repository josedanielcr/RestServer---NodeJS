const { response } = require('express');

const usuariosGet = ( req = request, res = response ) => {

    const { apikey , nombre  = 'no name', page = 1 , limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        apikey,
        nombre,
        page,
        limit
    });
}


const usuariosPost = (req, res = response ) => {

    const { nombre, edad} = req.body;

    res.json({
        msg: 'post API  - controlador',
        nombre,
        edad
    });
};


const usuariosPut = (req, res = response ) => {

    const { id } = req.params;

    res.json({
        msg: 'put API  - controlador',
        id
    });
}


const usuariosPatch = (req, res = response ) => {
    res.json({
        msg: 'patch API  - controlador'
    });
}


const usuariosDelete = (req, res = response ) => {
    res.json({
        msg: 'delete API  - controlador'
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}