export interface ITodo {
  name: string;
  done: boolean;
}

export interface IPrice {
  name: string;
  price: number;
}


class GList<T> {
  private _items: T[];
  constructor(items: T[] = []) {
    this._items = items;
  }
  add(item: T) {
    this._items.push(item);
    return this._items.length;
  }
  remove(index: number) {
    const item = this._items[index];
    this._items = [
      ...this._items.slice(0, index),
      ...this._items.slice(index + 1)
    ];
    return item;
  }
  up(index: number) {
    [this._items[index - 1], this._items[index]] = [this._items[index], this._items[index - 1]];
  }
  down(index: number) {
    [this._items[index], this._items[index + 1]] = [this._items[index + 1], this._items[index]];
  }

  get items(): T[] { return this._items; }
  set items(items: T[]) { this._items = items; }

  setItem(index: number, value: T) { this._items[index] = value; }

}



export class TodoList extends GList<ITodo> {
  constructor(items?: ITodo[]) {
    super(items);
  }

  done(index: number) {
    const item = super.items[index];
    super.setItem(index, {...item, done: !item.done});
  }
  changeName(index: number, name: string) {
    super.setItem(index, {...super.items[index], name})
  }

}

export class PriceList extends GList<IPrice> {
  private _sum: number;
  constructor(items?: IPrice[]) {
    super(items);
    this._sum = items.map(item => item.price).reduce((prev, act) => prev += act);
  }
  add(item: IPrice){
    this._sum += item.price;
    return super.add(item);
  }
  remove(index: number) {
    const item = super.remove(index);
    this._sum -= item.price;
    return item;
  }
  get sum(): number { return this._sum; }
}

export class LocationList extends GList<google.maps.places.PlaceResult>{
  public color: string;
  constructor(public title: string, items?: google.maps.places.PlaceResult[]){
    super(items);
    this.color = '#' + ('000000' + Math.floor(0x1000000 * Math.random()).toString(16)).slice(-6);
  }

}
