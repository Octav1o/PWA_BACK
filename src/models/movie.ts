import { ObjectId } from "mongodb";

export default class Movie {
    constructor(public name: string, public year: number, public category: string, public id?: ObjectId) {}
}