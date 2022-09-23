import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book';

@Pipe({
  name: 'bookfilter',
  pure: false
})
export class BookfilterPipe implements PipeTransform {

  transform(books: Book[], searchValue: any): Book[] {

    if(!books || !searchValue) {
      console.log("Not Searching");
      return books;
    }
    return books.filter(book => {
      return book.author.toLowerCase().includes(searchValue.toLowerCase()) ||
      book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      book?.isbn.toLowerCase().includes(searchValue.toLowerCase())
    });
  }

}
