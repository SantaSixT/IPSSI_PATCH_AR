import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import axios from "axios";
import bcrypt from "bcrypt";

// Récupération du repository (l'outil qui parle à la DB)
const userRepository = AppDataSource.getRepository(User);

export class UserService {
    async populateUsers() {
        // 1. Appel API externe
        const response = await axios.get('https://randomuser.me/api/?results=3');
        const externalUsers = response.data.results;
        const usersToSave = [];

        for (const u of externalUsers) {
            const user = new User();
            user.name = `${u.name.first} ${u.name.last}`;
            
            // 2. SÉCURITÉ : Hachage du mot de passe (Bcrypt)
            // On ne stocke JAMAIS le mot de passe en clair
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(u.login.password, salt);
            
            usersToSave.push(user);
        }

        // 3. Sauvegarde sécurisée via l'ORM (Pas de SQL manuel = Pas d'injection)
        return await userRepository.save(usersToSave);
    }

    async getAllUsers() {
        return await userRepository.find({
            select: ["id", "name"] // On exclut le mot de passe du retour
        });
    }
}