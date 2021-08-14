const mongoose = require('mongoose');
require('colors');


const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('base de datos online'.brightCyan);
        
    } catch (error) {
        console.log( error );
        throw new Error('Error a la hora de iniciar la base de datos'.red);
    }
}


module.exports = {
    dbConnection
}