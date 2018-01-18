import { Component, OnInit } from '@angular/core';
import { User } from '../../metier/user';
import { AuthManagerService } from '../../service/auth-manager.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private url: string = "http://localhost:8080/extended_api/auth";

  public user: User;


  constructor(private authService: AuthManagerService, private http: HttpClient, private router: Router) {
    this.user = new User(0,"","");
  }

  ngOnInit() {
    //this.user = null;
  }

  tryLogin():void{
    console.log("in login meth with "+this.user.username + ". Pswd= " + this.user.password)
    this.authService.setCurrentUser(this.user);
    this.http.post<User>(`${this.url}/login`, this.user)
      .subscribe(u=>{
        console.log(' je suis bien logger avc le user '+ u.username)
        this.router.navigateByUrl('/liste')
      });
  }

}
