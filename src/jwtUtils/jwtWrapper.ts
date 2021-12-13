import { ISession } from "./../models/session.model";
import config from "config";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import log from "../logging/logger";
import { createSession, invalidateSession } from "../services/session.service";
import { get } from "lodash";

const privateKey = config.get<string>("privateKey");
const accesTokenExpirationTime = config.get<string>("accesTokenExpirationTime");
const refreshTokenExpirationTime = config.get<string>(
  "refreshTokenExpirationTime"
);

export async function createAccesToken(user: IUser, session: ISession) {
  //get fields for payload
  const { username, email } = user;

  const payload = { user: username, email: email, session: session._id };
  const accesToken = jwt.sign(payload, privateKey, {
    expiresIn: accesTokenExpirationTime,
  });

  return accesToken;
}

//create refresh token
export function createRefreshToken(session: ISession) {
  return jwt.sign({ session: session._id }, privateKey, {
    expiresIn: refreshTokenExpirationTime,
  });
}

//verify the access token
export function verifyToken(accesToken: string) {
  try {
    const decoded = jwt.verify(accesToken, privateKey);
    return { expired: false, decoded: decoded };
  } catch (error: any) {
    log.error("Error decodig jwt", error);
    return { expired: true, decoded: null };
  }
}

export function decodeToken ( token : string){
  return jwt.decode( token );   
}


