import { TodoList, ITodo, IPrice } from '../../shared/list-types';

export namespace PlanningActions {
  export namespace todo {
    export class add {
      static readonly type = '[planning] addTodo';
      constructor(public item: ITodo) {}
    }
    export class remove {
      static readonly type = '[planning] removeTodo';
      constructor(public index: number) {}
    }
    export class done {
      static readonly type = '[planning] doneTodo';
      constructor(public index: number) {}
    }
  }
  export namespace coffer {
    export class add {
      static readonly type = '[planning] addCoffer';
      constructor(public item: ITodo) {}
    }
    export class remove {
      static readonly type = '[planning] removeCoffer';
      constructor(public index: number) {}
    }
    export class done {
      static readonly type = '[planning] doneCoffer';
      constructor(public index: number) {}
    }
  }
  export namespace prices {
    export class add {
      static readonly type = '[planning] addPrices';
      constructor(public item: IPrice) {}
    }
    export class remove {
      static readonly type = '[planning] removePrices';
      constructor(public index: number, public price: number) {}
    }
  }
  export namespace location {

    export namespace locationGroup {
      export class add {
        static readonly type = '[planning] addLocationGroup';
      }
      export class remove {
        static readonly type = '[planning] removeLocationGroup';
        constructor(public groupIndex: number) {}
      }
      export class renameGroup {
        static readonly type = '[planning] renameLocationGroup';
        constructor(public groupIndex: number, public title: string) {}
      }
      export class recolorGropup {
        static readonly type = '[planning] recolorLocationGroup';
        constructor(public groupIndex: number, public color: string) {}
      }
      export class moveUp {
        static readonly type = '[planning] moveGroupUp';
        constructor(public groupIndex: number) {}
      }
      export class moveDown {
        static readonly type = '[planning] moveGroupDown';
        constructor(public groupIndex: number) {}
      }
    }

    export namespace gruopItem {
      export class add {
        static readonly type = '[planning] addLocation';
        constructor(public groupIndex: number, public item: google.maps.places.PlaceResult) {}
      }
      export class remove {
        static readonly type = '[planning] removeLocation';
        constructor(public groupIndex: number, public itemIndex: number) {}
      }
      export class moveUp {
        static readonly type = '[planning] moveUp';
        constructor(public groupIndex: number, public itemIndex: number) {}
      }
      export class moveDown {
        static readonly type = '[planning] moveDown';
        constructor(public groupIndex: number, public itemIndex: number) {}
      }
    }
  }
}
