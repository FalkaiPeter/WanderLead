import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { Store } from '@ngxs/store';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MyPlansResolver implements Resolve<any> {

  constructor(private afs: AngularFirestore, private store: Store) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const user = this.store.selectSnapshot(CurrentUserState);
    const r = (await this.afs.firestore.doc(`Plans/${user.uid}`).get()).data();
    r.public.forEach(plan =>{
      plan.start = moment.utc(plan.start).format('YYYY.MM.DD UTC');
      plan.end = moment.utc(plan.end).format('YYYY.MM.DD UTC');
    });
    r.private.forEach(plan =>{
      plan.start = moment.utc(plan.start).format('YYYY.MM.DD UTC');
      plan.end = moment.utc(plan.end).format('YYYY.MM.DD UTC');
    });
    return r;

  }
}
