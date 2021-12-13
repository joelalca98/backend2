import { Request, Response, NextFunction } from 'express'; 

export const requeriesUser = async ( req: Request, res: Response, next : NextFunction) =>{

    //@ts-ignore
    if(req.user == null){
     return res.status(403).send({ message: "Log in please"}); 
    }

    next(); 

}