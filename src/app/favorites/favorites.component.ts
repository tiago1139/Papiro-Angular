import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Book } from '../models/book';
import { Rating } from '../models/rating';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  user!: User;
  books!: Book[];

  loading: any;

  constructor(
    private userService: AccountService,
    private ratingService: RatingService,
    private sanitizer: DomSanitizer
  ) {
    this.GetData();
  }
  
  ngOnInit(): void {
  }
  
  async GetData() {
    await this.getUser();
    await this.getAllRatings();
  }

  async getAllRatings() {
    
    for (let b of this.books) {
      await this.getRating(b);
    }
  }

  async getUser() {
    if(sessionStorage.getItem("user")) {
      this.user = await JSON.parse(sessionStorage.getItem("user") || "{}");
      this.books = this.user.favorites;
    } 
    console.log(this.user);
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
