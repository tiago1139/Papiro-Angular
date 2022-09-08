import { Rating } from "./rating";

export interface Book {
    _id:string;
    title:string;
    author:string;
    isbn:string;
    categories:string[];
    rank:number;
    cover:string;

}