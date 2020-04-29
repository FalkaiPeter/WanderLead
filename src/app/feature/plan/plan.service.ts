import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WLPlanTypes } from './plan-type';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';

@Injectable({
  providedIn: 'root'
})
export class PlanService {


  constructor(private afs: AngularFirestore, private store: Store) { }

  async load(uid: string, planId: string, isPublic: boolean = true): Promise<WLPlanTypes.DBmodel> {
    const plan = await this.afs.firestore.doc(`Plans/${uid}/${isPublic ? 'public' : 'private'}/${planId}`).get();
    return plan.exists ? plan.data() as WLPlanTypes.DBmodel : null;
  }

  async save(plan: WLPlanTypes.DBmodel, isPublic: boolean = true): Promise<string>{
    const user = this.store.selectSnapshot(CurrentUserState);
    return await (await this.afs.firestore.collection(`Plans/${user.uid}/${isPublic ? 'public' : 'private'}`).add(plan)).id;


  }
}
