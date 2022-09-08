import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentRate = 0;
  books: Observable<Book[]>;
  panelOpenState = false;
  constructor(private booksService: BooksService) {
    this.books = this.booksService.getAllBooks();
   }

  ngOnInit(): void {
  }

}
