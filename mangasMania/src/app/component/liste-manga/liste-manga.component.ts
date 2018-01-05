import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Manga } from '../../metier/mangas';
import { MangaRepositorieService } from '../../service/manga-repositorie.service';

@Component({
  selector: 'app-liste-manga',
  templateUrl: './liste-manga.component.html',
  styleUrls: ['./liste-manga.component.css']
})
export class ListeMangaComponent implements OnInit {

  public mangas: Observable<Manga[]>;
  constructor(private mangaRepositorie: MangaRepositorieService) { }

  ngOnInit() {
     // jecoute la liste des mangas
     this.mangas = this.mangaRepositorie.listeMangas();
     // je demande au service de rafraichier la liste a partr du back end
     this.mangaRepositorie.refreshListe();
  }

  deleteManga(id:number):void{
    this.mangaRepositorie.delete(id)
      .then(m=>{
        console.log("manga supprimé => " + m.id)
        this.mangaRepositorie.refreshListe();
      })
      .catch(err=> console.error(err));
  }

}
