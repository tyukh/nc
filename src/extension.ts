/* extension.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import NCInterface from './modules/extension.interface.js';
import NCLogic from './modules/extension.logic.js';

export default class NCExtension extends Extension {
  private readonly _settings: Gio.Settings;

  private _interface: NCInterface | null = null;
  private _logic: NCLogic;

  private _signals = new Array<{object: GObject.Object; id: number}>();

  private _connect(
    object: GObject.Object,
    id: string,
    callback: (...args: never[]) => unknown,
    owner: object
  ): void {
    this._signals.push({object: object, id: object.connect(id, callback.bind(owner))});
  }

  private _disconnectAll(): void {
    while (this._signals.length > 0) {
      const object = this._signals.pop();
      object?.object.disconnect(object.id);
    }
  }

  /**
   * This class is constructed once when your extension is loaded, not
   * enabled. This is a good time to setup translations or anything else you
   * only do once.
   *
   * You MUST NOT make any changes to GNOME Shell, connect any signals or add
   * any event sources here.
   *
   * @param {ExtensionMeta} metadata - An extension meta object
   */
  constructor(metadata: object) {
    super(metadata);

    this._settings = this.getSettings();

    this._logic = new NCLogic();
  }

  /**
   * This function is called when your extension is enabled, which could be
   * done in GNOME Extensions, when you log in or when the screen is unlocked.
   *
   * This is when you should setup any UI for your extension, change existing
   * widgets, connect signals or modify GNOME Shell's behavior.
   */
  public enable(): void {
    this._interface = new NCInterface(this);

    // Connect signals
    this._connect(this._settings, 'changed::font', this._onFontSettingsChanged, this);
    this._connect(this._settings, 'changed::position', this._onPositionSettingsChanged, this);
    this._connect(this._settings, 'changed::order', this._onPositionSettingsChanged, this);

    this._connect(this._logic, 'mantissa-signal', this._interface.mantissaHandler, this._interface);
    this._connect(this._logic, 'exponent-signal', this._interface.exponentHandler, this._interface);
    this._connect(
      this._logic,
      'registers-signal',
      this._interface.registersHandler,
      this._interface
    );
    this._connect(this._logic, 'error-signal', this._interface.errorHandler, this._interface);

    this._connect(this._interface, 'key-signal', this._logic.keyHandler, this._logic);

    this._logic.synchronize();
    this._interface.font = this._settings.get_string('font');

    /* In here we are adding the button in the status area
     * - button is and instance of panelMenu.Button
     * - 0 is the position
     * - `right` is the box where we want our button to be displayed (left/center/right)
     */
    Main.panel.addToStatusArea(
      this.uuid,
      this._interface,
      this._settings.get_enum('order'),
      this._settings.get_string('position')
    );
  }

  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions, when you log out or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  public disable(): void {
    // Disconnect signals
    this._disconnectAll();
    this._interface?.destroy();
    this._interface = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onFontSettingsChanged(_source: this, _key: string): void {
    this._interface!.font = this._settings.get_string('font');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onPositionSettingsChanged(_source: this, _key: string): void {
    this.disable();
    this.enable();
  }
}
