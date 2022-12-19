const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB connected');
    }catch(error){
        console.log(error);
        throw new Error('Error al tratar de conectarse a la base de datos, ver logs');
    }
}

module.exports = {
    dbConnection
}