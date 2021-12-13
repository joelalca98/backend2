import { LeanDocument } from "mongoose";
import { ISession } from "./../models/session.model";
import {
  createUser,
  deleteUser,
  findUserById,
  findUserByEmail,
  getUsers,
  updateUser,
  validatePassword,
} from "../services/user.service";
import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { omit } from "lodash";
import { createAccesToken, createRefreshToken } from "../jwtUtils/jwtWrapper";
import { createSession, invalidateSession} from "../services/session.service";
import log from "../logging/logger";

export async function getAllUsersHandler(req: Request, res: Response) {
  const users: any = await getUsers();
  const response = users.map((user: any) => omit(user.toJSON(), "password"));
  res.status(200).json(response);
}

export async function getUserByIdHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = await findUserById(id);

  if (user) {
    res.status(200).json(omit(user.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function deleteUserByIdHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = await deleteUser(id);

  if (user) {
    res.status(200).json(omit(user.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = req.body as IUser;
  const updated: any = await updateUser(id, user);
  if (updated !== undefined) {
    res.status(200).json(omit(updated.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function createUserHandler(req: Request, res: Response) {
  const user = req.body as IUser;
  const created = await createUser(user);
  if (created !== undefined) {
    res.status(201).json(omit(created.toJSON(), "password"));
  } else {
    res.status(405).send({ message: "User exists" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const isValid = await validatePassword(email, password);
  if (isValid) {
    //find user and create session
    const user: any = await findUserByEmail(email);
    log.debug(user);
    const session: any = await createSession(user._id);

    //create both access and refresh token
    const accessToken = await createAccesToken(
      user as IUser,
      session as ISession
    );
    const refreshToken = createRefreshToken(session as ISession);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 300000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 600000,
    });

    //respond with user and tokens
    res.status(200).send({
      message: "Logged in correctly",
    });
  } else {
    res.status(403).send({ message: "Error user or password missmatch" });
  }
}


export async function logOutHandler(req: Request, res: Response){
  //@ts-ignore
  const invalidated : any = await invalidateSession(req.user.session); 
  res.cookie("accessToken", '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.cookie("refreshToken", '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.status(200).send({ message: "Logged out correctly", session: invalidated._id}); 

}


export async function testingHandler(req: Request, res: Response) {
  //@ts-ignore
  const user = req.user;

  res.json(user).status(200);
}
export async function testingHandler2(req: Request, res: Response) {
  //@ts-ignore
  const user = req.user;

  res.json({ ...user, lavidaesdura: true }).status(200);
}
