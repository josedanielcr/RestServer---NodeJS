const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRol } = require('../middlewares/');

const router = Router();


/**
 * {{url}}/api/categorias
 */

//obtener todas las categorias - publicas
router.get('/', obtenerCategorias );

//obtener una categoria por id - publicas
router.get('/:id',[
    check( 'id' , 'No es un id valido').isMongoId(),
    check( 'id' ).custom( existeCategoria ),
    validarCampos,
], obtenerCategoria );


//crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check( 'nombre' , 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );


//actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check( 'id' ).custom( existeCategoria ),
    check( 'nombre' , 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);


//borrar categoria - privado - admin
router.delete('/:id',[
    validarJWT,
    esAdminRol, 
    check( 'id' , 'No es un id valido').isMongoId(),
    check( 'id' ).custom( existeCategoria ),
    validarCampos
],borrarCategoria)





module.exports = router;