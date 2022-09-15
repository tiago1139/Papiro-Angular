import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Book } from '../models/book';
import { Category } from '../models/category';
import { Rating } from '../models/rating';
import { BooksService } from '../services/books.service';
import { CategoryService } from '../services/category.service';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories!: Category[];

  constructor(
    private booksService: BooksService,
    private ratingService: RatingService,
    private catService: CategoryService,
    private sanitizer: DomSanitizer
  ) {
    this.catService.getAllCategories().subscribe(cats => {
      this.categories = cats;
      this.categories = this.categories.filter(obj => {
        return obj.books.length > 0;
      });
      this.categories.sort((a,b) => b.books.length - a.books.length);
    });
   }

  ngOnInit(): void {
  }

  getRating(book:Book) : any {
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
