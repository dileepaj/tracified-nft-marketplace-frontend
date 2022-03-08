import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './marketplace/home/home.component';
//import { FlexLayoutModule } from '@angular/flex-layout';
const routes: Routes = [
  {path: 'home', component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }