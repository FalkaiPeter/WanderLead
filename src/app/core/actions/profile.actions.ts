import { WlUser } from '@wl-core/models/user.model';

export namespace WLProfileActions {

  export namespace Set {

    export class ByID {
      static readonly type = '[profile] byID';
      constructor(public uid: string) {}
    }
    export class ByModel {
      static readonly type = '[profile] byModel';
      constructor(public model: WlUser.Public) {}
    }

    export class Followed {
      static readonly type = '[profile] byValue';
      constructor(public value: boolean) {}
    }

  }

  export class Follow {
    static readonly type = '[profile] follow';
  }

  export class FollowedFromDb {
    static readonly type = '[profile] followedByValue';
    constructor(public currentUserID: string, public userID: string) {}
  }

  export class Followers {
    static readonly type = '[profile] followers';
  }
  export class Followings {
    static readonly type = '[profile] followings';
  }

}
