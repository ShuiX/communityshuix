import { firestore } from 'firebase';

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    following?: [];
    liked?: [];
    joined: number;
  }