import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

import {
  createAccesToken,
  decodeToken,
  verifyToken,
} from "../jwtUtils/jwtWrapper";
import {
  findSessionById,
  invalidateSession,
} from "../services/session.service";
import { findUserById } from "../services/user.service";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //get the access token
  const { accessToken } = req.cookies;

  //check for the access token
  const { expired, decoded } = verifyToken(accessToken as string);

  if (decoded !== null) {
    //@ts-ignore
    req.user = decoded;
    return next();
  }

  //if access token is expired we need to make a new one from the refresh token

  if (decoded == null && expired == true) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return next();

    //we need to decode the payload and return a new access token
    const { decoded, expired } = verifyToken(refreshToken as string);

    // if token is expired we need to return next
    if (expired) {
      const payload = decodeToken(refreshToken as string);
      invalidateSession(get(payload, "session"));
      return next(); 
    }

    //get the session associated with the token
    if (decoded !== null && expired == false) {
      const session: any = await findSessionById(get(decoded, "session"));
      //check if the session is valid this means the user has logged out of the system
      if (session.isValid == false) return next();

      //create a new access token
      const user = await findUserById(session.user as string);
      const newAccessToken = await createAccesToken(user, session);
      req.headers.authorization = newAccessToken;

      //set cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 300000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 600000,
      });

      //@ts-ignore
      req.user = user;

      return next();
    }
  }
}
