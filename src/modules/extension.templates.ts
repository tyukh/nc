import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {NCValue} from './extension.controls.js';

export type NCTemplateTypes =
  | PopupMenu.PopupSubMenuMenuItem
  | PopupMenu.PopupSeparatorMenuItem
  | PopupMenu.PopupBaseMenuItem
  | St.BoxLayout
  | NCValue;

export type NCTemplate = NCTemplateObjects[] | NCTemplateObjects;

export type NCTemplateObject = NCTemplatePopupSubMenuMenuItem &
  NCTemplatePopupBaseMenuItem &
  NCTemplatePopupSeparatorMenuItem &
  NCTemplateStBoxLayout &
  NCTemplateNCValue;

type NCTemplateObjects =
  | NCTemplatePopupSubMenuMenuItem
  | NCTemplatePopupBaseMenuItem
  | NCTemplatePopupSeparatorMenuItem
  | NCTemplateStBoxLayout
  | NCTemplateNCValue;

interface NCTemplatePopupSubMenuMenuItem {
  type: typeof PopupMenu.PopupSubMenuMenuItem;
  include?: Array<NCTemplateObjects> | NCTemplateObjects;
  label?: string;
  ornament?: PopupMenu.Ornament;
}

interface NCTemplatePopupBaseMenuItem {
  type: typeof PopupMenu.PopupBaseMenuItem;
  include?: Array<NCTemplateObjects> | NCTemplateObjects;
  params?: object;
  ornament?: PopupMenu.Ornament;
}

interface NCTemplatePopupSeparatorMenuItem {
  type: typeof PopupMenu.PopupSeparatorMenuItem;
}

interface NCTemplateStBoxLayout {
  type: typeof St.BoxLayout;
  params?: object;
  include?: Array<NCTemplateObjects> | NCTemplateObjects;
}

interface NCTemplateNCValue {
  type: typeof NCValue;
  params?: object;
}
