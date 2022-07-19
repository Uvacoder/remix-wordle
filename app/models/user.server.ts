import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { db } from "~/db.server";

export async function getUserById(id: User["id"]) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(user: {
  username: User["username"];
  email: User["email"];
  password: User["password"];
}) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return db.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return db.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: User["password"]
) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return null;

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
