import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';


import { Book } from '../models/book';
import { Rating } from '../models/rating';
import { Convert, User } from '../models/user';
import { BooksService } from '../services/books.service';
import { RatingService } from '../services/rating.service';
import { AccountService } from '../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var window: any;

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  book!: Book;
  user!:  User;
  blocked = true;

  userRating!: Rating;

  rate: number;

  admin: boolean;

  formModal: any;

  loading: boolean;

  spinnerSize: number;

  favorite!: boolean;

  constructor(
    private bookService: BooksService,
    private ratingService: RatingService,
    private userService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {

    this.loading = false;
    
    this.spinnerSize = this.getScreenSize()/4;

    if(sessionStorage.getItem('admin')) {
      this.admin = true;
    } else {
      this.admin= false;
    }
    this.rate = 3;
    this.getUser();
    this.getBook().subscribe(book => {
      this.book = book;
      this.favorite = this.user.favorites.some(elem =>{
        return JSON.stringify(this.book) === JSON.stringify(elem);
      });
      this.getUserRating()?.subscribe(rating => {
        this.userRating = rating;
        this.rate = this.userRating?.value == null ? 0 : this.userRating.value;
        console.log("current rate: "+this.rate);
      });

    });
    
    if(this.userRating !== null) {
      console.log("RATING EXISTEEEEE")
      console.log(JSON.stringify(this.userRating))
      this.rate = this.userRating?.value;
      console.log("RATEE : : : : "+this.rate)
    }
   }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() : number{
         return window.innerWidth;
  }

  async getUser() {
    if(sessionStorage.getItem("user")) {
      this.user = await JSON.parse(sessionStorage.getItem("user") || "{}");
    } 
    console.log(this.user);
  }

  getBook() {
    const id = this.route.snapshot.paramMap.get('id');
    return this.bookService.getBookById(id);

  }

  getUserRating() {

    if(this.user == null) {
      console.log("USER NULL");
      return;
    }
    if(this.book == null) {
      console.log("BOOK NULL");
      return;
    }
    return this.ratingService.getRatingByUserAndBook(this.user, this.book);

  }

  avaliar(): void {
    this.loading = true;

    if(this.user == null) {
      console.log("USER NULL");
      this.loading = false;
      return;
    }
    if(this.book == null) {
      console.log("BOOK NULL");
      this.loading = false;
      return;
    }
    if(this.userRating) {
      this.userRating.value = this.rate;
      this.ratingService.updateRating(this.userRating?._id, this.userRating)
      .subscribe(res => {
        console.log(res);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
      return;
    }

    const newRating = {} as Rating
    newRating.book = this.book;
    console.log("NEW RATING BOOK: "+newRating.book.title);
    newRating.user = this.user;
    console.log("NEW RATING USER: "+newRating.user.username);
    newRating.value = this.rate;

    console.log(JSON.stringify(newRating));

    this.ratingService.createRating(newRating).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
    
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  deleteBook() {
    this.bookService.deleteBook(this.book._id)
    .subscribe(res => {
      console.log(res);
      this.formModal.hide();
      this.router.navigate(['/']);
    });
  }

  async addFavorite() {
    this.loading = true;
    this.user.favorites.push(this.book);

    let resposta = await (await this.userService.updateUser(this.user._id, this.user)).toPromise();
    this.favorite = true;
    this.loading = false;
    this.snack.open("Livro adicionado aos favoritos com sucesso", undefined, {duration: 4000,  panelClass: ['green-snackbar']});
  }

  async removeFavorite() {
    this.loading = true;
    console.log("BOOK");
    console.log(JSON.stringify(this.book));
    this.user.favorites = this.user.favorites.filter(obj => {
      console.log("FAVORITO");
      console.log(JSON.stringify(obj));
      return JSON.stringify(this.book) !== JSON.stringify(obj);
    });
    console.log(this.user.favorites);

    let resposta = await (await this.userService.updateUser(this.user._id, this.user)).toPromise();
    this.favorite = false;
    this.loading = false;
    this.snack.open("Livro removido dos favoritos com sucesso", undefined, {duration: 4000,  panelClass: ['yellow-snackbar']});
  }

  openModal() {
    this.formModal.show();
  }

  closeModal() {
    this.formModal.hide();
  }



}
