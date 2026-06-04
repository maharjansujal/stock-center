import { Router } from "express";
import { addInventory, deleteInventory, getInventories, restoreInventory, updateInventory } from "./inventory.controller";
import { requireAdmin } from "../middleware/authenticateUser";

const router = Router();

router.get('/', getInventories);
router.post('/create', requireAdmin, addInventory);
router.patch('/update/:public_id', requireAdmin, updateInventory);
router.patch('/restore/:public_id', requireAdmin, restoreInventory);
router.delete('/delete/:public_id', requireAdmin, deleteInventory);

export default router;