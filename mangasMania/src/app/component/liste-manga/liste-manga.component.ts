import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Manga } from '../../metier/mangas';
import { MangaRepositorieService } from '../../service/manga-repositorie.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-liste-manga',
  templateUrl: './liste-manga.component.html',
  styleUrls: ['./liste-manga.component.css']
})
export class ListeMangaComponent implements OnInit {

  public mangas: Subject<Manga[]>;
  public mangaSubscription: Subscription;

  public totalItems: number;
  public currentPage: number;


  constructor(private mangaRepositorie: MangaRepositorieService) { }

  ngOnInit() {
    this.mangas = new Subject();
    this.mangaSubscription = this.mangaRepositorie.listeMangas().subscribe(page=>{
      this.totalItems = page.totalElements;
      this.currentPage = page.number + 1; // pagination spring a partir de 0 mais bootsrap a partir de 1
      this.mangas.next(page.content);
    })
     // jecoute la liste des mangas OLD
     //this.mangas = this.mangaRepositorie.listeMangas();
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


  pageChanged(evt):void{
    console.log(evt);
    this.mangaRepositorie.setNoPage(evt.page - 1);  // moins 1 pour le back
  }
}
