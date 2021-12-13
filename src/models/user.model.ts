import { Document, Schema, model } from "mongoose";
import log from "../logging/logger";
import bcrypt from "bcrypt";
import config from "config";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt : Date; 
  updatedAt : Date; 
  comparePasswords(candidatePassword : string ) : Promise<boolean>; 
}

const userSchema = new Schema<IUser>(
  {

    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next) {
  const user = this as IUser;
  const saltFactor = config.get<number>("saltFactor");

  if (!user.isModified("password")) {
    next();
  }

  const hash: string = bcrypt.hashSync(user.password, saltFactor);
  this.password = hash;
  next();
});

userSchema.method(
  "comparePasswords",
  async function (candidatePassword: string) {
    const user = this as IUser;
    return await bcrypt
      .compare(candidatePassword, user.password)
      .catch((error: any) => log.error("Error comparing passwords"));
  }
);

export const User = model("User", userSchema);
