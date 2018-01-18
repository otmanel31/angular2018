import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../metier/user';
import { AuthManagerService } from '../../service/auth-manager.service';
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

  private currentUserSub: Subscription;

  constructor(private authServ: AuthManagerService, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authServ.isLoggedIn();
    this.currentUser = this.authServ.getCurrentUser();

    this.currentUserSub = this.authServ.getUserAsObservable().subscribe(u=>{
      this.isLoggedIn = u[0];
      this.currentUser = u[1];
    })
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

  logOut():boolean{
    this.authServ.logOut();
    this.router.navigateByUrl('/login');
    return false;
  }

}
