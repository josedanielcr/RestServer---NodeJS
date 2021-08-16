
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    correo: {
        type: String,
        required: [ true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es obligatorio' ]
    },
    imagen: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});


//esto es un metodo que sobreescribe el toJSON para que cuando se devuelva un usuario no traiga ni el __v y password
UsuarioSchema.methods.toJSON = function(){
    const { __v , password, _id ,...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

//El primer parametro es el nombre que mongo le va a poner a la coleccion, solo que le agrega una 's'
module.exports = model( 'Usuario', UsuarioSchema );