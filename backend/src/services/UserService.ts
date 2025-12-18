import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import axios from "axios";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
    
    // --- Méthode 1 : Peupler la base ---
    async populateUsers() {
        const response = await axios.get('https://randomuser.me/api/?results=3');
        const externalUsers = response.data.results;
        const usersToSave = [];

        for (const u of externalUsers) {
            const user = new User();
            user.name = `${u.name.first} ${u.name.last}`;
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(u.login.password, salt);
            
            usersToSave.push(user);
        }

        return await userRepository.save(usersToSave);
    }

    // --- Méthode 2 : Récupérer tout le monde ---
    async getAllUsers() {
        return await userRepository.find({
            select: ["id", "name"] // On exclut le mot de passe
        });
    } // <--- ICI on ferme bien getAllUsers avec l'accolade

    // --- Méthode 3 : Récupérer UN seul utilisateur (AJOUT) ---
    async getUserById(id: number) {
        return await userRepository.findOneBy({ id });
    } 

} // <--- ICI on ferme la Class UserService