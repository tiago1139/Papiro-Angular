import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating } from '../models/rating';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  
  getRatings() :Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(`${environment.apiUrl}/ratings`);
  }

  getRatingById(id: string) : Observable<Rating> {
    return this.httpClient.get<Rating>(`${environment.apiUrl}/rating/${id}`);
  }

  getRatingsByBook(book: Book) : Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(`${environment.apiUrl}/ratings/book/${book._id}`);
  }

  getRatingByUserAndBook(user: User, book: Book) : Observable<Rating> {
    return this.httpClient.get<Rating>(`${environment.apiUrl}/rating/user/${user._id}/book/${book._id}`);
  }

  createRating(rating: Rating) {
    console.log("A CRIAR RATING ...");
    console.log("RATING BOOK : "+rating.book.title);
    console.log("RATING USER : "+rating.user.username);
    return this.httpClient.post(`${environment.apiUrl}/ratings`, rating, this.httpOptions);
  }

  updateRating(id: string, rating: Rating) {
    const url = `${environment.apiUrl}/rating/${id}`;
    return this.httpClient.put(url, rating, this.httpOptions);
  }

}
