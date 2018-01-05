import { Component, OnInit } from '@angular/core';
import { Todo } from '../../metier/todo';
import { Router, ActivatedRoute } from "@angular/router";
import { TodoServicesService } from '../../services/todo-services.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {

  typeFormulaire:string = "de creation ";
  nameBtn:string = "creer";

  public editedTodo: Todo;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private todoService: TodoServicesService){
  }

  ngOnInit() {
    this.editedTodo = new Todo(0,"","",0,null,null,"",false);
    let id;
    this.activatedRoute.params.subscribe(param=>{
      id = param.id;
      if (id != 0){
        this.typeFormulaire = " d' édition"
        this.nameBtn = "editer"
        this.todoService.findById(id).then(t=> this.editedTodo = t).catch(err=> console.error(err));
      }
    });
  }

  save():void{
    this.todoService.save(this.editedTodo).then(t=> this.router.navigateByUrl('/liste')).catch(err=> console.error(err));
  }
}
