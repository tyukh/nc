/* extension.interface.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {type NCRegisters, type NCError} from './extension.common.js';
import {NCKey, NCValue} from './extension.controls.js';

import Template from './extension.template.js';
import type * as Types from './extension.templates.js';

export default class NCInterface extends PanelMenu.Button {
  static {
    GObject.registerClass(
      {
        GTypeName: 'NCInterface',
        Signals: {
          'key-signal': {
            param_types: [GObject.TYPE_INT],
          },
        },
      },
      this
    );
  }

  private _extension: Extension;

  private _x0RegisterLabel!: NCValue;
  private _tRegisterLabel!: NCValue;
  private _zRegisterLabel!: NCValue;
  private _yRegisterLabel!: NCValue;
  private _xRegisterLabel!: NCValue;
  private _mantissaIndicatorLabel!: St.Label;
  private _exponentIndicatorLabel!: St.Label;

  constructor(extension: Extension) {
    super(0.0, _(`${extension.uuid} Indicator`));

    this._extension = extension;

    this.add_child(
      new St.Icon({
        icon_name: 'org.gnome.Calculator-symbolic',
        style_class: 'system-status-icon',
      })
    );

    this._construct();

    this.menu.actor.connectObject('key-press-event', this._onKeyboardKeyEvent.bind(this), this);
  }

  private _construct(): void {
    const iterate = (
      owner: Types.NCTemplateTypes | PopupMenu.PopupMenu | PopupMenu.PopupSubMenu,
      template: Types.NCTemplate,
      guard: number
    ): void => {
      if (guard > 100) throw new Error(_('Recursion is too deep in NCInterface._construct()'));

      const insert = (control: Types.NCTemplateTypes): void => {
        if (owner instanceof PopupMenu.PopupMenu) {
          owner.addMenuItem.call(owner, control as PopupMenu.PopupBaseMenuItem);
          return;
        }
        if (owner instanceof PopupMenu.PopupSubMenu) {
          if (control instanceof PopupMenu.PopupBaseMenuItem)
            owner.addMenuItem.call(owner, control as PopupMenu.PopupBaseMenuItem);
          else owner.box.add.call(owner.box, control);
          return;
        }

        owner.add.call(owner, control);
      };

      const create = (item: Types.NCTemplateObject): void => {
        if (item.type !== undefined) {
          let master: Types.NCTemplateTypes | PopupMenu.PopupSubMenu;

          switch (item.type) {
            case PopupMenu.PopupSubMenuMenuItem:
              {
                const control = new PopupMenu.PopupSubMenuMenuItem(item.label ?? '', false);
                item.ornament && control.setOrnament(item.ornament);
                insert(control);
                master = control.menu;
              }
              break;

            case PopupMenu.PopupSeparatorMenuItem:
              {
                const control = new PopupMenu.PopupSeparatorMenuItem();
                insert(control);
              }
              return; // Not 'include' allowed

            case PopupMenu.PopupBaseMenuItem:
              {
                const control = new PopupMenu.PopupBaseMenuItem(item.params);
                item.ornament && control.setOrnament(item.ornament);
                insert(control);
                master = control;
              }
              break;

            case St.BoxLayout:
              {
                const control = new St.BoxLayout(item.params);
                insert(control);
                master = control;
              }
              break;

            case NCValue:
              {
                const control = new NCValue(item.params);
                insert(control);
                master = control;
              }
              break;
          }

          if (item.include !== undefined) iterate(master!, item.include!, guard + 1);
        }
      };

      if (Array.isArray(template))
        template.forEach((item) => create(item as Types.NCTemplateObject));
      else create(template as Types.NCTemplateObject);
    };

    iterate(this.menu, Template(), 0);
  }

  public set font(font: string) {
    this.menu.box.get_children().forEach((item) => {
      if (item instanceof PopupMenu.PopupSubMenuMenuItem) {
        item.menu.box.set_style(`font-family: ${font}`);
        return;
      }
      if (item instanceof PopupMenu.PopupBaseMenuItem) {
        item.set_style(`font-family: ${font}`);
        return;
      }
      return;
    });
  }

  public mantissaHandler(_sender: GObject.Object, value: string): void {
    this._mantissaIndicatorLabel.set_text(value);
  }

  public exponentHandler(_sender: GObject.Object, value: string): void {
    this._exponentIndicatorLabel.set_text(value);
  }

  public registersHandler(_sender: GObject.Object, value: NCRegisters): void {
    this._xRegisterLabel.value = value.x;
    this._yRegisterLabel.value = value.y;
    this._zRegisterLabel.value = value.z;
    this._tRegisterLabel.value = value.t;
    this._x0RegisterLabel.value = value.x0;
  }

  public errorHandler(_sender: GObject.Object, value: NCError): void {
    Main.notify('Numbers Commander:', `${value.type}: "${value.message}"`);
  }

  /* private _onIndicatorSet(indicator: number, value: string): void {
      switch (indicator) {
        case Processor.Processor.Indicator.MANTISSA:
          this._mantissaIndicatorLabel.set_text(value);
          break;

        case Processor.Processor.Indicator.EXPONENT:
          this._exponentIndicatorLabel.set_text(value);
          break;

        case Processor.Processor.Indicator.REGISTER_X:
          this._xRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_Y:
          this._yRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_Z:
          this._zRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_T:
          this._tRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_X1:
          this._x1RegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.MODE:
          switch (value) {
            case Processor.Processor.Mode.NORMAL_MODE:
              break;

            case Processor.Processor.Mode.EE_MODE:
              break;

            case Processor.Processor.Mode.F_MODE:
              break;

            case Processor.Processor.Mode.K_MODE:
              break;

            case Processor.Processor.Mode.E_MODE:
              break;

            default:
              break;
          }
          break;

        default:
      }
    } */

  private _onKeyboardDispatcher(button: NCKey): void {
    // this._processor.keyPressed(button.keyId);
    this.emit('key-signal', button.keyId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onKeyboardKeyEvent(_actor: Clutter.Actor, _event: Clutter.KeyEvent): boolean {
    // let state: Clutter.ModifierType = event.get_state();
    return Clutter.EVENT_PROPAGATE; //

    /*
      // BUTTON1_MASK - the first mouse button.
      // BUTTON2_MASK - the second mouse button.
      // BUTTON3_MASK - the third mouse button.
      // BUTTON4_MASK - the fourth mouse button.
      // BUTTON5_MASK - the fifth mouse button.
      // CONTROL_MASK - the Control key.
      // HYPER_MASK - the Hyper modifier.
      // LOCK_MASK - a Lock key (depending on the modifier mapping of the X server this may either be CapsLock or ShiftLock).
      // META_MASK - the Meta modifier.
      // MOD1_MASK - normally it is the Alt key.
      // MOD2_MASK - normally it is the Numlock key.
      // MOD3_MASK - the sixth modifier key ( it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MOD4_MASK - the seventh modifier key (it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MOD5_MASK - the eighth modifier key ( it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MODIFIER_MASK - a mask covering all modifier types.
      // RELEASE_MASK - not used in GDK itself.
      // SHIFT_MASK - the Shift key.
      // SUPER_MASK - the Super modifier.
      // if user has a modifier down (except capslock, numlock, alt ...)
      // then don't handle the key press here
      state &= ~Clutter.ModifierType.LOCK_MASK;
      state &= ~Clutter.ModifierType.MOD1_MASK;
      state &= ~Clutter.ModifierType.MOD2_MASK;
      state &= ~Clutter.ModifierType.SHIFT_MASK;
      state &= Clutter.ModifierType.MODIFIER_MASK;

      // if (state) return Clutter.EVENT_PROPAGATE;
      if (state !== 0) return Clutter.EVENT_PROPAGATE;

      const symbol = event.get_key_symbol();

      // Shift + Key
      if ((event.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0) {
        switch (symbol) {
          case Clutter.KEY_KP_Subtract:
            this._processor.keyPressed(Processor.Processor.Key.SIGN);
            break;

          case Clutter.KEY_KP_Enter:
            this._processor.keyPressed(Processor.Processor.Key.SWAP);
            break;

          default:
            return Clutter.EVENT_PROPAGATE;
        }
        return Clutter.EVENT_STOP;
      }

      // Key & Numlock + Key
      switch (symbol) {
        case Clutter.KEY_KP_0:
        case Clutter.KEY_KP_Insert:
          this._processor.keyPressed(Processor.Processor.Key.ZERO);
          break;

        case Clutter.KEY_KP_1:
        case Clutter.KEY_KP_End:
          this._processor.keyPressed(Processor.Processor.Key.ONE);
          break;

        case Clutter.KEY_KP_2:
        case Clutter.KEY_KP_Down:
          this._processor.keyPressed(Processor.Processor.Key.TWO);
          break;

        case Clutter.KEY_KP_3:
        case Clutter.KEY_KP_Page_Down:
          this._processor.keyPressed(Processor.Processor.Key.THREE);
          break;

        case Clutter.KEY_KP_4:
        case Clutter.KEY_KP_Left:
          this._processor.keyPressed(Processor.Processor.Key.FOUR);
          break;

        case Clutter.KEY_KP_5:
        case Clutter.KEY_KP_Begin:
          this._processor.keyPressed(Processor.Processor.Key.FIVE);
          break;

        case Clutter.KEY_KP_6:
        case Clutter.KEY_KP_Right:
          this._processor.keyPressed(Processor.Processor.Key.SIX);
          break;

        case Clutter.KEY_KP_7:
        case Clutter.KEY_KP_Home:
          this._processor.keyPressed(Processor.Processor.Key.SEVEN);
          break;

        case Clutter.KEY_KP_8:
        case Clutter.KEY_KP_Up:
          this._processor.keyPressed(Processor.Processor.Key.EIGHT);
          break;

        case Clutter.KEY_KP_9:
        case Clutter.KEY_KP_Page_Up:
          this._processor.keyPressed(Processor.Processor.Key.NINE);
          break;

        case Clutter.KEY_KP_Decimal:
        case Clutter.KEY_KP_Delete:
          this._processor.keyPressed(Processor.Processor.Key.POINT);
          break;

        case Clutter.KEY_KP_Add:
          this._processor.keyPressed(Processor.Processor.Key.PLUS);
          break;

        case Clutter.KEY_KP_Subtract:
          this._processor.keyPressed(Processor.Processor.Key.MINUS);
          break;

        case Clutter.KEY_KP_Multiply:
          this._processor.keyPressed(Processor.Processor.Key.MULTIPLY);
          break;

        case Clutter.KEY_KP_Divide:
          this._processor.keyPressed(Processor.Processor.Key.DIVIDE);
          break;

        case Clutter.KEY_KP_Enter:
          this._processor.keyPressed(Processor.Processor.Key.PUSH);
          break;

        case Clutter.KEY_BackSpace:
          this._processor.keyPressed(Processor.Processor.Key.CLEAR_X);
          break;

        case Clutter.KEY_Alt_L:
          this._processor.keyPressed(Processor.Processor.Key.F);
          break;

        default:
          return Clutter.EVENT_PROPAGATE;
      }

      return Clutter.EVENT_STOP;
      */
  }

  private _onSettingsButtonClicked(): void {
    this.menu.toggle();
    this._extension.openPreferences();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onHelpButtonClicked(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onCopyButtonClicked(): void {}
}
