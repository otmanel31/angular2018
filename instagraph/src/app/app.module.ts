import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImageListComponent,
    TagSelectorComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,FormsModule, ModalModule.forRoot(), LightboxModule,NgStringPipesModule,NgMathPipesModule,
    PaginationModule.forRoot(), FileUploadModule,ProgressbarModule.forRoot(), PopoverModule.forRoot(),
    RouterModule.forRoot([
      {path:"liste", component: ImageListComponent},
      {path:"", redirectTo:"/liste",pathMatch:"full"},
      {path:"upload", component: ImageUploadComponent},
    ])
  ],
  providers: [ImageServicesService, TagRepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
