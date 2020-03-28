export namespace NotificationActions {

  export namespace Counter {
    export class Set {
      static readonly type = '[Notifications] SetCounter';
      constructor(public value: number) {}
    }
    export class Increment {
      static readonly type = '[Notifications] Increment';
      constructor(public value: number) {}
    }
  }

  export class ListenChanges {
    static readonly type = '[Notifications] ListenChanges';
    constructor(public uid: string) {}
  }

  export class MarkAsRead {
    static readonly type = '[Notifications] MarkAsRead';
    constructor(public notificationId: string) {}
  }

  export class MarkAllAsRead {
    static readonly type = '[Notifications] MarkAllAsRead';
  }

  export class DeleteNotification {
    static readonly type = '[Notifications] DeleteNotification';
    constructor(public notificationId: string) {}
  }


}
