import { EventEmitter, Type } from '@angular/core'
import { Coordinate } from 'ol/coordinate'
import { CustomOverlayComponent } from '../custom-overlay/custom-overlay.component'
import { Overlay } from 'ol'

export enum OverlayKey {
  CUSTOM_OVERLAY = 'custom-overlay',
}
export interface OverlayBase {
  data: any
  overlayId: string // eg: ${type}-${id}
}
export interface OverlayInfo extends OverlayBase {
  key: OverlayKey
  coordinate: Coordinate
}
export interface OverlayComponent {
  data: any
  overlayId: string
  closeOverlay: EventEmitter<void>
}
export const OverlayComponentMap = new Map<OverlayKey, Type<OverlayComponent>>([[OverlayKey.CUSTOM_OVERLAY, CustomOverlayComponent]])
export const OverlayProperties = new Map<OverlayKey, Overlay>([
  [
    OverlayKey.CUSTOM_OVERLAY,
    new Overlay({
      id: undefined,
      element: undefined,
      positioning: 'bottom-center',
      autoPan: true,
    }),
  ],
])
