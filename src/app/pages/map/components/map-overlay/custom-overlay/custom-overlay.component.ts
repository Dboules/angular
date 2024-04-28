import { Component, EventEmitter, Input } from '@angular/core'
import { NzIconModule } from 'ng-zorro-antd/icon'

@Component({
  selector: 'app-custom-overlay',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './custom-overlay.component.html',
  styleUrl: './custom-overlay.component.less',
})
export class CustomOverlayComponent {
  @Input() data: any
  @Input() overlayId: any
  @Input() closeOverlay = new EventEmitter<void>() // 定义一个事件发射器;
  ngOnInit(): void {
  }
}
