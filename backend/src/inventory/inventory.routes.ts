import { Router } from "express";
import { addInventory, deleteInventory, getInventories, updateInventory } from "./inventory.controller";

const router = Router();

router.get('/', getInventories);
router.post('/create', addInventory);
router.patch('/update/:public_id', updateInventory);
router.delete('/delete', deleteInventory);

export default router;