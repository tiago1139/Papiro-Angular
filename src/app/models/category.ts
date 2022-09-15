import { Book } from "./book";

export interface Category {
    _id:string;
    name:string;
    books: Book[];
}