import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Medic } from "../models/medic";
import { Observable, map } from "rxjs";
import { medics } from "../mock-data/mockMedics";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private baseUrl = "https://licenta-fb443-default-rtdb.europe-west1.firebasedatabase.app";

  constructor(private http: HttpClient) {}

  initializeMedics() {
    const url = `${this.baseUrl}/medics.json`;
    medics.forEach((medic) => {
      this.http.post<Medic[]>(url, medic).subscribe();
    });
  }

  getAllMedics(): Observable<Medic[]> {
    const url = `${this.baseUrl}/medics.json`;
    return this.http.get<Medic[]>(url).pipe(
      map((responseData) => {
        const medicsArray: Medic[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            medicsArray.push({ ...responseData[key], id: key });
          }
        }

        return medicsArray;
      })
    );
  }
}
