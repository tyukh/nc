declare module 'resource:///org/gnome/shell/ui/panelMenu.js' {
  import {PopupMenu} from 'resource:///org/gnome/shell/ui/popupMenu.js';
  import Clutter from '@girs/clutter-12';
  import St from '@girs/st-12';

  export namespace PanelMenu {
    export class ButtonBox extends St.Widget {}

    export class Button extends ButtonBox {
      constructor(menuAlignment: number, nameText: string, dontCreateMenu?: boolean);
      add_child(child: Clutter.Actor): void;
      destroy(): void;
      menu: PopupMenu.PopupMenu;
    }
  }
}
