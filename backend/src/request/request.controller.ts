import { createRequestService, getPersonalRequestsService, getRequestsService, reviewRequestService, updateRequestService } from "./request.service";
import { Response, Request } from "express"
import { AuthenticatedRequest } from "../middleware/authenticateUser"

export async function createRequest(
  req: AuthenticatedRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const result = await createRequestService({
    id: req.user.id,
    role: req.user.role,
    item_id: req.body.item_id,
    quantity: req.body.quantity,
  });

  return res.status(201).json(result);
}

export async function updateRequest(
  req: AuthenticatedRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { public_id } = req.params;
  const { item_id, quantity } = req.body;

  if (Array.isArray(public_id)) {
    throw new Error("Invalid public_id");
  }

  const result = await updateRequestService({
    public_id,
    user_id: req.user.id,
    item_id,
    quantity,
  });

  return res.status(200).json(result);
}

export async function reviewRequest(
  req: AuthenticatedRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { public_id } = req.params;
  const { status } = req.body;

  if (Array.isArray(public_id)) {
    throw new Error("Invalid public_id");
  }

  const result = await reviewRequestService({
    public_id,
    reviewed_by: req.user.id,
    status,
  });

  return res.status(200).json(result);
}

export async function getRequests(_req: Request, res: Response) {
  try {
    const result = await getRequestsService();
    return res.status(200).json({
      message: "Requests retrieved successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server Error",
    });
  }
}

export async function getPersonalRequests(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired token"
      })
    }
    const result = await getPersonalRequestsService(user.id);
    return res.status(200).json({
      message: "Requests retrieved successfully",
      result
    })
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server Error"
    })
  }
}