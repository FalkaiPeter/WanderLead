import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PlanningActions } from './planning.actions';
import { ITodo, IPrice } from '@wl-shared/list-types';

export interface ILocation {
  items: google.maps.places.PlaceResult[];
  title: string;
  color: string;
}




export interface PlanningStateModel {
  title: string;
  locations: ILocation[];
  prices: {
    items: IPrice[];
    sum: number;
  };
  todo: ITodo[];
  coffer: ITodo[];
  saved: boolean;
  date: {
    from: number;
    to: number;
  };
}

@State<PlanningStateModel>({
  name: 'planning',
  defaults: {
    title: 'Unsaved Trip',
    locations: [{items: [], title: 'Group 1', color: '#' + ('000000' + Math.floor(0x1000000 * Math.random()).toString(16)).slice(-6)}],
    prices: {
      items: [],
      sum: 0,
    },
    todo: [],
    coffer: [],
    saved: false,
    date: {
      from: Date.now(),
      to: Date.now(),
    }
  }
})
export class PlanningState {

  @Selector()
  static title(state: PlanningStateModel) { return state.title; }
  @Selector()
  static locations(state: PlanningStateModel) { return state.locations; }
  @Selector()
  static prices(state: PlanningStateModel) { return state.prices; }
  @Selector()
  static todo(state: PlanningStateModel) { return state.todo; }
  @Selector()
  static coffer(state: PlanningStateModel) { return state.coffer; }
  @Selector()
  static saved(state: PlanningStateModel) { return state.saved; }
  @Selector()
  static date(state: PlanningStateModel) { return state.date; }

  /* -------------------------TODO ------------------------------------*/
  @Action(PlanningActions.todo.add)
  addTodo(state: StateContext<PlanningStateModel>, {item}: PlanningActions.todo.add) {
    const todo = [...state.getState().todo, item];
    state.patchState({...state, todo});
  }
  @Action(PlanningActions.todo.remove)
  removeTodo(state: StateContext<PlanningStateModel>, {index}: PlanningActions.todo.remove) {
    const prevState = state.getState().todo;
    const todo = [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1)
    ];
    state.patchState({...state, todo});
  }
  @Action(PlanningActions.todo.done)
  doneTodo(state: StateContext<PlanningStateModel>, {index}: PlanningActions.todo.done) {
    const prevState = state.getState().todo;
    const todo = [
      ...prevState.slice(0, index),
      {name: prevState[index].name, done: !prevState[index].done},
      ...prevState.slice(index + 1)
    ];
    state.patchState({...state, todo});
  }

  /* -------------------------TODO ------------------------------------*/
  @Action(PlanningActions.coffer.add)
  addCoffer(state: StateContext<PlanningStateModel>, {item}: PlanningActions.coffer.add) {
    const coffer = [...state.getState().coffer, item];
    state.patchState({...state, coffer});
  }
  @Action(PlanningActions.coffer.remove)
  removeCoffer(state: StateContext<PlanningStateModel>, {index}: PlanningActions.coffer.remove) {
    const prevState = state.getState().coffer;
    const coffer = [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1)
    ];
    state.patchState({...state, coffer});
  }
  @Action(PlanningActions.coffer.done)
  doneCoffer(state: StateContext<PlanningStateModel>, {index}: PlanningActions.coffer.done) {
    const prevState = state.getState().coffer;
    const coffer = [
      ...prevState.slice(0, index),
      {name: prevState[index].name, done: true},
      ...prevState.slice(index + 1)
    ];
    state.patchState({...state, coffer});
  }


  /* ------------------PRICES----------------- */
  @Action(PlanningActions.prices.add)
  addPrices(state: StateContext<PlanningStateModel>, {item}: PlanningActions.prices.add) {
    const items = [...state.getState().prices.items, item];
    const sum = item.price + state.getState().prices.sum;
    state.patchState({...state, prices: {items, sum}});
  }
  @Action(PlanningActions.prices.remove)
  removePrices(state: StateContext<PlanningStateModel>, {index, price}: PlanningActions.prices.remove) {
    const prevState = state.getState().prices;
    const items = [
      ...prevState.items.slice(0, index),
      ...prevState.items.slice(index + 1)
    ];
    const sum = prevState.sum - price;
    state.patchState({...state, prices: {items, sum}});
  }

