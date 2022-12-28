const { response } = require('express');
const Medico = require('../models/medicos');

const getMedicos = async (req, resp = response) => {
    
    const medicos = await Medico.find()
                         .populate('usuario', 'nombre img')
                         .populate('hospital', 'nombre img');

    resp.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, resp = response) => {

    const medico = new Medico({
        usuario: req.uid,
        ...req.body
    });


    try {
        const medicoDB = await medico.save();

        resp.json({
            ok: true,
            medico: medicoDB
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarMedico = async (req, resp = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById( id );
        if ( !medicoDB ) {
            return resp.status(404).json({
                ok: true,
                msg: 'Médico no encontrado por id'
            });    
        }

        const datosModificados = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, datosModificados, { new: true } );

        resp.json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });   
    }
}

const borrarMedico = async (req, resp = response) => {

    const id = req.params.id;

    try {
        const medicoDB = await Medico.findById( id );
        if ( !medicoDB ) {
            return resp.status(404).json({
                ok: true,
                msg: 'Médico no encontrado por id'
            });    
        }

        await Medico.findByIdAndDelete( id );

        resp.json({
            ok: true,
            msg: 'Médico eliminado'
        });
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });   
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}