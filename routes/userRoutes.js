import {Router} from 'express';
import allowRoles from '../middleware/roleMiddleware.js'
import authMiddleWare from '../middleware/authMiddleware.js'
import { getallUser, registerUser, updateUser,deleteUser} from '../Controller/userController.js';

const router=Router();

router.post("/register",authMiddleWare,allowRoles("admin"),registerUser);
router.get("/alluser",authMiddleWare,allowRoles("admin"),getallUser)
router.patch("/:id/updateuser",authMiddleWare,allowRoles("user","admin"),updateUser);
router.delete("/deleteUser/:id",authMiddleWare,allowRoles("user","admin"),deleteUser);

export default router;
