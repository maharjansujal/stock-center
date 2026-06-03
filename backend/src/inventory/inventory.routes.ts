import { Router } from "express";
import { addInventory, deleteInventory, getInventories, updateInventory } from "./inventory.controller";

const router = Router();

router.get('/', getInventories);
router.post('/add', addInventory);
router.patch('/update', updateInventory);
router.delete('/delete', deleteInventory);


export default router;