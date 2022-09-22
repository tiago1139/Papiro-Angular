import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'papiro-angular';
  logged : boolean;
  admin: boolean;
  term:any;
searchService: any;

  constructor(
    private accountService: AccountService,
    searchService: SearchService
  ) 
  {
    this.searchService = searchService;
    if (sessionStorage.getItem('user')) {
      this.logged = true;
      if(sessionStorage.getItem('admin')) {
        this.admin = true;
      } else {
        this.admin = false;
      }
    } else {
      this.logged = false;
      this.admin = false;
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      this.logged = true;
    } else {
      this.logged = false;
    }
  }

  logout() {
    this.accountService.logout();
    this.logged = false;
    this.admin = false;
  }
}
