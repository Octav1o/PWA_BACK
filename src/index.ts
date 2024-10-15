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

dotenv.config();


/**
 * App Variables
 */

if ( !process.env.PORT ) {

    process.exit(1);

}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();



/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());


// app.use("/api/movies", moviesRouter);
connectToDatabase()
    .then(() => {
        app.use("/api/movies", moviesRouter);

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

