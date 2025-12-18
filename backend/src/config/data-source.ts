import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";
import dotenv from "dotenv";

// SI ton fichier s'appelle 'db.env', utilise cette ligne :
dotenv.config({ path: './db.env' }); 

// SI ton fichier s'appelle '.env' (standard), utilise juste :
// dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1", // <--- FORCE L'ADRESSE IPV4 ICI
    port: 5432,
    username: process.env.DB_USERNAME,
    
    // SÉCURITÉ : On ne met JAMAIS le vrai mot de passe ici en "fallback"
    // On met juste "" pour éviter le crash technique si la variable manque.
    password: String(process.env.DB_PASSWORD || ""), 
    
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Comment], 
    subscribers: [],
    migrations: [],
});