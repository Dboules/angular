import { CommonModule } from '@angular/common'
import { Component, Input, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core'
import { OverlayComponent, OverlayComponentMap, OverlayInfo, OverlayKey, OverlayProperties } from './models/overlay.model'
import { Map as OlMap, Overlay } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { Options as OverlayOptions } from 'ol/Overlay'
import { NzMessageService } from 'ng-zorro-antd/message'
@Component({
  selector: 'app-map-overlay',
  standalone: true,
  imports: [CommonModule],
  template: '<div #overlay></div>',
  styleUrl: './map-overlay.component.less',
})
export class MapOverlayComponent {
  @ViewChild('overlay', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef
  @Input() overlayInfo!: OverlayInfo
  @Input() map!: OlMap
  maxOverlayNumber = 5
  overlays = new Map();
  constructor(private msg: NzMessageService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['overlayInfo']?.currentValue) {
      this.loadOverlay(this.overlayInfo)
    }
  }
  loadOverlay({ key, overlayId, data, coordinate }: OverlayInfo) {
    if (this.overlays.has(overlayId)) {
      this.msg.warning('This overlay has already been opened!')
      return
    }
    if (this.overlays.size >= this.maxOverlayNumber) {
      this.msg.warning(`Open up to ${this.maxOverlayNumber} overlays`)
      return
    }
    const overlayComponent = OverlayComponentMap.get(key) as Type<OverlayComponent>
    // 加载overlay
    const componentRef = this.container.createComponent<OverlayComponent>(overlayComponent)
    this.generateOverlay(overlayId, key, coordinate, componentRef.location.nativeElement)
    componentRef.instance.closeOverlay.subscribe((res: any) => {
      this.removeOverlay(res)
    })
    componentRef.instance.data = data
    componentRef.instance.overlayId = overlayId
    this.map.getView().animate({ center: coordinate })
  }
  generateOverlay(id: string, key: OverlayKey, coordinate: Coordinate, element: HTMLDivElement) {
    const options = OverlayProperties.get(key) as OverlayOptions
    options.id = id
    options.element = element
    const overlay = new Overlay(options)
    overlay.setPosition(coordinate)
    this.map.addOverlay(overlay)
    this.overlays.set(id, overlay)
  }
  removeOverlay(id: string) {
    // 移除overlay
    const overlay = this.map.getOverlayById(id)
    if (overlay) {
      this.map.removeOverlay(overlay)
    }
    this.overlays.delete(id)
  }
}
