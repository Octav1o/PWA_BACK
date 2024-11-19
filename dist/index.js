"use strict";
// const greet = (name: string): string => {
//     return `Hello, ${name}!!`;
// };
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// console.log((greet('World')));
/**
 * Required External Modules
 */
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import { itemsRouter } from './items/items.router'
const movies_routes_1 = require("./movies/movies.routes");
const database_service_1 = require("./services/database.service");
const web_push_1 = __importDefault(require("web-push"));
const notifications_router_1 = require("./movies/notifications.router");
dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
// console.log(vapidPublicKey);
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
// console.log(vapidPrivateKey);
web_push_1.default.setVapidDetails('mailto:o.buenfilc2@gmail.com', vapidPublicKey, vapidPrivateKey);
/**
 *  App Configuration
 */
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Conectado a la API!!!!!!!!!!');
});
// app.use("/api/movies", moviesRouter);
(0, database_service_1.connectToDatabase)()
    .then(() => {
    app.use("/api/movies", movies_routes_1.moviesRouter);
    app.use("/api/notifications", notifications_router_1.notificationsRouter);
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Failed to connecto to database", error);
    process.exit();
});
/**
 * Server Activation
 */
