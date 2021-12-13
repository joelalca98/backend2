import { Session, ISession } from "../models/session.model";
import log from "../logging/logger";

export async function createSession(userId: string) {
  return Session.create({ user: userId, isValid: true }).catch(
    (error: any) => {
      log.error("Error creatign session", error);
    }
  );
}

export async function findSessionById( sessionId : string) {
    return Session.findById(sessionId).lean().catch((error : any) => {
        log.error(`Error finding session with id: ${sessionId}`, error); 
    })
    
}

export async function validateSession( sessionId : string){
    const session : ISession = await findSessionById(sessionId) as ISession; 
    return session.isValid; 
}

export async function invalidateSession(sessionId : string) {
    return Session.findByIdAndUpdate( sessionId,  { isValid : false}).catch((error : any) => {
        log.error( `Error invalidating session with id ${sessionId}`, error); 
    })
}




