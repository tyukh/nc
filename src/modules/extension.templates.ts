import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {NCKey, NCPlaceholder, NCValue} from './extension.controls.js';

export type NCTemplate = NCTemplateObjects[] | NCTemplateObjects;

export type NCTemplateObjects =
  | NCTemplatePopupBaseMenuItem
  | NCTemplatePopupSeparatorMenuItem
  | NCTemplatePopupSubMenuMenuItem
  | NCTemplateStBoxLayout
  | NCTemplateStButton
  | NCTemplateStIcon
  | NCTemplateNCKey
  | NCTemplateNCPlaceholder
  | NCTemplateNCValue;

export type NCTemplateTypeOfs =
  | typeof PopupMenu.PopupBaseMenuItem
  | typeof PopupMenu.PopupSeparatorMenuItem
  | typeof PopupMenu.PopupSubMenuMenuItem
  | typeof St.BoxLayout
  | typeof St.Button
  | typeof St.Icon
  | typeof NCKey
  | typeof NCPlaceholder
  | typeof NCValue;

type NCTemplateSignal = {signal: string; callback: string};

interface NCTemplateGeneric<T extends NCTemplateTypeOfs> {
  type: T;
  arguments: ConstructorParameters<T>;
  prepare?: (control: InstanceType<T>) => void;
  include?: NCTemplate;
  signal?: NCTemplateSignal[];
  property?: string;
}

type NCTemplatePopupBaseMenuItem = NCTemplateGeneric<typeof PopupMenu.PopupBaseMenuItem>;
type NCTemplatePopupSeparatorMenuItem = NCTemplateGeneric<typeof PopupMenu.PopupSeparatorMenuItem>;
type NCTemplatePopupSubMenuMenuItem = NCTemplateGeneric<typeof PopupMenu.PopupSubMenuMenuItem>;
type NCTemplateStBoxLayout = NCTemplateGeneric<typeof St.BoxLayout>;
type NCTemplateStButton = NCTemplateGeneric<typeof St.Button>;
type NCTemplateStIcon = NCTemplateGeneric<typeof St.Icon>;
type NCTemplateNCKey = NCTemplateGeneric<typeof NCKey>;
type NCTemplateNCPlaceholder = NCTemplateGeneric<typeof NCPlaceholder>;
type NCTemplateNCValue = NCTemplateGeneric<typeof NCValue>;

export class NCTemplateHelper {
  private _control!: InstanceType<NCTemplateTypeOfs>;
  private _include: NCTemplate | undefined;
  private _signal: NCTemplateSignal[] | undefined;
  private _property: string | undefined;

  constructor(element: NCTemplateObjects) {
    switch (element.type) {
      case PopupMenu.PopupBaseMenuItem:
        this._control = new (element as NCTemplatePopupBaseMenuItem).type(
          ...(element as NCTemplatePopupBaseMenuItem).arguments
        );
        element.prepare &&
          (element as NCTemplatePopupBaseMenuItem).prepare!(
            this._control as PopupMenu.PopupBaseMenuItem
          );
        break;

      case PopupMenu.PopupSeparatorMenuItem:
        this._control = new (element as NCTemplatePopupSeparatorMenuItem).type(
          ...(element as NCTemplatePopupSeparatorMenuItem).arguments
        );
        element.prepare &&
          (element as NCTemplatePopupSeparatorMenuItem).prepare!(
            this._control as PopupMenu.PopupSeparatorMenuItem
          );
        break;

      case PopupMenu.PopupSubMenuMenuItem:
        this._control = new (element as NCTemplatePopupSubMenuMenuItem).type(
          ...(element as NCTemplatePopupSubMenuMenuItem).arguments
        );
        element.prepare &&
          (element as NCTemplatePopupSubMenuMenuItem).prepare!(
            this._control as PopupMenu.PopupSubMenuMenuItem
          );
        break;

      case St.BoxLayout:
        this._control = new (element as NCTemplateStBoxLayout).type(
          ...(element as NCTemplateStBoxLayout).arguments
        );
        element.prepare &&
          (element as NCTemplateStBoxLayout).prepare!(this._control as St.BoxLayout);
        break;

      case St.Button:
        this._control = new (element as NCTemplateStButton).type(
          ...(element as NCTemplateStButton).arguments
        );
        element.prepare && (element as NCTemplateStButton).prepare!(this._control as St.Button);
        break;

      case St.Icon:
        this._control = new (element as NCTemplateStIcon).type(
          ...(element as NCTemplateStIcon).arguments
        );
        element.prepare && (element as NCTemplateStIcon).prepare!(this._control as St.Icon);
        break;

      case NCKey:
        this._control = new (element as NCTemplateNCKey).type(
          ...(element as NCTemplateNCKey).arguments
        );
        element.prepare && (element as NCTemplateNCKey).prepare!(this._control as NCKey);
        break;

      case NCPlaceholder:
        this._control = new (element as NCTemplateNCPlaceholder).type(
          ...(element as NCTemplateNCPlaceholder).arguments
        );
        element.prepare &&
          (element as NCTemplateNCPlaceholder).prepare!(this._control as NCPlaceholder);
        break;

      case NCValue:
        this._control = new (element as NCTemplateNCValue).type(
          ...(element as NCTemplateNCValue).arguments
        );
        element.prepare && (element as NCTemplateNCValue).prepare!(this._control as NCValue);
        break;
    }

    this._include = element.include;
    this._signal = element.signal;
    this._property = element.property;
  }

  public get control() {
    return this._control;
  }

  public get include() {
    return this._include;
  }

  public get signal() {
    return this._signal;
  }

  public get property() {
    return this._property;
  }
}
