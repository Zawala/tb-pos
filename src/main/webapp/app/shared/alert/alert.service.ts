import { toast } from 'frappe-ui';

export const useAlertService = () => new AlertService();

export default class AlertService {
  showInfo(toastMessage: string): void {
    toast.info(toastMessage);
  }

  showSuccess(toastMessage: string): void {
    toast.success(toastMessage);
  }

  showError(toastMessage: string): void {
    toast.error(toastMessage);
  }

  showHttpError(httpErrorResponse: any): void {
    let errorMessage: string | null = null;
    switch (httpErrorResponse.status) {
      case 0:
        errorMessage = 'Server not reachable';
        break;

      case 400: {
        const arr = Object.keys(httpErrorResponse.headers);
        for (const entry of arr) {
          if (entry.toLowerCase().endsWith('app-error')) {
            errorMessage = httpErrorResponse.headers[entry];
          }
        }
        if (!errorMessage && httpErrorResponse.data?.fieldErrors) {
          errorMessage = 'Validation error';
        } else if (!errorMessage) {
          errorMessage = httpErrorResponse.data.message;
        }
        break;
      }

      case 404:
        errorMessage = 'The page does not exist.';
        break;

      default:
        errorMessage = httpErrorResponse.data.message;
    }
    this.showError(errorMessage);
  }
}
