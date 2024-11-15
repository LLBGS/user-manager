import { ValidationMiddleware } from "@/shared/protocols/middlewares/validation-middleware";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();

export const createUsersRoutes = (
  userValidationMiddleware?: ValidationMiddleware
): Router => {
  const userRoutes = Router();
  userRoutes.get("/", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });
  userRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    res.json(user);
  });
  userRoutes.post("/", async (req, res) => {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({ data: { name, email } });
    res.json(newUser);
  });
  userRoutes.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.json(updatedUser);
  });
  userRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "User deleted" });
  });
  return userRoutes;
};
