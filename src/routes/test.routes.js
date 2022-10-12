/* ---------------------------- MODULOS ----------------------------- */
import { Router } from 'express';
import { faker } from '@faker-js/faker'
import path from 'path';

/* -------------------------- INSTANCIAS  --------------------------- */
const mockRouter = Router();

/* ------------------------------ RUTAS -----------------------------*/
mockRouter.get('/', (req, res)=>{
    const prodsQuantity = 5;
    const prods = [];

    for (let i = 1; i <= prodsQuantity; i++ ) {
        const product = {
            id: i,
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: `${faker.image.imageUrl()}?${i}`
        }

        prods.push(product);
    }

    
    res.status(200).json(prods);
});

mockRouter.get('*', async (req, res) => {
    res.status(404).send('404 - Page not found!!');
});

export default mockRouter;