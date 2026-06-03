import { Router } from "express";
import { createRequest, getPersonalRequests, getRequests, reviewRequest, updateRequest } from "./request.controller";
import { requireAdmin } from "../middleware/authenticateUser";

const router = Router();

router.post('/create', createRequest);
router.patch("/:public_id", updateRequest);

router.get("/", requireAdmin, getRequests);
router.get("/me", getPersonalRequests);

router.patch("/:public_id/review", requireAdmin, reviewRequest);

export default router;