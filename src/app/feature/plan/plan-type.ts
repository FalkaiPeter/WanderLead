import { WLITodo, WLIPice } from '@wl-core/models/list-types';

export namespace WLPlanTypes {

  export namespace Place {
    export interface Place {
      id: string;
      name: string;
      address: string;
      rating: number;
      website: string;
      loc: {
        lat: number;
        lng: number;
      };
    }
    export interface Group {
      title: string;
      color: string;
      items: Place.Place[];
    }
  }

  export interface Todo {
    title: string;
    items: WLITodo[];
  }
  export interface Price {
    title: string;
    sum: number;
    items: WLIPice[];
  }
  export interface DBmodel {
    title: string;
    start: string;
    end: string;
    places: WLPlanTypes.Place.Group[];
    todos: WLPlanTypes.Todo[];
    coffer: WLPlanTypes.Todo[];
    prices: WLPlanTypes.Price[];
  }
}
