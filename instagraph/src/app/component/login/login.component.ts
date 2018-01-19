import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthManagerService } from '../../services/auth-manager.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { User } from '../../metier/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private url:string = "http://localhost:8080/extended_api/auth";
  public user: any;
  //private userSubscription : Subscription; desactivation suite a pb autenth -> rapatriement code su auth service ici et donc plus besoin de se subscription

  constructor(private authService: AuthManagerService, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.user = {};
    /*this.userSubscription = this.authService.getUserAsObservable().subscribe(u=>{
      console.log("je suis bien loggué " + u.username);
    })*/
  }

  ngOnDestroy(): void {
    //this.userSubscription.unsubscribe();
  }

  tryLogin():void{
    console.log("in try login meth with " + this.user.username + " " + this.user.password);
    //this.authService.logMeIn(this.user.username, this.user.password);
    let newUser = new User(this.user.username, this.user.password, true);
    this.authService.setCurrentUser(newUser);
    this.http.post<User>(`${this.url}/login`, newUser)
                .subscribe(u=>{
                  newUser.roles = u.roles
                  console.log('je syuis bien logguer  avc ' + u.username);
                  this.router.navigateByUrl('/liste');
                });
  }

}
