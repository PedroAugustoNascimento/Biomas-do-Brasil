import { Router } from 'express';
import { biomeController } from '../controllers/BiomeController.js';


const biomeRoutes = Router();

biomeRoutes.post('/biome', biomeController.create);
biomeRoutes.get('/biomes', biomeController.getBiomes);
biomeRoutes.get('/biomes/', biomeController.getBiomeByName);
biomeRoutes.get('/biome/:name', biomeController.getBiome);
biomeRoutes.put('/biome/', biomeController.updateBioma);
biomeRoutes.delete('/biomes/', biomeController.deleteBioma);

export default biomeRoutes;