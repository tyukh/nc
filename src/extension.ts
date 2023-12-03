/* extension.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import Gio from 'gi://Gio';

import NCInterface from './modules/extension.interface.js';
import NCLogic from './modules/extension.logic.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class NCExtension extends Extension {
  private readonly _settings: Gio.Settings;

  private _font: string;
  private _position: string;
  private _order: number;

  private _interface: NCInterface | null;
  private _logic: NCLogic | null;

  private _keySignalId!: number;
  private _mantissaSignalId!: number;
  private _exponentSignalId!: number;
  private _registersSignalId!: number;

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

    this._interface = null;
    this._logic = null;

    this._settings = this.getSettings();

    this._settings.connect('changed::font', this._onExtensionSettingsChanged.bind(this));
    this._settings.connect('changed::position', this._onExtensionSettingsChanged.bind(this));
    this._settings.connect('changed::order', this._onExtensionSettingsChanged.bind(this));

    this._font = this._settings.get_string('font')!;
    this._position = this._settings.get_string('position')!;
    this._order = this._settings.get_enum('order')!;
  }

  /**
   * This function is called when your extension is enabled, which could be
   * done in GNOME Extensions, when you log in or when the screen is unlocked.
   *
   * This is when you should setup any UI for your extension, change existing
   * widgets, connect signals or modify GNOME Shell's behavior.
   */
  public enable(): void {
    this._interface = new NCInterface(this, this._font, this._position, this._order);
    if (this._logic === null) this._logic = new NCLogic();

    // Connect signals
    this._keySignalId = this._interface.connect(
      'key-signal',
      this._logic.keyHandler.bind(this._logic)
    );
    this._mantissaSignalId = this._logic.connect(
      'mantissa-signal',
      this._interface.mantissaHandler.bind(this._interface)
    );
    this._exponentSignalId = this._logic.connect(
      'exponent-signal',
      this._interface.exponentHandler.bind(this._interface)
    );
    this._registersSignalId = this._logic.connect(
      'registers-signal',
      this._interface.registersHandler.bind(this._interface)
    );

    this._logic.synchronize();
  }

  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions, when you log out or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  public disable(): void {
    if (this._interface !== null) {
      // Disconnect signals
      this._logic?.disconnect(this._mantissaSignalId);
      this._logic?.disconnect(this._exponentSignalId);
      this._logic?.disconnect(this._registersSignalId);
      this._interface.disconnect(this._keySignalId);

      this._interface.destroy();
    }
    this._interface = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onExtensionSettingsChanged(_source: this, _key: string): void {
    this._font = this._settings.get_string('font')!;
    this._position = this._settings.get_string('position')!;
    this._order = this._settings.get_enum('order')!;

    this.disable();
    this.enable();
  }
}
