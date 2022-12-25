const { Router } = require('express');
const { check } = require('express-validator');
const { crearMedico, getMedicos, actualizarMedico, borrarMedico } = require('../controllers/medico');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',getMedicos);

router.post('/', 
    [
      validarJWT,
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('hospital', 'El id de hospital debe de ser válido').isMongoId(),
      validarCampos  
    ],
    crearMedico
);

router.put('/:id', 
    [
        
    ],
    actualizarMedico
);

router.delete('/:id',
    borrarMedico
);

module.exports = router;