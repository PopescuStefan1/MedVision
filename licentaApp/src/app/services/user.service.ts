import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { MedicService } from './medic.service';
import { Medic } from '../models/medic';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private asdf = 'simp';

  constructor(
    private firestore: AngularFirestore,
    private medicService: MedicService
  ) {}

  getUserData(docId: string): Observable<UserProfile> {
    const userDocRef = this.firestore.collection('users').doc(docId);

    return userDocRef
      .valueChanges()
      .pipe(map((data) => (data ? this.convertTimestampsToDates(data) : data)));
  }

  updateUserData(userId: string, userData: any): Observable<void> {
    const userDocRef = this.firestore.collection('users').doc(userId);

    if (this.getUserRole(userData.role).toLowerCase() === 'medic') {
      return this.medicService.getMedicByUserId(userId).pipe(
        tap((medic) => {
          if (medic === null) {
            const medicProfile: Medic = {
              userId: userId,
              email: '',
              firstName: '',
              lastName: '',
              city: '',
              isVisible: false,
              phoneNumber: '',
              shortTitle: '',
              specialty: '',
              title: '',
            };

            const collectionRef = this.firestore.collection('medics');
            from(collectionRef.add(medicProfile));
          }
        }),
        switchMap(() => from(userDocRef.update(userData)))
      );
    } else {
      return from(userDocRef.update(userData));
    }
  }

  getUserRole(encRole: any): string {
    return this.xorEncryptDecrypt(decodeURIComponent(encRole), this.asdf);
  }

  private xorEncryptDecrypt(data: any, key: any) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  private convertTimestampsToDates(data: any): any {
    if (data.hasOwnProperty('dateOfBirth')) {
      data.dateOfBirth = data.dateOfBirth.toDate();
    }

    return data;
  }
}
