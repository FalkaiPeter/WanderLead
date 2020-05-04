import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { WLPlan } from '../plan/plan.model';
import { WLPlanTypes } from '../plan/plan-type';
import { AngularFirestore } from '@angular/fire/firestore';
import { WlUser } from '@wl-core/models/user.model';
import { firestore } from 'firebase/app';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { ProfileState } from '@wl-core/states/profile.state';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPlansComponent implements OnInit {
  data: any;
  user: WlUser.Min = this.store.selectSnapshot(CurrentUserState);



  constructor(private ar: ActivatedRoute, private store: Store, private router: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    this.data = this.ar.snapshot.data[0];
  }

  navigate(plan: WLPlan, id: string, isPublic: boolean) {
    this.router.navigate(['planning', id], {state: {data: plan.dbModel, isPublic}});
  }

  remove(plan: WLPlan, id: string, isPublic: boolean) {
    const batch = this.afs.firestore.batch();
    batch.delete(this.afs.doc(`Plans/${this.user.uid}/${isPublic ? 'public' : 'private'}/${id}`).ref);
    if (isPublic) {
      this.data.public = this.data.public.filter(plan => plan.id !== id);
      batch.update(
        this.afs.doc(`Plans/${this.user.uid}`).ref,
        {public: firestore.FieldValue.arrayRemove({id, name: plan.title, start: plan.start.toISOString(), end: plan.end.toISOString()})});
      batch.update(
        this.afs.doc(`Users/${this.user.uid}/other/public`).ref,
        {plans: firestore.FieldValue.arrayRemove({id, name: plan.title, start: plan.start.toISOString(), end: plan.end.toISOString()})});
      if (this.store.selectSnapshot(ProfileState)) {
        this.store.dispatch(new WLProfileActions.RemovePlan(id));
      }
    } else {
      this.data.private = this.data.private.filter(plan => plan.id !== id);
      batch.update(
        this.afs.doc(`Plans/${this.user.uid}`).ref,
        {private: firestore.FieldValue.arrayRemove({id, name: plan.title, start: plan.start.toISOString(), end: plan.end.toISOString()})});
    }
    batch.commit();
  }

}
