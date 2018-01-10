import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { PaginationModule } from "ngx-bootstrap";
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ImageListComponent } from './component/image-list/image-list.component';
import { TagSelectorComponent } from './component/tag-selector/tag-selector.component';
import { ImageServicesService } from './services/image-services.service';

import { FileUploadModule } from "ng2-file-upload";
import { ImageUploadComponent } from './component/image-upload/image-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImageListComponent,
    TagSelectorComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,FormsModule,
    PaginationModule.forRoot(), FileUploadModule,ProgressbarModule.forRoot(),
    RouterModule.forRoot([
      {path:"liste", component: ImageListComponent},
      {path:"", redirectTo:"/liste",pathMatch:"full"},
      {path:"upload", component: ImageUploadComponent},
    ])
  ],
  providers: [ImageServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
