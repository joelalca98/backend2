import mongoose from 'mongoose'; 
import config from 'config'; 
import log from '../logging/logger';

const dbUri = config.get<string>('dbUri'); 

export async function connect(){
    await mongoose.connect(dbUri, {
        autoIndex : false, 
        
    })
    .then( () => {
        log.info('DB connected :)'); 
    })
    .catch( (error : any) => {
        log.error('Error connecting to DB'); 
    })
}