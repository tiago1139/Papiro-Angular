import { Category } from "./category";
import { Rating } from "./rating";

export interface Book {
    _id:string;
    title:string;
    author:string;
    isbn:string;
    categories:Category[];
    rank:number;
    cover:string;

}