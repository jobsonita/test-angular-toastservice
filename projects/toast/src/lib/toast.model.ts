export enum ToastType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  None = 'none',
}

export class ToastModel {
  public visible: boolean;

  public title?: string;
  public message?: string;
  public type: ToastType;
  public id: number;

  constructor(id: number, visible: boolean) {
    this.id = id;
    this.visible = visible;
    this.type = ToastType.Info;
  }
}
