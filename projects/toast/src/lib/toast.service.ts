import { Injectable, Optional } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastModel, ToastType } from './toast.model';

export type ToastPosition = "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right";

export class ToastServiceConfig {

  constructor(public position: ToastPosition = "top-right") { }

}

interface ShowOptions {
  title: string;
  message?: string;
  milliseconds?: number;
  type?: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  nextId = 1;

  toastCreation$ = new Subject<ToastModel>();
  toastDeletion$ = new Subject<number>();

  private toasts = new Map<number, ToastModel>();

  constructor(@Optional() config?: ToastServiceConfig) {
    if (config) {
      this._position = config.position;
    }
  }

  get position() {
    return this._position;
  }

  private _position: ToastPosition = "top-right";

  public show(options: ShowOptions): number {
    if (!options.milliseconds || options.milliseconds <= 1000) {
      options.milliseconds = 5000;
    }

    const id = this.nextId++;
    const toast = new ToastModel(id, true);
    toast.title = options.title;
    toast.message = options.message;
    toast.type = options.type ?? ToastType.Info;

    this.toasts.set(id, toast);

    this.toastCreation$.next(toast);

    setTimeout(
      () => this.toastDeletion$.next(id),
      options.milliseconds
    )

    return id;
  }

  public close(id: number): void {
    if (this.toasts.has(id)) {
      this.toasts.get(id)!.visible = false;
      this.toastDeletion$.next(id);
      this.toasts.delete(id);
    }
  }

}
