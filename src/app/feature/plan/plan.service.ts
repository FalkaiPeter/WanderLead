import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WLPlanTypes } from './plan-type';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WlUser } from '@wl-core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  @Select() currentUser$: Observable<WlUser.Min>;

  constructor(private afs: AngularFirestore) { }

  async load(uid: string, planId: string, isPublic: boolean = true): Promise<WLPlanTypes.DBmodel> {
    const plan = await this.afs.firestore.doc(`Plans/${uid}/${isPublic ? 'public' : 'private'}/${planId}`).get();
    return plan.exists ? plan.data() as WLPlanTypes.DBmodel : null;
  }

  save(plan: WLPlanTypes.DBmodel, isPublic: boolean = true) {
    const sub = this.currentUser$.subscribe(async user =>{
      await this.afs.firestore.collection(`Plans/${user.uid}/${isPublic ? 'public' : 'private'}`).add(plan);
      sub.unsubscribe();
    })
  }
}
