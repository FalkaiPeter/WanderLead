import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { WLPlan } from '../plan/plan.model';
import { WLPlanTypes } from '../plan/plan-type';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPlansComponent implements OnInit {
  data: any;
  user = this.store.selectSnapshot(CurrentUserState);



  constructor(private ar: ActivatedRoute, private store: Store, private router: Router) { }

  ngOnInit() {
    this.data = this.ar.snapshot.data[0];
    console.log(this.ar.snapshot.data);
  }

  navigate(plan: WLPlan, id: string, isPublic: boolean) {
    console.log(plan)
    this.router.navigate(['planning', id], {state: {data: plan.dbModel, isPublic}});
  }

}
