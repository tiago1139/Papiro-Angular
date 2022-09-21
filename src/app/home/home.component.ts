import { Component, OnInit } from '@angular/core';


import { Book } from '../models/book';

import { BooksService } from '../services/books.service';

import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentRate = 0;
  books!:Book[];
  panelOpenState = false;

  loading: boolean;
  constructor(private booksService: BooksService,
    private ratingService: RatingService) {
    
      this.loading = true;
      this.booksService.getAllBooks()
      .subscribe(async res => {
        let books = res;
        for(let b of books) {
          await this.getRating(b);
          console.log("Entrou");
          console.log("B RANK === "+b.rank);
        }
        console.log("PASSSSA");
        this.books = books.sort(({rank:a}, {rank:b}) => b - a).slice(0, 6);
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
    let ratings : any;
    ratings = await this.ratingService.getRatingsByBook(book).toPromise();
    console.log("TYPE OF RATINGS: "+typeof ratings);
    console.log("TYPE OF RATINGS LENGTH: "+typeof ratings.length);
    console.log("RATINGS LENGTH: "+ ratings.length);
    if(ratings.length > 0) {
      for(let r of ratings) {
        result += r.value;
      }
      result = result/ratings.length;
      console.log("ratings.length é numero");
    }
    console.log("RANK : "+result);
    book.rank = result;
    console.log("RANK FINAL : "+book.rank);

  }
}