/* ----------------LOCATIONS----------------------- */
  @Action(PlanningActions.location.locationGroup.add)
  addLocationGroup(state: StateContext<PlanningStateModel>) {
    const prevState = state.getState().locations;
    const color = '#' + ('000000' + Math.floor(0x1000000 * Math.random()).toString(16)).slice(-6);
    const locations = [...prevState, {items: [], title: `Group ${prevState.length + 1}`, color}];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.locationGroup.remove)
  removeLocationGroup(state: StateContext<PlanningStateModel>, {groupIndex}: PlanningActions.location.locationGroup.remove) {
    const prevState = state.getState().locations;
    const locations = [
      ...prevState.slice(0, groupIndex),
      ...prevState.slice(groupIndex + 1)
    ];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.locationGroup.recolorGropup)
  recolorLocationGroup(state: StateContext<PlanningStateModel>, {groupIndex, color}: PlanningActions.location.locationGroup.recolorGropup) {
    const prevState = state.getState().locations;
    const locations = [
      ...prevState.slice(0, groupIndex),
      { items: prevState[groupIndex].items, title: prevState[groupIndex].title, color},
      ...prevState.slice(groupIndex + 1)
    ];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.locationGroup.renameGroup)
  renameLocationGroup(state: StateContext<PlanningStateModel>, {groupIndex, title}: PlanningActions.location.locationGroup.renameGroup) {
    const prevState = state.getState().locations;
    const locations = [
      ...prevState.slice(0, groupIndex),
      { items: prevState[groupIndex].items, title, color: prevState[groupIndex].color},
      ...prevState.slice(groupIndex + 1)
    ];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.locationGroup.moveUp)
  moveGroupUp(state: StateContext<PlanningStateModel>, {groupIndex}: PlanningActions.location.locationGroup.moveUp) {
    const prevState = state.getState().locations;
    const locations = [
      ...prevState.slice(0, groupIndex - 1),
      prevState[groupIndex],
      prevState[groupIndex - 1],
      ...prevState.slice(groupIndex + 1)
    ];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.locationGroup.moveDown)
  moveGroupDown(state: StateContext<PlanningStateModel>, {groupIndex}: PlanningActions.location.locationGroup.moveDown) {
    const prevState = state.getState().locations;
    const locations = [
      ...prevState.slice(0, groupIndex),
      prevState[groupIndex + 1],
      prevState[groupIndex],
      ...prevState.slice(groupIndex + 2)
    ];
    state.patchState({...state, locations});
  }
  @Action(PlanningActions.location.gruopItem.add)
  addLocation(state: StateContext<PlanningStateModel>, {groupIndex, item}: PlanningActions.location.gruopItem.add) {
    const prevState = state.getState().locations;
    state.patchState({
      ...state,
      locations: [
        ...prevState.slice(0, groupIndex),
        {...prevState[groupIndex], items: [...prevState[groupIndex].items, item]},
        ...prevState.slice(groupIndex + 1)
      ]
    });
  }
  @Action(PlanningActions.location.gruopItem.remove)
  removeLocation(state: StateContext<PlanningStateModel>, {groupIndex, itemIndex}: PlanningActions.location.gruopItem.remove) {
    const prevState = state.getState().locations;
    state.patchState({
      ...state,
      locations: [
        ...prevState.slice(0, groupIndex),
        {
          ...prevState[groupIndex],
          items: [
            ...prevState[groupIndex].items.slice(0, itemIndex),
            ...prevState[groupIndex].items.slice(itemIndex),
          ]
        },
        ...prevState.slice(groupIndex + 1)
      ]
    });
  }
  @Action(PlanningActions.location.gruopItem.moveUp)
  moveUp(state: StateContext<PlanningStateModel>, {groupIndex, itemIndex}: PlanningActions.location.gruopItem.moveUp) {
    const prevState = state.getState().locations;
    state.patchState({
      ...state,
      locations: [
        ...prevState.slice(0, groupIndex),
        {
          ...prevState[groupIndex],
          items: [
            ...prevState[groupIndex].items.slice(0, itemIndex - 1),
            prevState[groupIndex].items[itemIndex],
            prevState[groupIndex].items[itemIndex - 1],
            ...prevState[groupIndex].items.slice(itemIndex + 1),
          ]
        },
        ...prevState.slice(groupIndex + 1)
      ]
    });
  }
  @Action(PlanningActions.location.gruopItem.moveDown)
  moveDown(state: StateContext<PlanningStateModel>, {groupIndex, itemIndex}: PlanningActions.location.gruopItem.moveDown) {
    const prevState = state.getState().locations;
    state.patchState({
      ...state,
      locations: [
        ...prevState.slice(0, groupIndex),
        {
          ...prevState[groupIndex],
          items: [
            ...prevState[groupIndex].items.slice(0, itemIndex),
            prevState[groupIndex].items[itemIndex + 1],
            prevState[groupIndex].items[itemIndex],
            ...prevState[groupIndex].items.slice(itemIndex + 2),
          ]
        },
        ...prevState.slice(groupIndex + 1)
      ]
    });
  }
}
