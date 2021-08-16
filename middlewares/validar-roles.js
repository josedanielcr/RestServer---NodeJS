const { request, response } = require("express")



const esAdminRol = ( req = request , res = response , next ) => {

    //en caso de que no se haya validado el token e intente sacar el rol
    if ( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { rol , nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre } no es administrador - imposible realizar acción`
        })
    }

    next();

}

const tieneRole = ( ...roles ) => {
    return ( req = request , res = response , next ) => {

        //en caso de que no se haya validado el token e intente sacar el rol
        if ( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        //verifico que la persona tenga un rol permitido
        if ( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                msg: `${req.usuario.nombre } no posee uno de los siguientes roles: ${ roles } - imposible realizar acción`
            })
        }

        next();
    }
}



module.exports = {
    esAdminRol,
    tieneRole
}