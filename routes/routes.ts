import { validateUser } from './../src/middleware/user.validate';
import { Express } from "express";
import {
  testingHandler,
  testingHandler2,
} from "../src/controller/user.controller";
import { deserializeUser } from '../src/middleware/deserializeUser';
import userRouter from './user.routes';

export function routes(app: Express) {

  
  app.use('/api', userRouter); 
  
  //testing purposes 
  app.get("/api/testing",deserializeUser, testingHandler); 
  app.get("/api/testing2",deserializeUser, testingHandler2); 
  
  
}
