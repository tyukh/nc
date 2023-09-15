declare module 'resource:///org/gnome/shell/ui/popupMenu.js' {
  import Clutter from '@girs/clutter-12';
  import St from '@girs/st-12';

  export namespace PopupMenu {
    /** @enum {number} */
    export enum Ornament {
      NONE,
      DOT,
      CHECK,
      HIDDEN,
    }

    export class PopupBaseMenuItem extends St.BoxLayout {
      setOrnament(ornament: Ornament): void;
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
}
