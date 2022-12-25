const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = (req, res = response) => {

    const { tipo, id } = req.params;

    const tiposPermitidos = ['medicos', 'hospitales', 'usuarios'];

    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médiico, usuario u hospital (tipo) '
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({
            ok: false,
            msg: 'No hay ningún fichero.'
        });
    }

    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extArchivo = nombreCortado[ nombreCortado.length - 1 ];

    const extensionesValidas = ['png', 'jpeg', 'jpg', 'gif'];
    if ( !extensionesValidas.includes(extArchivo)) {
        return res.status(400).send({
            ok: false,
            msg: 'No es una extensión válida.'
        });
    }

    const nombreArchivo = `${ uuidv4() }.${extArchivo}`;

    const path = `./uploads/${tipo}/${nombreArchivo}`;

    file.mv(path, (err) =>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
}

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const imagen = req.params.imagen;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${imagen}`);
    
    if (fs.existsSync(pathImg)) {

        res.sendFile(pathImg);
    } else {
        const noImage = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(noImage);
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}