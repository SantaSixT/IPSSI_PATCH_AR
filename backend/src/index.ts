import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/data-source";
import { UserController } from "./controllers/UserController";
import { CommentController } from "./controllers/CommentController";

const app = express();
const port = 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST"]
}));
app.use(express.json());

// Initialisation des Contrôleurs
const userController = new UserController();
const commentController = new CommentController();

AppDataSource.initialize().then(() => {
    console.log("✅ Base de données connectée et sécurisée via PostgreSQL !");

    // --- ROUTES UTILISATEURS ---
    app.get("/populate", (req, res) => userController.populate(req, res));
    app.get("/users", (req, res) => userController.getAll(req, res));
    app.get("/users/:id", (req, res) => userController.getOne(req, res)); 

    // --- ROUTES COMMENTAIRES ---
    app.get("/comments", (req, res) => commentController.getAll(req, res));
    app.post("/comment", (req, res) => commentController.create(req, res));

    // Route d'accueil
    app.get("/", (req, res) => {
        res.send("Bienvenue sur l'API Sécurisée ! 🛡️");
    });

    app.listen(port, () => {
        console.log(`🚀 Serveur sécurisé lancé sur http://localhost:${port}`);
    });

}).catch(error => {
    console.log("❌ Erreur de connexion DB :");
    console.log(error);
});