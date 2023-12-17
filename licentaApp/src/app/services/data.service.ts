import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Medic } from "../models/medic";
import { Observable, delay, of } from "rxjs";
import { medics } from "../mock-data/mockMedics";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private baseUrl = "..";

  constructor(private http: HttpClient) {}

  getMedics(): Observable<Medic[]> {
    // const url = `${this.baseUrl}/api/medics`;
    // return this.http.get<Medic[]>(url);

    return of(medics).pipe(delay(2000));
  }
}
