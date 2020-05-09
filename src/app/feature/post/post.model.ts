import { WlUser } from '@wl-core/models/user.model';
import { Moment } from 'moment';
import * as moment from 'moment';
import { firestore } from 'firebase/app';
import { throwError } from 'rxjs';

export class WLPost {
  id: string;
  author: WlUser.Min;
  date: Moment;
  description: string;
  photoURLs: string[];
  followers: string[];
  comments: firestore.DocumentReference;
  likes: firestore.DocumentReference;

  constructor(
    id: string,
    author: WlUser.Min,
    date: Moment,
    description: string,
    photoURLs: string[] = [],
    followers: string[] = [],
    comments: firestore.DocumentReference = null,
    likes: firestore.DocumentReference = null,
  ) {
    this.id = id;
    this.author = author;
    this.date = date;
    this.description = description;
    this.photoURLs = photoURLs;
    this.followers = followers;
    this.comments = comments;
    this.likes = likes;
  }

  public static deserialize(data: any) {

    switch(data) {
      case data.data().id === undefined: {
        throw Error('id is undefined');
      }
      case data.data().author === undefined: {
        throw Error('author is undefined');
      }
      case data.data().date === undefined: {
        throw Error('date is undefined');
      }
      case data.data().description === undefined: {
        throw Error('description is undefined');
      }
      case data.data().photoURLs === undefined: {
        throw Error('photoURLs is undefined');
      }
      case data.data().followers === undefined: {
        throw Error('followers is undefined');
      }
      case data.data().comments === undefined: {
        throw Error('comments is undefined');
      }
      case data.data().likes === undefined: {
        throw Error('likes is undefined');
      }
    }
    return new WLPost(
      data.data().id,
      data.data().author,
      moment(data.data().date),
      data.data().description,
      data.data().photoURLs,
      data.data().followers,
      data.data().comments,
      data.data().likes
    );

  }
  public static serialize(data: WLPost) {
    return {
      id: data.id,
      author: data.author,
      date: data.date.toISOString(),
      description: data.description,
      photoURLs: data.photoURLs,
      followers: data.followers,
      comments: data.comments,
      likes: data.likes,
    };
  }

}

export interface WLComment {
  author: WlUser.Min;
  description: string;
  date: Moment;
}
