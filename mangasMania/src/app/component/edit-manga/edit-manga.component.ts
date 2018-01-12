import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Manga } from '../../metier/mangas';
import { MangaRepositorieService } from '../../service/manga-repositorie.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-manga',
  templateUrl: './edit-manga.component.html',
  styleUrls: ['./edit-manga.component.css']
})
export class EditMangaComponent implements OnInit {

  private editedManga: Manga;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private mangaRepo: MangaRepositorieService){
    this.editedManga = new Manga(0,"", "linus", new Date, "informatique", 4, null);
  }

  ngOnInit() {
    this.editedManga = new Manga(0,"", "linus", new Date, "informatique", 4, null);
    let id;
    this.activatedRoute.params.subscribe(param=>{
      console.log(param)
      id = param.id;
      console.log("id" + id)
      if (id != 0)
        this.mangaRepo.findById(id).then(m =>{
          this.editedManga = m
          this.mangaRepo.setIdManga4Upload(this.editedManga.id);
        }).catch(err=> console.error(err));
    });
  }

  save(monForm: NgForm):void{
    console.log('in save meth');
    console.log("validité du form=> " + monForm.valid);
    console.log("form modifié => " + monForm.dirty);
    console.log(this.editedManga);
    this.mangaRepo.save(this.editedManga)
      .then(m=>{
        this.mangaRepo.setIdManga4Upload(m.id);
        this.router.navigateByUrl('/liste')
      }).catch(err=> console.error(err));

  }
}
