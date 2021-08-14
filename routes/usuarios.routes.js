const { Router } = require('express');
const { check } = require('express-validator');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut,
    usuariosDelete } = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos')

const { esRoleValido, 
        emailExiste,
        exiteUsuarioPorId } = require('../helpers/db-validators');
    
const router = Router();

router.get('/', usuariosGet );

//aqui uso el middleware de express-validator para hacer validaciones
router.post('/', [
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'password', 'El password debe de tener más de 6 letras' ).isLength({ min: 6 }),
    check( 'correo', 'El correo no es válido' ).isEmail(),
    check( 'correo' ).custom( emailExiste ),
    check( 'rol').custom( esRoleValido ),
    //middleware personalizado
    validarCampos
], usuariosPost );

router.put('/:id',[
    check( 'id' , 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( exiteUsuarioPorId ),
    check( 'rol').custom( esRoleValido ),
    validarCampos
], usuariosPut );


router.delete('/:id',[
    check( 'id' , 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( exiteUsuarioPorId ),
    validarCampos
] ,usuariosDelete );



module.exports = router;