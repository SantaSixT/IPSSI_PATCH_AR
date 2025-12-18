import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
    async populate(req: Request, res: Response) {
        try {
            await userService.populateUsers();
            res.status(201).json({ message: "Users populated successfully" });
        } catch (error) {
            console.error(error);
            // SÉCURITÉ : On ne renvoie pas l'erreur technique au client
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}