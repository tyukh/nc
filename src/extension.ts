/* application.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2022 Roman Tyukh
 *
 */

'use strict';

import Gio from 'gi://Gio';

// import * as Interface from './interface';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class NCExtension extends Extension {
  private readonly _settings: Gio.Settings;

  private _font: string;
  private _launcherBox: string;
  private _launcherPosition: number;

  // private _interface!: Interface | null;

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
    this._settings.connect('changed::launcher-box', this._onExtensionSettingsChanged.bind(this));
    this._settings.connect(
      'changed::launcher-position',
      this._onExtensionSettingsChanged.bind(this)
    );

    this._font = this._settings.get_string('font')!;
    this._launcherBox = this._settings.get_string('launcher-box')!;
    this._launcherPosition = this._settings.get_enum('launcher-position')!;
  }

  /**
   * This function is called when your extension is enabled, which could be
   * done in GNOME Extensions, when you log in or when the screen is unlocked.
   *
   * This is when you should setup any UI for your extension, change existing
   * widgets, connect signals or modify GNOME Shell's behavior.
   */
  public enable(): void {
    //    this._interface = new Interface.Interface({
    //      font: this._font,
    //    });
    /* In here we are adding the button in the status area
     * - button is and instance of panelMenu.Button
     * - 0 is the position
     * - `right` is the box where we want our button to be displayed (left/center/right)
     */
    //    Main.panel?.addToStatusArea(
    //      this.uuid,
    //      this._interface.launcher!,
    //      this._launcherPosition,
    //      this._launcherBox
    //    );
  }

  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions, when you log out or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  public disable(): void {
    //    this._interface?.destroy();
    //    this._interface = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onExtensionSettingsChanged(_source: this, _key: string): void {
    this._font = this._settings.get_string('font')!;
    this._launcherBox = this._settings.get_string('launcher-box')!;
    this._launcherPosition = this._settings.get_enum('launcher-position')!;

    this.disable();
    this.enable();
  }
}
