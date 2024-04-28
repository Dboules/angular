import { CommonModule } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core'
import { MapContextMenuPosition } from '../../models/context-menu'
import { Feature } from 'ol'
import { FormsModule } from '@angular/forms'
import { OverlayInfo, OverlayKey } from '../map-overlay/models/overlay.model'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@Component({
  selector: 'app-map-context-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, NzToolTipModule],
  templateUrl: './map-context-menu.component.html',
  styleUrl: './map-context-menu.component.less',
})
export class MapContextMenuComponent {
  @ViewChild('placeholder') placeholder!: ElementRef
  @ViewChild('contextmenu') contextmenu!: ElementRef
  @Input() position!: MapContextMenuPosition
  @Input() feature!: Feature<any>
  @Output() featureClick = new EventEmitter<any>()
  contextMenuPosition!: MapContextMenuPosition
  tooltipText = ''
  ngOnChanges(changes: SimpleChanges) {
    if (changes['feature']?.currentValue) {
      this.tooltipText = this.feature.getProperties()['name']
    }
    if (this.contextMenuPosition?.display === 'block') {
      this.contextMenuPosition.display = changes['position'].currentValue.display
    }
  }
  ngAfterViewInit(): void {
    const payload = this.placeholder.nativeElement as HTMLDivElement
    payload.addEventListener('contextmenu', e => {
      e.preventDefault()
      this.contextMenuPosition = {
        left: e.clientX + 'px',
        top: e.clientY + 'px',
        display: 'block',
      }
    })
    payload.addEventListener('click', e => {
      const properties = this.feature.getProperties()
      const overlay: OverlayInfo = {
        overlayId: properties['id'],
        data: properties,
        coordinate: this.feature.getGeometry()?.getCoordinates(),
        key: OverlayKey.CUSTOM_OVERLAY,
      }
      this.featureClick.emit(overlay)
    })
  }
  onClick(v: string) {
    console.log(v)
  }
}
