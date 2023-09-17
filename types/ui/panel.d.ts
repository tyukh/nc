declare module 'resource:///org/gnome/shell/ui/panel.js' {
  import {PanelMenu} from 'resource:///org/gnome/shell/ui/panelMenu.js';
  import St from 'gi://St';

  export class Panel extends St.Widget {
    addToStatusArea: (
      role: string,
      indicator: PanelMenu.Button,
      position: number,
      box: string
    ) => PanelMenu.Button;
  }
}
