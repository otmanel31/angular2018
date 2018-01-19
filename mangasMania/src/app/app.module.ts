import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { MangaRepositorieService } from './service/manga-repositorie.service';

import { SearchMangaComponent } from './component/search-manga/search-manga.component';
import { ListeMangaComponent } from './component/liste-manga/liste-manga.component';
import { EditMangaComponent } from './component/edit-manga/edit-manga.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ImageUploadComponent } from './component/image-upload/image-upload.component';
import { PopoverModule, ProgressbarModule } from "ngx-bootstrap/";
import { LoginComponent } from './component/login/login.component';
import { UserInfoComponent } from './component/user-info/user-info.component';
import { AuthManagerService } from './service/auth-manager.service';
import { AuthInterceptorService } from './service/auth-interceptor.service';
import { FileUploadModule } from 'ng2-file-upload';
import { LightboxModule } from "angular2-lightbox";
import { NgStringPipesModule, NgMathPipesModule } from "angular-pipes";
import { NavbarComponent } from './component/navbar/navbar.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchMangaComponent,
    ListeMangaComponent,
    EditMangaComponent,
    ImageUploadComponent,
    LoginComponent,
    UserInfoComponent,
    NavbarComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, PaginationModule.forRoot(),BsDropdownModule.forRoot(), PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    FileUploadModule,
    LightboxModule,
    NgStringPipesModule,
    NgMathPipesModule,
    RouterModule.forRoot([
      {path:'liste', component:ListeMangaComponent},
      {path:"edit/:id", component:EditMangaComponent},
      {path:"login", component:LoginComponent},
      {path:"signup", component:SignUpComponent},
      {path:'', redirectTo:"liste", pathMatch:'full'}
    ])
  ],
  providers: [MangaRepositorieService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi:true
    },
    AuthManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
