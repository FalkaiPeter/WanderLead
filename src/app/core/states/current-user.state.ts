import { State, Action, StateContext } from '@ngxs/store';
import { WlUser } from '@wl-core/models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';
import { take } from 'rxjs/operators';
import { NotificationActions } from '@wl-core/actions/notifcations.actions';
import { Injectable } from '@angular/core';


@State<WlUser.Min>({
  name: 'currentUser',
  defaults: {
    uid: '',
    displayName: '',
    photoURL: '',
  }
})
@Injectable()
export class CurrentUserState {
  constructor(private afauth: AngularFireAuth) {}


  @Action(CurrentUserActions.SetFromBackend)
  async setFromBackend(state: StateContext<WlUser.Min>) {
    const currentUser = (await this.afauth.user.pipe(take(1)).toPromise());
    if (currentUser !== null) {
      state.setState({uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL});
      state.dispatch(new NotificationActions.ListenChanges(currentUser.uid));
    }
  }

  @Action(CurrentUserActions.SetByModel)
  setByModel(state: StateContext<WlUser.Min>, { model }: CurrentUserActions.SetByModel) {
    return state.patchState({...state, uid: model.uid, displayName: model.displayName, photoURL: model.photoURL});
  }
}
