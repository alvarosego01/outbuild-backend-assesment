


import { Router } from 'express';

const router: Router = Router();

    router.get('/', async (req, res) => {

        // const em = orm.em.fork();
        res.send('Hello world!');

    });

    router.get('/dos/:id', async (req, res) => {

        // const em = orm.em.fork();
        res.send('Hello world!');

    });

    router.post('/tres', async (req, res) => {

        // const em = orm.em.fork();
        res.send('Hello world!');

    });


export default router;