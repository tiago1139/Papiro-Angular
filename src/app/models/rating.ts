import { Book } from "./book";
import { User } from "./user";

export interface Rating {
    _id: string;
    value:number;
    user:User;
    book:Book;
}