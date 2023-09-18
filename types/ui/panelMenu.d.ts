/* panelMenu.d.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

declare module 'resource:///org/gnome/shell/ui/panelMenu.js' {
  import {PopupMenu} from 'resource:///org/gnome/shell/ui/popupMenu.js';
  import Clutter from 'gi://Clutter';
  import St from 'gi://St';

  export class ButtonBox extends St.Widget {}

  export class Button extends ButtonBox {
    constructor(menuAlignment: number, nameText: string, dontCreateMenu?: boolean);
    add_child(child: Clutter.Actor): void;
    destroy(): void;
    menu: PopupMenu.PopupMenu;
  }
}
