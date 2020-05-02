import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WLPlanTypes } from './plan-type';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import {firestore} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PlanService {


  constructor(private afs: AngularFirestore, private store: Store) { }

  async load(uid: string, planId: string, isPublic: boolean = true): Promise<WLPlanTypes.DBmodel> {
    const plan = await this.afs.firestore.doc(`Plans/${uid}/${isPublic ? 'public' : 'private'}/${planId}`).get();
    return plan.exists ? plan.data() as WLPlanTypes.DBmodel : null;
  }

  async save(plan: WLPlanTypes.DBmodel, isPublic: boolean = true, id: string): Promise<string>{
    const user = this.store.selectSnapshot(CurrentUserState);
    const batch = this.afs.firestore.batch();
    const planId = id ? id : this.afs.createId();

    batch.set(
      this.afs.firestore
      .collection(`Plans/${user.uid}/${isPublic ? 'public' : 'private'}`)
      .doc(planId)
      , plan
    );
    if ( isPublic){
      batch.update(
        this.afs.firestore
        .doc(`Users/${user.uid}/other/public`),
        {plans: firestore.FieldValue.arrayUnion({name: plan.title, id: planId, start: plan.start, end: plan.end})}
      );
      batch.update(
        this.afs.firestore.doc(`Plans/${user.uid}`),
        {public: firestore.FieldValue.arrayUnion({name: plan.title, id: planId, start: plan.start, end: plan.end})}
      );
    } else {
      batch.update(
        this.afs.firestore.doc(`Plans/${user.uid}`),
        {private: firestore.FieldValue.arrayUnion({name: plan.title, id: planId, start: plan.start, end: plan.end})}
      );
    }
    return batch.commit().then(() => planId).catch((error) => {console.log(error); return null; });


  }
}
