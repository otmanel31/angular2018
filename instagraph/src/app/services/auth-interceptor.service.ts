import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpParams, HttpHandler, HttpSentEvent, HttpHeaderResponse, 
                  HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthManagerService } from './auth-manager.service';
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authManager: AuthManagerService, private router:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent 
                            | HttpHeaderResponse 
                            | HttpProgressEvent 
                            | HttpResponse<any> 
                            | HttpUserEvent<any>> {
    // here avant envoi d ela requete au serveur
    console.log('request intercepter ==> ' + req.url);
    if (this.authManager.isLoggedIn()){
      req = req.clone({setHeaders: {
        Authorization: `Basic ${this.authManager.getCredentials()}`
      }})
    }
    // envoie de la requete a la suite c a adire au serveur
    return next.handle(req).catch((err, caught)=>{
      // HERE INTERCEPTION DE LA RESPONSE EN PROVENANCE DU SERVEUR ET AVANT ENVOIT AU COMPONENT
      /*console.log("erreur a la response");
      console.log(err);*/
      if (err instanceof HttpErrorResponse){
        let resp: HttpErrorResponse = err;
        if (resp.status == 401){
          this.router.navigateByUrl('/login');
        }
      }
      return Observable.throw(err);
    });
    
    /*.pipe(evt => {
      // pipe c comme un map faire un traitement intermediare avant de passer a lasuite comme pipe unix
      console.log("traitement de la response");
      console.log(evt);
      return evt;
    });*/
  }

}
