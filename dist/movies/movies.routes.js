"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moviesRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
const axios_1 = __importDefault(require("axios"));
exports.moviesRouter = express_1.default.Router();
exports.moviesRouter.use(express_1.default.json());
exports.moviesRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const movies = (yield ((_a = database_service_1.collections.movies) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
        res.status(200).send(movies);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.moviesRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const movie = (yield ((_b = database_service_1.collections.movies) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (movie) {
            res.status(200).send(movie);
        }
        else {
            res.status(404).send(`Unable to find matching document with id : ${(_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id}`);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
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
exports.moviesRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newMovie = req.body;
        // Insertar la nueva película en la base de datos
        const result = yield ((_a = database_service_1.collections.movies) === null || _a === void 0 ? void 0 : _a.insertOne(newMovie));
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
            yield axios_1.default.post('http://localhost:7000/api/notifications/send', { payload });
        }
        catch (notificationError) {
            console.error("Error al enviar la notificación:", notificationError.message);
            // No interrumpimos la respuesta exitosa por errores en las notificaciones
            res.status(201).send(`Created a new movie with id ${result.insertedId}, pero ocurrió un error al enviar la notificación.`);
        }
        // Responder exitosamente
        res.status(201).send(`Successfully created a new movie with id ${result.insertedId}`);
    }
    catch (error) {
        console.error("Error al crear la película:", error.message);
        res.status(400).send(error.message);
    }
}));
exports.moviesRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const updateMovie = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections.movies) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: updateMovie }));
        result
            ? res.status(200).send(`Successfully updated movie with id ${id}`)
            : res.status(304).send(`Movie with id: ${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
exports.moviesRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections.movies) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully deleted movie with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remoive movie with id : ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Movie with id: ${id} not found`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
