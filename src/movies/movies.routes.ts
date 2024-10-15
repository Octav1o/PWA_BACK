import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.service';
import Movie from '../models/movie';

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

moviesRouter.post("/", async ( req: Request, res: Response ) => {

    try {
        const newMovie = req.body as Movie;
        const result = await collections.movies?.insertOne(newMovie);

        result
            ? res.status(201).send(`Successfully created a new movie with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new movie");
    } catch ( error: any ) {
        console.error(error);
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