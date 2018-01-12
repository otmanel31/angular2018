import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
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
import { PopoverModule } from "ngx-bootstrap/";

@NgModule({
  declarations: [
    AppComponent,
    SearchMangaComponent,
    ListeMangaComponent,
    EditMangaComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, PaginationModule.forRoot(),BsDropdownModule.forRoot(), PopoverModule.forRoot(),
    RouterModule.forRoot([
      {path:'liste', component:ListeMangaComponent},
      {path:"edit/:id", component:EditMangaComponent},
      {path:'', redirectTo:"liste", pathMatch:'full'}
    ])
  ],
  providers: [MangaRepositorieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
