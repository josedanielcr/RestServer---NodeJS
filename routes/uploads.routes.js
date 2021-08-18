const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo,  mostrarImagen, modificarImagenCloudinary } = require('../controllers/uploads');

const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', validarArchivo ,cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivo,
    check( 'id' , 'El id debe de ser un id de mongo').isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c , ['usuarios' , 'productos']) ),
    validarCampos,
] , modificarImagenCloudinary )
//modificarImagen

router.get('/:coleccion/:id', [
    check( 'id' , 'El id debe de ser un id de mongo').isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c , ['usuarios' , 'productos']) ),
    validarCampos,
] , mostrarImagen )



module.exports = router;