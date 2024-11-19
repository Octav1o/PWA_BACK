// const greet = (name: string): string => {
//     return `Hello, ${name}!!`;
// };

// console.log((greet('World')));

/**
 * Required External Modules
 */


import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import { itemsRouter } from './items/items.router'
import { moviesRouter } from './movies/movies.routes';
import { connectToDatabase } from './services/database.service';
import webPush from 'web-push';
import { notificationsRouter } from './movies/notifications.router';
dotenv.config();


/**
 * App Variables
 */

if ( !process.env.PORT ) {

    process.exit(1);

}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
// console.log(vapidPublicKey);
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
// console.log(vapidPrivateKey);
webPush.setVapidDetails(
    'mailto:o.buenfilc2@gmail.com',
    vapidPublicKey!,
    vapidPrivateKey!,
);

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Conectado a la API!!!!!!!!!!');
});


// app.use("/api/movies", moviesRouter);
connectToDatabase()
    .then(() => {
        app.use("/api/movies", moviesRouter);
        app.use("/api/notifications", notificationsRouter);

        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error("Failed to connecto to database", error);
        process.exit();
    });


/**
 * Server Activation
 */

