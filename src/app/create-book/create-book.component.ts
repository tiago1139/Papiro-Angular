import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BooksService } from '../services/books.service';
import { Book } from '../models/book';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  toppingList: string[] = ['Filosofia', 'Poesia', 'Clássicos', 'Contemporâneo', 
  'Estrangeiro', 'Nacional', 'Catolicismo', 'História'];

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BooksService,
    private sanitizer: DomSanitizer,
    private snack: MatSnackBar) {
    this.form = this.formBuilder.group({
      title: [null],
      author: [null],
      isbn: [null],
      categories: [null],
      cover: [null],
      rank:[null]
      
    });
   }

  ngOnInit(): void {
    this.form.controls['title'].setValue(null);
    this.form.controls['author'].setValue(null);
    this.form.controls['isbn'].setValue(null);
    this.form.controls['cover'].setValue(null);
    this.form.controls['categories'].setValue(null);
    this.form.controls['rank'].setValue(null);
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

    const formData = new FormData();
    formData.append('cover', this.file);
    formData.append('book', JSON.stringify(book));


    this.bookService.saveBook(formData)
    .subscribe(
      resp => {
        setTimeout(() => {
          this.snack.open(" Livro adicionado com Sucesso ", undefined, {duration: 4000,  panelClass: ['green-snackbar']});
          setTimeout(() => {
            location.reload();
          }, 2000);
        }, 2000);
        console.log(resp.body);
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
