import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import { MangaRepositorieService } from '../../service/manga-repositorie.service';

@Component({
  selector: 'app-search-manga',
  templateUrl: './search-manga.component.html',
  styleUrls: ['./search-manga.component.css']
})
export class SearchMangaComponent implements OnInit {

  searchTerm: string = "";
  // construit un tableau de 0 a 5
  public ratingRange: number[] = Array.from({length:5}, (value, key)=>key+1);
  public currentRating: number;


  private searchTermRalentisseur: Subject<string>;

  constructor(private mangaRepositorie: MangaRepositorieService) {
    this.searchTermRalentisseur = new Subject();

  }

  ngOnInit() {
    // ici on dit la valeur qu'on accepte de recevoir
    // ce code la est appelé a chaque fois q"un next est fait sur la valeur 
    this.currentRating = 0; // si current rating == 0 pas de filtrage par rating
    this.searchTermRalentisseur.asObservable()
      .debounceTime(2000)
      .subscribe(newTerm =>{
        console.log(newTerm);
        this.mangaRepositorie.changeSearch(newTerm);
      })

  }

  changeTerm(evt):void{
    //console.log(evt);
    this.searchTermRalentisseur.next(evt); // je publie la valeur ds le flux ou le stream .... 
    this.searchTerm = evt;

  }

  setRatingMin(rating):boolean{
    console.log('change rating => ' + rating);
    if (rating != this.currentRating) this.mangaRepositorie.setFilterByRatingMin(rating);
    this.currentRating = rating;
    return false; // on ne suit pas le lien ( href ds le html)
  }


}
