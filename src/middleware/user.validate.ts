import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";

export const validateUser =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await schema
      .validate({
        body: req.body,
      })
      .then(() => next())
      .catch((error: any) => {
        res.status(403).send({ message: error.message });
      });
  };
