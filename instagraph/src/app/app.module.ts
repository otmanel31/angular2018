import { BrowserModule } from '@angular/platform-browser';
// import simple aninamtion
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
import { AlertModule } from "ngx-bootstrap";


import { NgMathPipesModule, NgStringPipesModule } from 'angular-pipes';
import { AuthManagerService } from './services/auth-manager.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoginComponent } from './component/login/login.component';
import { UserInfoComponent } from './component/user-info/user-info.component';
import { RegisterUserComponent } from './component/register-user/register-user.component';
import { AlertManagerService } from './services/alert-manager.service';
import { AlertDisplayComponent } from './component/alert-display/alert-display.component';
import { ImageEditComponent } from './component/image-edit/image-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImageListComponent,
    TagSelectorComponent,
    ImageUploadComponent,
    LoginComponent,
    UserInfoComponent,
    RegisterUserComponent,
    AlertDisplayComponent,
    ImageEditComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,FormsModule, ModalModule.forRoot(), LightboxModule,NgStringPipesModule,NgMathPipesModule,
    PaginationModule.forRoot(), FileUploadModule,ProgressbarModule.forRoot(), PopoverModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot([
      {path:"liste", component: ImageListComponent},
      {path:"", redirectTo:"/liste",pathMatch:"full"},
      {path:"login", component: LoginComponent},
      {path:"register", component: RegisterUserComponent},
      {path:"upload", component: ImageUploadComponent},
      {path:"image/edit/:id", component: ImageEditComponent}
    ])
  ],
  providers: [ImageServicesService, TagRepositoryService, AlertManagerService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi:true
    },
    AuthManagerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
