import config from 'config'; 
import express from 'express'; 
import cors from 'cors'; 
import log from './logging/logger'; 
import { connect } from './connection/connect';
import { routes } from '../routes/routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { deserializeUser } from './middleware/deserializeUser';

const host = config.get<string>('host');
const port = config.get<number>('port'); 


const app = express(); 

app.use(cors()); 
app.use(morgan('combined')); 
app.use(cookieParser()); 
app.use(deserializeUser); 
app.use(express.json()); 
app.use(express.urlencoded({extended: false })); 

app.listen(port, host, () => {

    connect(); 
    routes(app);
    log.info(`Listening at http://127.0.0.1:${port}`); 

})