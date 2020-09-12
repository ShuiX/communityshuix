import { firestore } from 'firebase';

export interface Post {
    createdByUID: string;
    description: string;
    parentID: string;
    postID: string;
    rating: number;
    title: string;
    postDate: firestore.Timestamp;
    content: { content: string; type: string; };
}