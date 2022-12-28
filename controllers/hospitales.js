const { response } = require('express');

const Hospital  = require('../models/hospital')

const getHospitales = async (req, resp = response) => {
    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img');
    
    resp.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async (req, resp = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalBD = await hospital.save();   

        resp.json({
            ok: true,
            hospital: hospitalBD
        });

    } catch (err) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarHospital = async (req, resp = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospitalDB = Hospital.findById(id);
        if ( !hospitalDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });    
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );


        resp.json({
            ok: true,
            hospital: hospitalActualizado
        });
        
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administardor'
        });        
    }
}

const borrarHospital = async (req, resp = response) => {

    const id = req.params.id;

    try {
        const hospitalDB = Hospital.findById(id);
        if ( !hospitalDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });    
        }

        await Hospital.findByIdAndDelete( id );


        resp.json({
            ok: true,
            msg: 'Hospital eliminado',
        });
        
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administardor'
        });        
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}