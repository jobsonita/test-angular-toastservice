import { Pipe, PipeTransform } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { ToastService, ToastType } from 'toast';

interface ErrorToast {
  title?: string;
  message?: string;
}

@Pipe({
  name: 'withLoading'
})
export class WithLoadingPipe implements PipeTransform {

  constructor(private toastService: ToastService) { }

  transform<T>(observable?: Observable<T>, errorToast?: ErrorToast) {
    return observable?.pipe(
      map((data) => ({ loading: false, data, error: null })),
      startWith({ loading: true, data: null, error: null }),
      catchError(error => {
        console.error(error);
        this.toastService.show({
          title: errorToast?.title ?? error.name,
          message: errorToast?.message ?? error.message,
          type: ToastType.Error
        });
        return of({ loading: false, data: null, error });
      })
    );
  }

}
