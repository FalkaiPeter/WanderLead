import { WlUser } from '@wl-core/models/user.model';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { UserService } from '@wl-shared/services/user/user.service';
import { CurrentUserState } from './current-user.state';
import * as moment from 'moment';

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

  constructor(private userService: UserService, private store: Store) {
  }

  @Action(WLProfileActions.Set.ByID)
  async setByID(state: StateContext<ProfileStateModel>, { uid }: WLProfileActions.Set.ByID) {
    const user = await this.userService.setById(uid);
    user.plans.forEach(plan =>{
      plan.start = moment.utc(plan.start).format('YYYY.MM.DD UTC');
      plan.end = moment.utc(plan.end).format('YYYY.MM.DD UTC');
    })
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
  async byValue( state: StateContext<ProfileStateModel>, { value }: WLProfileActions.Set.Followed) {
    const currentUser = this.store.selectSnapshot(CurrentUserState);
    const stateUser = state.getState().user;
    const user = {uid: stateUser.uid, displayName: stateUser.displayName, photoURL: stateUser.photoURL};
    value ? await this.userService.follow(currentUser, user) : await this.userService.unfollow(currentUser, user);
    return state.patchState({...state, followed: value});

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

  @Action(WLProfileActions.AddPlan)
  addPlan(state: StateContext<ProfileStateModel>, {id, name, start, end}: WLProfileActions.AddPlan) {
    const plans = [state.getState().user.plans, {id, name, start, end}];

    return state.patchState({...state, user: {...state.getState().user, plans: [...state.getState().user.plans, {id, name, start, end}]}});
  }
  @Action(WLProfileActions.RemovePlan)
  removePlan(state: StateContext<ProfileStateModel>, {id}: WLProfileActions.RemovePlan) {
    const plans = state.getState().user.plans.filter(plan => plan.id !== id);
    return state.patchState({...state, user: {...state.getState().user, plans}});
  }


}

