import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from "src/environments/environment";

import { MaterialModule } from "src/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from "./components/home/home.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { CarouselComponent } from "./components/home/carousel/carousel.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthComponent } from "./components/auth/auth.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { MAT_DATE_LOCALE } from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MedicsComponent,
    CarouselComponent,
    FooterComponent,
    AuthComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
