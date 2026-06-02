import { Request, Response } from "express";
import { LoginInput, loginService, RegisterInput, registerService } from "./auth.service";

export async function registerUser(
  req: Request<{}, any, RegisterInput>,
  res: Response,
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await registerService({ name, email, password });
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server error",
    });
  }
}

export async function loginUser(req: Request<LoginInput>, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginService({ email, password });

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    return res.status(401).json({
      message: err instanceof Error ? err.message : "Invalid credentials",
    });
  }
}
