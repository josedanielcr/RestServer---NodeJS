const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files , extensionesPermitidas = [ 'png','jpeg','jpg','gif' ] , carpeta = '') => {
    return new Promise( ( resolve , reject ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado [ nombreCortado.length - 1 ];
    
        if ( !extensionesPermitidas.includes( extension ) ){
            return reject( `La extension ${extension} no es permitida = ${ extensionesPermitidas } son extensiones validas`)
        }
    
        const nombreTemp = uuidv4() + '.'+ extension;
        const uploadPath = path.join( __dirname , '../uploads/', carpeta , nombreTemp );
      
        archivo.mv( uploadPath, ( err ) => {
          if  ( err ) {
           reject( err );
          }

          resolve( nombreTemp );
        });

    });
    
}




module.exports = {
    subirArchivo
}