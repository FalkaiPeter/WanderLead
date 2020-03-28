import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WlUser } from '@wl-core/models/user.model';
import { AuthenticationService } from '@wl-core/auth/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {
  @Select() currentUser$: Observable<WlUser.Min>;

  menuOpened = false;
  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
