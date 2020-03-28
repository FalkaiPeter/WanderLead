import { WlNotification } from '@wl-core/models/notification.model';
import { State, Action, StateContext } from '@ngxs/store';
import { NotificationActions } from '@wl-core/actions/notifcations.actions';
import { AngularFirestore } from '@angular/fire/firestore';


export interface NotificationStateModel {
  counter: number;
  notifications: WlNotification[];
}

@State<NotificationStateModel>({
  name: 'Notifications',
  defaults: {
    counter: 0,
    notifications: [],
  }
})
export class NotificationState {
  constructor(private afs: AngularFirestore) {}


  @Action(NotificationActions.ListenChanges)
  listenChanges(state: StateContext<NotificationState>, {uid}: NotificationActions.ListenChanges) {
    this.afs.firestore.collection(`Users/${uid}/Notifications`)
    .onSnapshot( collection => {

    })
  }
}

