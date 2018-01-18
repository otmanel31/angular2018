import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthManagerService } from '../../services/auth-manager.service';
import { User } from '../../metier/user';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {

  public isLoggedIn: boolean;
  public currentUser: User;

  private currentUserSubs: Subscription;

  constructor(private authService: AuthManagerService, private router:Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    // a chahque fois qon va recevoir un nouveau user ou un delogue, MAJ EN CONSEQUENCE
    this.currentUserSubs = this.authService.getUserAsObservable().subscribe(u=>{
      this.currentUser = u[1];
      this.isLoggedIn = u[0];
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubs.unsubscribe(); 
  }

  logMeOut():boolean{
    this.authService.logOut();
    this.router.navigateByUrl("/login")
    return false;
  }

}
