import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    
    return this.httpClient.get<Category[]>(`${environment.apiUrl}/categories`)
    .pipe(tap(categories => console.log(categories)));
  }

  createCategory(category: Category) {
    console.log("A CRIAR Categoria ...");
    return this.httpClient.post(`${environment.apiUrl}/categories`, category, this.httpOptions);
  }

  async updateCategory(id: string, category: Category) {
    console.log("ID "+id);
    const url = `${environment.apiUrl}/category/${id}`;
    console.log("entrou");
     return this.httpClient.put(url, category, this.httpOptions);

  }
}
