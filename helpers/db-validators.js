const Role = require('../models/rol');
const Usuario = require('../models/usuario');

//verificar si el rol es valido
const esRoleValido = async( rol = '' ) => {
    const exiteRol = await Role.findOne({ rol });
    if ( !exiteRol ){
        throw new Error(`El rol ${ rol } no existe en la DB`);
    }
}

//verificar si el correo ya existe
const emailExiste = async(  correo = '' ) => {
    const emailResponse = await Usuario.findOne( { correo } );
    if( emailResponse  ){
        throw new Error(`El correo ${correo} ya se encuentra registrado en la DB`);
    }
}


const exiteUsuarioPorId = async(  id = '' ) => {
    const usuarioExiste = await Usuario.findById( id );
    if( !usuarioExiste  ){
        throw new Error(`El usuario con el id ${ id } no se encuentra registrado en la DB`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    exiteUsuarioPorId
}