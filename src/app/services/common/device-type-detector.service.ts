import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeDetectorService {
  constructor() {}

  /**
   * Retrieves the type of the current device.
   *
   * @returns A Promise that resolves to a boolean indicating whether the device is a mobile device.
   */
  async getDeviceType(): Promise<boolean> {
    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = await regexp.test(details);
    return isMobileDevice;
  }
}
