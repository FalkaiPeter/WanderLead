import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ProfileState, ProfileStateModel } from '@wl-core/states/profile.state';
import { Observable } from 'rxjs';
import { UserService } from '@wl-shared/services/user/user.service';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { CurrentUserState } from '@wl-core/states/current-user.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  @Select() profile$: Observable<ProfileStateModel>;
  mapOpened = true;
  aboutOpened = false;
  constructor(private store: Store, private userService: UserService) {
  }

  ngOnInit() {
  }

  openMap() {
    this.mapOpened = true;
    this.aboutOpened = false;
  }
  openAbout() {
    this.mapOpened = false;
    this.aboutOpened = true;
  }

  follow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(true));

  }

  unfollow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(false));
    //this.userService.unfollow(current, user.user);
  }

}
