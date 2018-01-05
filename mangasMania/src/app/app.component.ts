import { Component } from '@angular/core';
import { MangaRepositorieService } from './service/manga-repositorie.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { Manga } from './metier/mangas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Manga Mania --- miaawwww ..... ';

  constructor(){ 
  }
  ngOnInit(): void {
   
  }
}
