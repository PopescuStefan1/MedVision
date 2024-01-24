import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { AuthComponent } from "./components/auth/auth.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ProfileGuard } from "./guards/profile.guard";
import { LoginauthGuard } from "./guards/loginauth.guard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "authenticate", component: AuthComponent, canActivate: [LoginauthGuard] },
  { path: "medics", component: MedicsComponent },
  { path: "profile/:userId", component: UserProfileComponent, canActivate: [ProfileGuard] },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
