import { Component, OnInit } from '@angular/core';
import { User } from '../../metier/user';
import { AuthManagerService } from '../../service/auth-manager.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private url: string = "http://localhost:8080/extended_api/auth";

  public user: any;

  constructor(private authService: AuthManagerService, private http: HttpClient, private router: Router) {
    this.user={};
  }

  ngOnInit() {
  }

  signUp():void{
    console.log(this.user)
    let http: HttpParams = new HttpParams();
    http = http.set("username",this.user.username).set("password",this.user.password);
    console.log(http)
    this.http.post<any>(`${this.url}/register`, {}, {params:http}).toPromise().
      then(u=> console.log("user register success " + u))
      .catch(err=> console.error(err))
  }

}
