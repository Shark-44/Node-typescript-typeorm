import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

import app from "./app";


dotenv.config();
const PORT = process.env.PORT || 3000;

const port = parseInt(process.env.APP_PORT ?? "4242", 10)


async function startServer() {
  try {
      await AppDataSource.initialize();  // Initialise la connexion TypeORM
      console.log("Base de données connectée avec TypeORM");

      app.listen(PORT, () => {
          console.log(`Serveur démarré sur le port ${PORT}`);
      });
  } catch (error) {
      console.error("Erreur au démarrage du serveur:", error);
      process.exit(1);
  }
}

startServer().catch(error => {
  console.error('Erreur au démarrage du serveur:', error);
  process.exit(1);
});