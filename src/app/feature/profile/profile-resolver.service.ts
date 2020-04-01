import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<any>{

  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const current = this.store.selectSnapshot(CurrentUserState)
    const uid = route.paramMap.get('uid');
    this.store.dispatch([new WLProfileActions.Set.ByID(uid), new WLProfileActions.FollowedFromDb(current.uid, uid)]);
  }
}
