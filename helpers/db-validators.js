const {Usuario, Role , Categoria, Producto } = require('../models/');

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

const existeCategoria = async( id = '' ) => {
    const categoria = await Categoria.findById( id );
    if( !categoria ){
        throw new Error(`La categoría con el id ${ id } no existe dentro de la DB `);
    }
}


const existeProducto = async( id = '' ) => {
    const producto = await Producto.findById( id );
    if( !producto ){
        throw new Error(`El producto con el id ${ id } no existe dentro de la DB `);
    }

}

//validar colecciones permitidas
const coleccionesPermitidas  = ( coleccion = '' , coleccionesPermitidas = [] ) => {

    const incluye = coleccionesPermitidas.includes( coleccion );
    if( !incluye ){
        throw new Error( `La coleccion ${ coleccion} no es permitida, colecciones permitidas = ${ coleccionesPermitidas }` );
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    exiteUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}