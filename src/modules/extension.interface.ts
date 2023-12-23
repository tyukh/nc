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

import {type NCRegisters, type NCError, NCOpCodes} from './extension.common.js';
import {NCKey, NCValue} from './extension.controls.js';
import {NCTemplateInstance, NCKeys} from './extension.template.js';
import {
  type NCTemplate,
  type NCTemplateObjects,
  type NCTemplateTypeOfs,
  NCTemplateHelper,
} from './extension.templates.js';

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

  private _mapKeyOpCodes: Map<NCKeys, NCOpCodes> = new Map<NCKeys, NCOpCodes>([
    [NCKeys.ZERO, NCOpCodes.ZERO],
    [NCKeys.ONE, NCOpCodes.ONE],
    [NCKeys.TWO, NCOpCodes.TWO],
    [NCKeys.THREE, NCOpCodes.THREE],
    [NCKeys.FOUR, NCOpCodes.FOUR],
    [NCKeys.FIVE, NCOpCodes.FIVE],
    [NCKeys.SIX, NCOpCodes.SIX],
    [NCKeys.SEVEN, NCOpCodes.SEVEN],
    [NCKeys.EIGHT, NCOpCodes.EIGHT],
    [NCKeys.NINE, NCOpCodes.NINE],
    [NCKeys.POINT, NCOpCodes.POINT],
    [NCKeys.SIGN, NCOpCodes.SIGN],
    [NCKeys.ENTER_E, NCOpCodes.ENTER_E],
    [NCKeys.PUSH, NCOpCodes.PUSH],
    [NCKeys.SWAP, NCOpCodes.SWAP],
    [NCKeys.CLEAR_X, NCOpCodes.CLEAR_X],
    [NCKeys.BACK_X, NCOpCodes.BACK_X],
    [NCKeys.PLUS, NCOpCodes.PLUS],
    [NCKeys.MINUS, NCOpCodes.MINUS],
    [NCKeys.MULTIPLY, NCOpCodes.MULTIPLY],
    [NCKeys.DIVIDE, NCOpCodes.DIVIDE],
    [NCKeys.F, NCOpCodes.RESERVED_NULL],
    [NCKeys.K, NCOpCodes.RESERVED_NULL],
    [NCKeys.MX, NCOpCodes.RESERVED_NULL],
    [NCKeys.XM, NCOpCodes.RESERVED_NULL],
    [NCKeys.RESERVED_NULL, NCOpCodes.RESERVED_NULL],
  ]);

  private _registerX0: NCValue | null = null;
  private _registerX: NCValue | null = null;
  private _registerY: NCValue | null = null;
  private _registerZ: NCValue | null = null;
  private _registerT: NCValue | null = null;

  private _mantissaIndicatorLabel: St.Label | null = null;
  private _exponentIndicatorLabel: St.Label | null = null;

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
      parent: InstanceType<NCTemplateTypeOfs> | PopupMenu.PopupMenu,
      template: NCTemplate,
      guard: number
    ): void => {
      if (guard > 100) throw new Error(_('Recursion is too deep in NCInterface._construct()'));

      const create = (element: NCTemplateObjects): void => {
        const helper = new NCTemplateHelper(element);

        if (parent instanceof PopupMenu.PopupMenu)
          parent.addMenuItem.call(parent, helper.control as PopupMenu.PopupBaseMenuItem);
        else if (parent instanceof PopupMenu.PopupSubMenuMenuItem)
          if (helper.control instanceof PopupMenu.PopupBaseMenuItem)
            parent.menu.addMenuItem.call(
              parent.menu,
              helper.control as PopupMenu.PopupBaseMenuItem
            );
          else parent.menu.box.add.call(parent.menu.box, helper.control);
        else parent.add_actor.call(parent, helper.control);

        if (helper.property) {
          const property = this[helper.property as keyof NCInterface];
          if (typeof property === typeof helper.control)
            (this[helper.property as keyof NCInterface] as typeof property) = helper.control;
        }

        if (helper.signal)
          helper.signal.forEach((signal) => {
            typeof this[signal.callback as keyof NCInterface] === 'function' &&
              helper.control.connect(
                signal.signal,
                // eslint-disable-next-line @typescript-eslint/ban-types
                (this[signal.callback as keyof NCInterface] as Function).bind(this)
              );
          });

        if (helper.include) iterate(helper.control, helper.include, guard + 1);
      };

      if (Array.isArray(template)) template.forEach((element) => create(element));
      else create(template);
    };

    iterate(this.menu, NCTemplateInstance(), 0);
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
    this._mantissaIndicatorLabel && this._mantissaIndicatorLabel.set_text(value);
  }

  public exponentHandler(_sender: GObject.Object, value: string): void {
    this._exponentIndicatorLabel && this._exponentIndicatorLabel.set_text(value);
  }

  public registersHandler(_sender: GObject.Object, value: NCRegisters): void {
    this._registerX && (this._registerX.value = value.x);
    this._registerY && (this._registerY.value = value.y);
    this._registerZ && (this._registerZ.value = value.z);
    this._registerT && (this._registerT.value = value.t);
    this._registerX0 && (this._registerX0.value = value.x0);
  }

  public errorHandler(_sender: GObject.Object, value: NCError): void {
    Main.notify('Numbers Commander:', `${value.type}: "${value.message}"`);
  }

  private _onKeyboardDispatcher(key: NCKey): void {
    this.emit(
      'key-signal',
      this._mapKeyOpCodes.get(key.keyId ?? NCKeys.RESERVED_NULL) ?? NCOpCodes.RESERVED_NULL
    );
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
  private _onInfoButtonClicked(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onCopyButtonClicked(): void {}
}
