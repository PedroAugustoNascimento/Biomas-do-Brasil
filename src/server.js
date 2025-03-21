import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./routes/MainRoutes.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4441;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erro no servidor",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Algo deu errado",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
