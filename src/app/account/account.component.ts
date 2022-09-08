import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user!: User;

  constructor(private accountService: AccountService) {
    
    if(sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    }

   }

  ngOnInit(): void {
  }

}
