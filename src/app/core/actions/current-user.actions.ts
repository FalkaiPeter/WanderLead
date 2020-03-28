import { WlUser } from '@wl-core/models/user.model';

// tslint:disable-next-line: no-namespace
export namespace CurrentUserActions {

  export class SetFromBackend {
    static readonly type = '[CurrentUser] SetFromBackend';
  }

  export class SetByModel {
    static readonly type = '[CurrentUser] SetByModel';
    constructor(public model: WlUser.Min) {}
  }


}
