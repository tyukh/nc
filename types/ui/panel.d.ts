declare module 'resource:///org/gnome/shell/ui/panel.js' {
  import {PanelMenu} from 'resource:///org/gnome/shell/ui/panelMenu.js';
  import St from '@girs/st-12';

  export namespace Panel {
    export class Panel extends St.Widget {
      addToStatusArea: (
        role: string,
        indicator: PanelMenu.Button,
        position: number,
        box: string
      ) => PanelMenu.Button;
    }
  }
}
