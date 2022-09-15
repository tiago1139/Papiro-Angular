import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BooksService } from '../services/books.service';
import { Book } from '../models/book';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  imageUrl:any;
  file:any;
  btnState: boolean = true;
  toppings = new FormControl('');

  loading = false;

  toppingList: any;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BooksService,
    private catService: CategoryService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private snack: MatSnackBar) {

      this.catService.getAllCategories().subscribe(categories => {
        this.toppingList = categories;
      });

      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        author: new FormControl('', [Validators.required]),
        isbn: new FormControl('', [Validators.required]),
        cover: new FormControl('', [Validators.required]),
        categories: new FormControl('', [Validators.required]),
      });
   }

  ngOnInit(): void {

  }

  onChange(event:any) {
    this.btnState = false;
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result; 
        console.log(this.imageUrl);
        
      };
    }

  }

  onSubmit() {
    this.loading = true;
    this.form.disable();
    const book = {} as Book
    book.title = this.form.get('title')?.value;
    book.author = this.form.get('author')?.value;
    book.isbn = this.form.get('isbn')?.value;
    let categorias:Category[] = this.form.get('categories')?.value;

    const formData = new FormData();
    formData.append('cover', this.file);
    formData.append('book', JSON.stringify(book));


    this.bookService.saveBook(formData)
    .subscribe(
      async resp => {
        console.log(resp.body);
        console.log(categorias.length);
        for (const cat of categorias) {
          cat.books.push(resp.body as Book);
          let resposta = await (await this.catService.updateCategory(cat._id, cat)).toPromise();
          console.log(resposta);
          console.log("Categoria: "+cat.name);
        }
        
        setTimeout(() => {
          this.snack.open(" Livro adicionado com Sucesso ", undefined, {duration: 4000,  panelClass: ['green-snackbar']});
          setTimeout(() => {
            this.router.navigate(['/book/'+(resp.body as Book)._id]);
          }, 2000);
        }, 2000);
        
      },
      err => {
        setTimeout(() => {
          this.loading = false;
          this.form.enable();
          this.snack.open("Falha ao adicionar Livro !", undefined, {duration: 4000,  panelClass: ['red-snackbar']});

        }, 2000);
        console.log(err);
 
      });
    /*
    this.bookService.storeImage(form)
    .subscribe(res => {
      this.bookService.saveBook(this.form.value)
      .subscribe(result => {
        console.log("Salvo com Sucesso");
        console.log(this.form.value);},
        error => {
          console.log("ERROOOOO");
          console.log(this.form.value);}
      );
    });
    */
    
  }

}
