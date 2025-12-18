import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "secure_db.sqlite",
    synchronize: true, // Créera les tables automatiquement
    logging: false,
    entities: [User],
});