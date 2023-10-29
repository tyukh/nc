/* extension.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import Gio from 'gi://Gio';

import NCInterface from './modules/extension.interface.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class NCExtension extends Extension {
  private readonly _settings: Gio.Settings;

  private _font: string;
  private _position: string;
  private _order: number;

  private _interface!: NCInterface | null;

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
  }

  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions, when you log out or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  public disable(): void {
    this._interface?.destroy();
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
