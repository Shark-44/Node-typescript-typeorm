import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User"; 

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,  
    logging: true,  
    entities: [User], 
    migrations: ["src/migrations/*.ts"],  
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => console.log("Base de données connectée avec TypeORM"))
    .catch((error) => console.error("Erreur de connexion TypeORM:", error));
