declare module 'resource:///org/gnome/shell/ui/popupMenu.js' {
  import Clutter from 'gi://Clutter';
  import St from 'gi://St';

  /** @enum {number} */
  export enum Ornament {
    NONE,
    DOT,
    CHECK,
    HIDDEN,
  }

  interface PopupBaseMenuItemConstructorProperties extends St.BoxLayout.ConstructorProperties {
    active: boolean;
    sensitive: boolean;
    activate: boolean;
  }

  export class PopupBaseMenuItem extends St.BoxLayout {
    constructor(params?: Partial<PopupBaseMenuItemConstructorProperties>);
    setOrnament(ornament: Ornament): void;
    // get actor(): Clutter.Actor;
  }

  export class PopupSeparatorMenuItem extends PopupBaseMenuItem {
    constructor(text?: string);
  }

  export class PopupMenuBase {
    connectObject(
      ...args: object[{
        signalName: string;
        handler: (actor: Clutter.Actor, event: Clutter.Event) => boolean;
      }]
    ): void;
    addMenuItem(menuItem: PopupBaseMenuItem, position?: number): void;
    toggle(): void;
    box: St.BoxLayout;
  }

  export class PopupMenu extends PopupMenuBase {
    actor: PopupMenuBase;
  }

  export class PopupSubMenu extends PopupMenuBase {}

  export class PopupSubMenuMenuItem extends PopupBaseMenuItem {
    constructor(text: string, wantIcon: boolean);
    menu: PopupSubMenu;
  }
}
