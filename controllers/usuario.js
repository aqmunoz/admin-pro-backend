const { response, request, json } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    const [usuarios, total] = await Promise.all([
        Usuario.find()
            .skip(desde)
            .limit(limite),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async (req, res = response) => {
    const { name, password, email } = req.body;

    try{

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }
        
        const usuario = new Usuario( req.body );
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch(error){
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar logs'
        });
    }
}

const actualizarUsuario = async (req = request, res = response) => {
    let uid = req.params.id;

    try {
        
        const usuarioDB = Usuario.findById( uid );
       
        
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe un usuario con ese uid'
            });
        }

        const {google, password, email, ...campos}  = req.body;

        if (usuarioDB.email !== email) {
           
            const existeEmail = await Usuario.findOne({email});
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Existe un usuario con ese email'
                });
            }
        }
        campos.email = email;

        const usuarioActualizado =  await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        

        //TODO: Validar token


        res.status(200).json({
            ok: true,
            usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar logs'
        });
    }
}

const borrarUsuario = async (req = request, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );
    

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe un usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }  catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar logs'
        });
    }
}




module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}