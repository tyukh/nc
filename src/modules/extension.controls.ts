import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Params from 'resource:///org/gnome/shell/misc/params.js';

interface NCKeyConstructorProperties extends St.Button.ConstructorProperties {
  key_id?: number;
}

export class NCKey extends St.Button {
  static {
    GObject.registerClass(
      {
        GTypeName: 'NCKey',
        Properties: {
          'key-id': GObject.ParamSpec.uint(
            'key-id',
            'keyId',
            'Id of the key button',
            GObject.ParamFlags.READWRITE,
            0,
            65535,
            0
          ),
        },
      },
      this
    );
  }

  private _keyId!: number | null;

  constructor(params?: Partial<NCKeyConstructorProperties>) {
    super(params);
  }

  get keyId(): number | null {
    if (this._keyId === undefined) this._keyId = null;
    return this._keyId;
  }

  set keyId(value: number | null) {
    if (this._keyId !== value) this._keyId = value;
  }
}

interface NCValueConstructorProperties extends St.BoxLayout.ConstructorProperties {
  value?: string;
  label?: string;
  prefix?: boolean;
}

export class NCValue extends St.BoxLayout {
  static {
    GObject.registerClass(
      {
        GTypeName: 'NCValue',
        Properties: {
          value: GObject.ParamSpec.string(
            'value',
            'value',
            'Value to display',
            GObject.ParamFlags.READWRITE,
            ''
          ),
          label: GObject.ParamSpec.string(
            'label',
            'label',
            'Label for the value',
            GObject.ParamFlags.READWRITE,
            ''
          ),
          prefix: GObject.ParamSpec.boolean(
            'prefix',
            'prefix',
            'Is label is prefix for value',
            GObject.ParamFlags.READWRITE,
            true
          ),
        },
      },
      this
    );
  }

  private _controls: {
    value: St.Label;
    label: St.Label;
  };

  constructor(params?: Partial<NCValueConstructorProperties>) {
    const parameters: Partial<NCValueConstructorProperties> = Params.parse(
      params,
      {
        vertical: false,
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.FILL,
        y_align: Clutter.ActorAlign.FILL,
        style_class: 'controls-value',
        // pack_start: false,
        value: '',
        label: '',
        prefix: false,
      },
      true
    );
    super(parameters);

    this._controls = {
      value: new St.Label({
        text: parameters.value,
        x_expand: true,
        x_align: Clutter.ActorAlign.FILL,
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'controls-value-value',
      }),

      label: new St.Label({
        text: parameters.label,
        x_align: parameters.prefix ? Clutter.ActorAlign.START : Clutter.ActorAlign.END,
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'controls-value-label',
      }),
    };

    this._controls.label.get_clutter_text().set_x_align(Clutter.ActorAlign.CENTER);

    if (parameters.prefix) {
      this.add_actor(this._controls.label);
      // this._controls.label.get_clutter_text().set_x_align(Clutter.ActorAlign.START);
      this.add_actor(
        new St.BoxLayout({
          x_align: Clutter.ActorAlign.CENTER,
          y_align: Clutter.ActorAlign.CENTER,
          style_class: 'controls-value-divider',
        })
      );
      this.add_actor(this._controls.value);
    } else {
      this.add_actor(this._controls.value);
      // this._controls.label.get_clutter_text().set_x_align(Clutter.ActorAlign.END);
      this.add_actor(
        new St.BoxLayout({
          x_align: Clutter.ActorAlign.CENTER,
          y_align: Clutter.ActorAlign.CENTER,
          style_class: 'controls-value-divider',
        })
      );
      this.add_actor(this._controls.label);
    }
  }

  get value(): string {
    return this._controls.value.get_text();
  }

  set value(text: string) {
    this._controls.value.set_text(text);
  }

  get label(): string {
    return this._controls.label.get_text();
  }

  set label(text: string) {
    this._controls.label.set_text(text);
  }
}

interface NCPlaceholderConstructorProperties extends St.BoxLayout.ConstructorProperties {
  label_right?: string;
  label_left?: string;
}

export class NCPlaceholder extends St.BoxLayout {
  static {
    GObject.registerClass(
      {
        GTypeName: 'NCPlaceholder',
        Properties: {
          'label-left': GObject.ParamSpec.string(
            'label-left',
            'labelLeft',
            'Left label text',
            GObject.ParamFlags.READWRITE,
            ''
          ),
          'label-right': GObject.ParamSpec.string(
            'label-right',
            'labelRight',
            'Label for the value',
            GObject.ParamFlags.READWRITE,
            ''
          ),
        },
      },
      this
    );
  }

  private _controls: {
    left: St.Label | null;
    right: St.Label | null;
  };

  constructor(params?: Partial<NCPlaceholderConstructorProperties>) {
    const parameters: Partial<NCPlaceholderConstructorProperties> = Params.parse(
      params,
      {
        vertical: true,
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.START,
        y_align: Clutter.ActorAlign.END,
        style_class: 'controls-placeholder',
        label_left: '',
        label_right: '',
      },
      true
    );
    super(parameters);

    const labels = new St.BoxLayout({
      vertical: false,
      x_expand: true,
      y_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.END,
      style_class: 'controls-placeholder-box',
    });

    this._controls = {
      left:
        parameters.label_left !== ''
          ? new St.Label({
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.CENTER,
              y_align: Clutter.ActorAlign.END,
              text: parameters.label_left,
              style_class: 'controls-placeholder-label-left',
            })
          : null,
      right:
        parameters.label_right !== ''
          ? new St.Label({
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.CENTER,
              y_align: Clutter.ActorAlign.END,
              text: parameters.label_right,
              style_class: 'controls-placeholder-label-right',
            })
          : null,
    };

    if (this._controls.left !== null) {
      this._controls.left.get_clutter_text().set_x_align(Clutter.ActorAlign.CENTER);
      labels.add_actor(this._controls.left);
    }
    if (this._controls.right !== null) {
      this._controls.right.get_clutter_text().set_x_align(Clutter.ActorAlign.CENTER);
      labels.add_actor(this._controls.right);
    }

    this.add_actor(labels);
  }
}
