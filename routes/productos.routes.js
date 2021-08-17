const { Router } = require('express');
const { check } = require('express-validator');


const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { existeCategoria , existeProducto } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRol } = require('../middlewares/');


/**
 * {{url}}/api/productos
 */

const router = Router();

//obtener todos los productos - publicas
router.get('/', obtenerProductos );

//obtener un producto por id - publicas
router.get('/:id',[
    check( 'id' , 'No es un id valido').isMongoId(),
    check( 'id' ).custom( existeProducto ),
    validarCampos,
], obtenerProducto );

//crear productos - publica
router.post('/',[
    validarJWT,
    check( 'nombre' , 'El nombre es obligatorio').not().isEmpty(),
    check( 'categoria', 'El id de la categoria no es valido' ).isMongoId(),
    check( 'categoria' ).custom( existeCategoria ),
    validarCampos
],  crearProducto);

//actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check( 'id' , 'No es un id valido').isMongoId(),
    check( 'id' ).custom( existeProducto ),
    validarCampos
], actualizarProducto);


//borrar producto - privado - admin
router.delete('/:id',[
    validarJWT,
    esAdminRol, 
    check( 'id' , 'No es un id valido').isMongoId(),
    check( 'id' ).custom( existeProducto ),
    validarCampos
], borrarProducto )


module.exports = router;
