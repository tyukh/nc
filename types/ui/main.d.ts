/* main.d.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

declare module 'resource:///org/gnome/shell/ui/main.js' {
  import {Panel} from 'resource:///org/gnome/shell/ui/panel.js';

  export const panel: Panel;

  /**
   * @param {string} msg A message
   * @param {string} details Additional information
   */
  export function notify(msg: string, details: string): void;

  /**
   * See shell_global_notify_problem().
   *
   * @param {string} msg - An error message
   * @param {string} details - Additional information
   */
  export function notifyError(msg: string, details: string): void;
}
