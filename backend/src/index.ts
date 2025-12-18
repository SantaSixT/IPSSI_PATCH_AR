import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/data-source";
import { UserController } from "./controllers/UserController";

const app = express();
const port = 3000;

// SÉCURITÉ ACTIVE
app.use(helmet()); // Protège les headers HTTP
app.use(cors());   // Gère les accès cross-origin
app.use(express.json());

const userController = new UserController();

AppDataSource.initialize().then(() => {
    console.log("Base de données connectée et sécurisée.");

    // Routes
    app.get("/populate", (req, res) => userController.populate(req, res));
    app.get("/users", (req, res) => userController.getAll(req, res));

    app.listen(port, () => {
        console.log(`Serveur sécurisé lancé sur http://localhost:${port}`);
    });
}).catch(error => console.log("Erreur DB:", error));