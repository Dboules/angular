import { CommonModule } from '@angular/common'
import { Component, Input, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core'
import { OverlayComponent, OverlayComponentMap, OverlayInfo, OverlayKey, OverlayProperties } from './models/overlay.model'
import { Map, Overlay } from 'ol'
import { Coordinate } from 'ol/coordinate'
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
  @Input() map!: Map
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes')
    if (changes['overlayInfo']?.currentValue) {
      this.loadOverlay(this.overlayInfo)
    }
  }
  loadOverlay({ key, overlayId, data, coordinate }: OverlayInfo) {
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
    const overlay = OverlayProperties.get(key)
    overlay?.set('id', id)
    overlay?.setElement(element)
    overlay?.setPosition(coordinate)
    this.map.addOverlay(overlay as Overlay)
  }
  removeOverlay(id: string) {
    // 移除overlay
    const overlay = this.map.getOverlayById(id)
    if (overlay) {
      this.map.removeOverlay(overlay)
    }
  }
}
