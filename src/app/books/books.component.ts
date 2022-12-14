import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { Book } from '../models/book';
import { Rating } from '../models/rating';
import { BookfilterPipe } from '../pipes/bookfilter.pipe';
import { BooksService } from '../services/books.service';
import { RatingService } from '../services/rating.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit{
  currentRate = 0;
  books!: Book[];
  @Input() term:any;
  loading: boolean;
  searchService:any;

  constructor(
    private booksService: BooksService,
    private ratingService: RatingService,
    searchService: SearchService,
    private sanitizer: DomSanitizer
  ) {
    this.searchService = searchService;
    this.loading = true;

    this.booksService.getAllBooks().subscribe(async books => {
      this.books = books;

      for (let b of this.books) {
        await this.getRating(b);
      }
      setTimeout(() => {
       this.loading = false;
      }, 2000);
    });

    window.addEventListener("load", this.stopSpinner);
   }

  ngOnInit(): void {
  }

  stopSpinner() {
    console.log("SPINNER OFF");
    this.loading = false;
  }

  async getRating(book:Book) : Promise<any> {
    let result = 0;
    let ratings : Rating[];
    this.ratingService.getRatingsByBook(book)
    .subscribe(res => {
      ratings = res;
      for(let r of ratings) {
        result += r.value;
      }
      result = result/ratings.length;
      console.log("RANK : "+result);
      book.rank = result;
      console.log("RANK FINAL : "+book.rank);
    });


  }

  safeUrl(url:string) : SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
