import {Injector} from "@angular/core";

export interface ModalConfig {
  modalTitle: string;
  dismissButtonLabel?: string;
  closeButtonLabel?: string;
  option: {
    fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string,
    size?: 'sm' | 'lg' | 'xl' | string,
    windowClass?: string,
    injector?: Injector,
    centered?: boolean,
    backdrop?: boolean | 'static'
  },
  showHeader?: boolean;
  showFooter?: boolean;
  shouldClose?(): Promise<boolean> | boolean;
  shouldDismiss?(): Promise<boolean> | boolean;
  onClose?(): Promise<boolean> | boolean;
  onDismiss?(): Promise<boolean> | boolean;
  disableCloseButton?(): boolean;
  disableDismissButton?(): boolean;
  hideCloseButton?(): boolean;
  hideDismissButton?(): boolean;
}
