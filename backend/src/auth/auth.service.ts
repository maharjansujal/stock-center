import { pool } from "../db";
import { User } from "../types/user";
import { comparePassword, generateToken, hashPassword } from "./auth.utils";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerService({
  name,
  email,
  password,
}: RegisterInput): Promise<User> {
  // Checking if user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const password_hash = await hashPassword(password);

  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING public_id, name, email",
    [name, email, password_hash],
  );

  return result.rows[0];
}

export async function loginService({ email, password }: LoginInput) {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = result.rows[0];

  const isPasswordValid = await comparePassword(
    password,
    user.password_hash ?? "",
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    email: user.email,
    user_id: user.user_id,
    name: user.name,
    role: user.role,
  });

  return{
    token,
    user: {
        user_id: user.user_id,
        name: user.name,
        public_id: user.public_id,
        email: user.email
    }
  }
}
