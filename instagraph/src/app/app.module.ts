import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { PaginationModule } from "ngx-bootstrap";
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ImageListComponent } from './component/image-list/image-list.component';
import { TagSelectorComponent } from './component/tag-selector/tag-selector.component';

import { ImageServicesService } from './services/image-services.service';
import { TagRepositoryService } from './services/tag-repository.service';


import { FileUploadModule } from "ng2-file-upload";
import { ImageUploadComponent } from './component/image-upload/image-upload.component';

import { LightboxModule } from 'angular2-lightbox';
import { PopoverModule } from "ngx-bootstrap/";


import { NgMathPipesModule, NgStringPipesModule } from 'angular-pipes';
import { AuthManagerService } from './services/auth-manager.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoginComponent } from './component/login/login.component';
import { UserInfoComponent } from './component/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImageListComponent,
    TagSelectorComponent,
    ImageUploadComponent,
    LoginComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,FormsModule, ModalModule.forRoot(), LightboxModule,NgStringPipesModule,NgMathPipesModule,
    PaginationModule.forRoot(), FileUploadModule,ProgressbarModule.forRoot(), PopoverModule.forRoot(),
    RouterModule.forRoot([
      {path:"liste", component: ImageListComponent},
      {path:"", redirectTo:"/login",pathMatch:"full"},
      {path:"login", component: LoginComponent},
      {path:"upload", component: ImageUploadComponent},
    ])
  ],
  providers: [ImageServicesService, TagRepositoryService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi:true
    },
    AuthManagerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
