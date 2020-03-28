import { WlNotification } from '@wl-core/models/notification.model';
import { State, Action, StateContext } from '@ngxs/store';
import { NotificationActions } from '@wl-core/actions/notifcations.actions';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


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
    const _lastLogout = window.localStorage.getItem('last_close');
    this.afs.firestore.collection(`Users/${uid}/Notifications`)
    .onSnapshot( collection => {
      collection.docs.map(a => console.log(a.data()))
      console.log(collection.size);
    })
  }
}

