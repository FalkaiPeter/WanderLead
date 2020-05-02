import { WLPLaceList, WLTodoList, WLPriceList, WLITodo, WLIPice } from '@wl-core/models/list-types';
import { PlanService } from './plan.service';
import { WLPlanTypes } from './plan-type';
import { Moment } from 'moment';
import * as moment from 'moment';

export class WLPlan {
  title: string;
  private _map: google.maps.Map;
  isPublic: boolean;
  placeGroups: WLPLaceList[];
  todoGroups: WLTodoList[];
  priceGroups: WLPriceList[];
  cofferGroups: WLTodoList[];
  start: Moment;
  end: Moment;
  dbModel: WLPlanTypes.DBmodel;

  constructor(
    private planService: PlanService,
    title: string,
    map: google.maps.Map,
    isPublic: boolean = true,
    placeGroups: WLPLaceList[] = [],
    todoGroups: WLTodoList[] = [],
    priceGroups: WLPriceList[] = [],
    cofferGroups: WLTodoList[] = [],
    start: Moment = moment(),
    end: Moment = moment(),
  ) {
      this.title = title;
      this._map = map;
      this.isPublic = isPublic;
      this.placeGroups = placeGroups;
      this.todoGroups = todoGroups;
      this.priceGroups = priceGroups;
      this.cofferGroups = cofferGroups;
      this.start = start;
      this.end = end;
  }

  save(id: string = null) {
    const places = this.placeGroups.map(group => ({color: group.color, title: group.title, items: group.items.map(item => item.place)}));
    const todos: WLPlanTypes.Todo[] = this.todoGroups.map(group => ({title: group.title, items: group.items}));
    const coffer: WLPlanTypes.Todo[] = this.cofferGroups.map(group => ({title: group.title, items: group.items}));
    const prices: WLPlanTypes.Price[] = this.priceGroups.map(group => ({title: group.title, sum: group.sum, items: group.items}));
    return this.planService
    .save(
      {
        title: this.title,
        places,
        todos,
        coffer,
        prices,
        start: this.start === null ? null : this.start.toISOString(),
        end: this.end === null ? null : this.end.toISOString()
      },
      this.isPublic,
      id);
  }

  clean() {
    this.placeGroups.forEach(group => {
      group.items.forEach(() => group.remove(0));
    });
    this.placeGroups = [];
    this.priceGroups = [];
    this.todoGroups = [];
    this.cofferGroups = [];
  }

  loadFromDbModel(model: WLPlanTypes.DBmodel, isPublic: boolean = false) {
    this.clean();

    this.dbModel = model;
    this.title = model.title;
    this.end = moment(model.end);
    this.start = moment(model.start);
    model.prices.forEach(group => this.priceGroups.push(new WLPriceList(group.title, group.items)));
    model.todos.forEach(group => this.todoGroups.push(new WLTodoList(group.title, group.items)));
    model.coffer.forEach(group => this.cofferGroups.push(new WLTodoList(group.title, group.items)));
    model.places.forEach(group => {
        const g = new WLPLaceList(
          group.title,
          new google.maps.DistanceMatrixService(),
          new google.maps.DirectionsRenderer({map: this._map, suppressMarkers: true}),
          new google.maps.DirectionsService(),
          group.color,
        );
        group.items.forEach(item => g.addPlace(item));
        this.placeGroups.push(g);
      });
    this.isPublic = isPublic;
  }

  load(uid: string, planId: string, isPublic: boolean = true) {
    this.clean();
    return this.planService.load(uid, planId, isPublic).then( result => {
      this.dbModel = result;
      this.title = result.title;
      this.end = moment(result.end);
      this.start = moment(result.start);
      result.prices.forEach(group => this.priceGroups.push(new WLPriceList(group.title, group.items)));
      result.todos.forEach(group => this.todoGroups.push(new WLTodoList(group.title, group.items)));
      result.coffer.forEach(group => this.cofferGroups.push(new WLTodoList(group.title, group.items)));
      result.places.forEach(group => {
        const g = new WLPLaceList(
          group.title,
          new google.maps.DistanceMatrixService(),
          new google.maps.DirectionsRenderer({map: this._map, suppressMarkers: true}),
          new google.maps.DirectionsService(),
          group.color,
        );
        group.items.forEach(item => g.addPlace(item));
        this.placeGroups.push(g);
      });
      this.isPublic = isPublic;
    });
  }
}
