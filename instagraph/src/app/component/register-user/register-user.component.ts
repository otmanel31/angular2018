import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../services/auth-manager.service';
import { User } from '../../metier/user';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  private url: string = "http://localhost:8080/extended_api/auth"
  public user:any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.user = {};
  }

  public tryRegister():void{
    console.log("try register with " + this.user.username);
    let http: HttpParams;
    http = new HttpParams();
    http = http.set("username", this.user.username).set("password", this.user.password);
    this.http.post<User>(`${this.url}/register`, {}, { params:http})
      .subscribe(u=>{
        console.log("crzation success " + u.username)
        this.router.navigateByUrl("/login");
      }, err=>{
        console.error("fail : " + err);
      });
  }

}
