import { WlUser } from '@wl-core/models/user.model';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { UserService } from '@wl-shared/services/user/user.service';
import { CurrentUserState } from './current-user.state';

export interface ProfileStateModel {
  user: WlUser.Public;
  followers: WlUser.Min[];
  followings: WlUser.Min[];
  followed: boolean;
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    user: null,
    followers: [],
    followings: [],
    followed: null,
  }
})
export class ProfileState {

  currentUser = this.store.selectSnapshot(CurrentUserState);

  constructor(private userService: UserService, private store: Store) {
  }

  @Action(WLProfileActions.Set.ByID)
  async setByID(state: StateContext<ProfileStateModel>, { uid }: WLProfileActions.Set.ByID) {
    const user = await this.userService.setById(uid);
    return state.patchState({...state, user});
  }

  @Action(WLProfileActions.Set.ByModel)
  setByModel(state: StateContext<ProfileStateModel>, { model }: WLProfileActions.Set.ByModel) {
    return state.patchState({...state, user: model});
  }

  @Action(WLProfileActions.FollowedFromDb)
  async followedFromDb( state: StateContext<ProfileStateModel>, { currentUserID, userID}: WLProfileActions.FollowedFromDb) {
    const followed = await this.userService.isFollowed(currentUserID, userID);
    state.patchState({...state, followed});
  }

  @Action(WLProfileActions.Set.Followed)
  setFollowed( state: StateContext<ProfileStateModel>){
    const prev = state.getState().followed;
    state.patchState({...state, followed: !prev});
  }

  @Action(WLProfileActions.Followers)
  async followers(state: StateContext<ProfileStateModel>) {
    const uid = state.getState().user.uid;
    const followers = await this.userService.getUserCollection(uid, 'followers');
    state.patchState({...state, followers});
  }

  @Action(WLProfileActions.Followings)
  async followings(state: StateContext<ProfileStateModel>){
    const uid = state.getState().user.uid;
    const followings = await this.userService.getUserCollection(uid, 'followings');
    state.patchState({...state, followings});
  }


}

