import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { MaterialModule } from "src/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { HttpClientModule } from "@angular/common/http";
import { CarouselComponent } from './components/home/carousel/carousel.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, HomeComponent, LoginComponent, MedicsComponent, CarouselComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
