import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { AuthComponent } from "./components/auth/auth.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: AuthComponent },
  { path: "medics", component: MedicsComponent },
  { path: "profile/:userId", component: UserProfileComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
