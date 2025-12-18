import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
    
    // Méthode 1 : EXISTANTE
    async populate(req: Request, res: Response) {
        try {
            await userService.populateUsers();
            res.status(201).json({ message: "Users populated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Méthode 2 : EXISTANTE
    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Méthode 3 : NOUVELLE (À AJOUTER ICI)
    async getOne(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        
        // Validation basique
        if (isNaN(id)) {
            // return est important ici pour arrêter l'exécution
            return res.status(400).json({ error: "Invalid ID" }); 
        }

        try {
            const user = await userService.getUserById(id);
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}