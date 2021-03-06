
import { Moment } from 'moment';

export namespace WlUser {
  export interface Min {
    uid: string;
    displayName: string;
    photoURL: string;
  }

  export interface Public extends Min {
    followers: number;
    followings: number;
    trips: number;
    bio: string;
    plans: {name: string, id: string, start: string, end: string} [];
  }

  export interface Social {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedIn?: string;
  }

  export interface PrivateData {
    uid: string;
    email: string;
    phoneNumber: string;
  }

  export interface Settings {
    isPrivateProfile: boolean;
  }
}

