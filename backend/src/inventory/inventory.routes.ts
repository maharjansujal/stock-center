import { Router } from "express";
import { addInventory } from "./inventory.controller";

const router = Router();

router.post('/add', addInventory);

export default router;