import { Router } from "express";
import { addInventory, deleteInventory, getInventories, updateInventory } from "./inventory.controller";
import { requireAdmin } from "../middleware/authenticateUser";

const router = Router();

router.get('/', getInventories);
router.post('/create', requireAdmin, addInventory);
router.patch('/update/:public_id', requireAdmin, updateInventory);
router.delete('/delete/:public_id', requireAdmin, deleteInventory);

export default router;