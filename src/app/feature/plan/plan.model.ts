import { WLPLaceGroup, WLTodoList, WLPriceList, WLITodo, WLIPice } from '@wl-core/models/list-types';
import { PlanService } from './plan.service';
import { WLPlanTypes } from './plan-type';

export class WLPlan {
  title: string;
  private _map: google.maps.Map;
  isPublic: boolean;
  placeGroups: WLPLaceGroup[];
  todoGroups: WLTodoList[];
  priceGroups: WLPriceList[];
  cofferGroups: WLTodoList[];

  constructor(
    private planService: PlanService,
    title: string,
    map: google.maps.Map,
    isPublic: boolean = true,
    placeGroups: WLPLaceGroup[] = [],
    todoGroups: WLTodoList[] = [],
    priceGroups: WLPriceList[] = [],
    cofferGroups: WLTodoList[] = [],
  ) {
      this.title = title;
      this._map = map;
      this.isPublic = isPublic;
      this.placeGroups = placeGroups;
      this.todoGroups = todoGroups;
      this.priceGroups = priceGroups;
      this.cofferGroups = cofferGroups;
  }

  save() {
    const places: WLPlanTypes.Place.Group[] = [];
    this.placeGroups.forEach(group => {
      const groupPlaces: WLPlanTypes.Place.Place[] = [];
      group.items.forEach(item => {
        groupPlaces.push({
          id: item.place.id,
          address: item.place.formatted_address,
          loc: {
            lat: item.place.geometry.location.lat(),
            lng: item.place.geometry.location.lng(),
          },
          name: item.place.name,
          rating: item.place.rating,
          website: item.place.website,
        });
      });
      places.push({color: group.color, title: group.title, items: groupPlaces});
    });

    const todos: WLPlanTypes.Todo[] = this.todoGroups.map(group => ({title: group.title, items: group.items}));
    const coffer: WLPlanTypes.Todo[] = this.cofferGroups.map(group => ({title: group.title, items: group.items}));
    const prices: WLPlanTypes.Price[] = this.priceGroups.map(group => ({title: group.title, sum: group.sum, items: group.items}));

    this.planService.save({title: this.title, places, todos, coffer, prices}, this.isPublic);





  }
}
