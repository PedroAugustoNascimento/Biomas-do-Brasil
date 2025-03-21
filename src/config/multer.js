import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..","client" ,"public", "img"),
    filename: (req, file, cb) => {
      // adicionar codigo unico antes de toda imagem para transformar cada imagem em um arquivo unico
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString("hex") + extname(file.originalname));
      });
    },
  }),
};
