import { Router } from 'express'; 
import { createUserHandler, deleteUserByIdHandler, getAllUsersHandler, getUserByIdHandler, loginHandler, logOutHandler, updateUserHandler } from '../src/controller/user.controller';
import { requeriesUser } from '../src/middleware/requiresUser';
import { validateUser } from '../src/middleware/user.validate';
import { userSchema } from '../src/schemas/user.schema';

const router = Router();  

//Get all users
router.get("/user", getAllUsersHandler);

//Create a user
router.post("/user", validateUser(userSchema),createUserHandler);

//login user
router.post("/user/login",validateUser(userSchema),loginHandler); 
  
//Get user by Id
router.get("/user/:id", getUserByIdHandler);


//Operations requiring user
router.use(requeriesUser); 

//Logout User
router.delete("/user/logout",logOutHandler);

//Update user by Id
router.put("/user/:id", validateUser(userSchema),updateUserHandler);

//Delete user by Id
router.delete("/user/:id", deleteUserByIdHandler);

export default router; 