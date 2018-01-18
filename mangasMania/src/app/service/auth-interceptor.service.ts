import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthManagerService } from './auth-manager.service';
import { Router } from '@angular/router';
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthManagerService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<
                      HttpSentEvent 
                      | HttpHeaderResponse 
                      | HttpProgressEvent 
                      | HttpResponse<any> 
                      | HttpUserEvent<any>> 
  {
    console.log("in request interceptor -- " + req.url);
    // avant l'envoie de la requete
    if (this.authService.isLoggedIn()){
      req = req.clone(
        {setHeaders:{Authorization:`Basic ${this.authService.getCredentials()}`}
      });
    } 
    // interception de la reponse en provenance du serveur et avant envoie au component
    return next.handle(req).catch((err, caught)=>{
      if (err instanceof HttpErrorResponse){
        let res:HttpErrorResponse = err;
        if (res.status == 401) this.router.navigateByUrl('/login');
      }
      return Observable.throw(err);
    });
  }
}
