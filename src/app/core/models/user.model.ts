
export namespace WlUser {
  export interface Min {
    uid: string;
    displayName: string;
    photoURL: string;
  }

  export interface Public extends Min {
    followes: number;
    followings: number;
    trips: number;
    bio: string;
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

