import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { TodoServicesService } from './services/todo-services.service';
import { ListeTodoComponent } from './component/liste-todo/liste-todo.component';
import { EditTodoComponent } from './component/edit-todo/edit-todo.component';

import { TabsModule } from "ngx-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    ListeTodoComponent,
    EditTodoComponent,
  ],
  imports: [
  BrowserModule, FormsModule, HttpClientModule, TabsModule.forRoot(),
    RouterModule.forRoot([
      {path:"liste", component:ListeTodoComponent},
      {path:"edit/:id", component:EditTodoComponent},
      {path:"", redirectTo:"liste", pathMatch:"full"} 
    ])
  ],
  providers: [TodoServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
