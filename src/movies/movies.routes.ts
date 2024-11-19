import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.service';
import Movie from '../models/movie';
import axios from 'axios';

export const moviesRouter = express.Router();

moviesRouter.use(express.json());

moviesRouter.get("/", async ( _req: Request, res: Response ) => {
    try {
        const movies = (await collections.movies?.find<Movie>({}).toArray());

        res.status(200).send(movies);
    } catch ( error:any ) {
        res.status(500).send(error.message);
    }
});

moviesRouter.get("/:id", async ( req: Request, res: Response ) => {

    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const movie = (await collections.movies?.findOne<Movie>(query));

        if ( movie ) {
            res.status(200).send(movie);
        } else {

            res.status(404).send(`Unable to find matching document with id : ${req?.params?.id}`);
        }
    } catch ( error:any ) {
        res.status(500).send(error.message);
    }

});

// moviesRouter.post("/", async ( req: Request, res: Response ) => {

//     try {
//         const newMovie = req.body as Movie;
//         const result = await collections.movies?.insertOne(newMovie);

//         result
//             ? res.status(201).send(`Successfully created a new movie with id ${result.insertedId}`)
//             : res.status(500).send("Failed to create a new movie");
//     } catch ( error: any ) {
//         console.error(error);
//         res.status(400).send(error.message);
//     }

// });
moviesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newMovie = req.body as Movie;

        // Insertar la nueva película en la base de datos
        const result = await collections.movies?.insertOne(newMovie);

        if (!result) {
            // Si no se puede crear la película, enviamos la respuesta y salimos
            res.status(500).send("Failed to create a new movie");
        }

        // Enviar notificación push a todos los suscriptores
        const payload = {
            title: "Nueva película añadida",
            body: `¡Nueva película: ${newMovie.name} ha sido añadida!`
        };

        try {
            // Llamar al endpoint /send para enviar la notificación push
            await axios.post('http://localhost:7000/api/notifications/send', { payload });
        } catch (notificationError: any) {
            console.error("Error al enviar la notificación:", notificationError.message);

            // No interrumpimos la respuesta exitosa por errores en las notificaciones
            res.status(201).send(`Created a new movie with id ${result!.insertedId}, pero ocurrió un error al enviar la notificación.`);
        }

        // Responder exitosamente
        res.status(201).send(`Successfully created a new movie with id ${result!.insertedId}`);
    } catch (error: any) {
        console.error("Error al crear la película:", error.message);
        res.status(400).send(error.message);
    }
});

moviesRouter.put("/:id", async (req: Request, res: Response) => {

    const id = req?.params?.id;

    try {

        const updateMovie: Movie = req.body as Movie;
        const query = { _id: new ObjectId(id) };

        const result = await collections.movies?.updateOne(query, { $set: updateMovie });

        result
           ? res.status(200).send(`Successfully updated movie with id ${id}`)
           : res.status(304).send(`Movie with id: ${id} not updated`);

    } catch ( error: any ) {
        console.error(error.message)
        res.status(400).send(error.message);
    }

});

moviesRouter.delete("/:id", async (req: Request, res: Response) => {

    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        const result = await collections.movies?.deleteOne(query);
        
        if ( result && result.deletedCount ) {
            res.status(202).send(`Successfully deleted movie with id ${id}`);
        } else if ( !result ) {
            res.status(400).send(`Failed to remoive movie with id : ${id}`);
        } else if ( !result.deletedCount ) {
            res.status(404).send(`Movie with id: ${id} not found`);
        }


    } catch ( error: any ) {
        console.error(error.message)
        res.status(400).send(error.message);
    }

});