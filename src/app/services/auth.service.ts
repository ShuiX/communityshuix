import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogsComponent } from '../dialogs/dialogs.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private dialog: MatDialog
  ) { }

  userFollowers = new BehaviorSubject(null);

  signInWithEmail(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmail(email: string, password: string, username: string, photoURL: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(
      val => this.afs.collection("users").doc(val.user.uid).set(
        {
          displayName: username,
          email: email,
          photoURL: photoURL,
          uid: val.user.uid,
          joined: Date.now(),
          liked: [],
          following: ["67dA5K2QKaWwPJbVx4wrF79Dii13"],
        }
      ),
    );
  }

  userData(): Observable<User> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.afs.doc<any>(`users/${user.uid}`).valueChanges().subscribe(val => this.userFollowers.next(val.following));
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUserData(uid: string): Observable<any> {
    return this.afs.collection("users").doc(uid).get();
  }

  getPosts(lastseen: number): Observable<DocumentChangeAction<any>[]> {
    if (lastseen == null) {
      return this.afs.collection("posts", ref => ref.where("createdByUID", "in", this.userFollowers.value).orderBy("postDate", "desc").limit(10)).snapshotChanges();
    } else {
      return this.afs.collection("posts", ref => ref.where("createdByUID", "in", this.userFollowers.value).orderBy("postDate", "desc").startAfter(lastseen).limit(10)).snapshotChanges();
    }
  }

  signOut(): void {
    this.afAuth.signOut()
      .catch(error => this.dialog.open(DialogsComponent, { data: { title: "Problem with Service", content: error } }))
      .finally(() => this.router.navigate(['/']));
  }

}


