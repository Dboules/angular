import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
interface TabInterface {
  label: string,
  active: boolean
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzLayoutModule, NzIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'angular-demo'
  isCollapsed = false
  tabs: TabInterface[] = [
    { label: "Tab 1", active: true },
    { label: "Tab 2", active: false },
    { label: "Tab 3", active: false }
  ]
  selectTab(tab: TabInterface) {
    this.tabs.forEach(tab => tab.active = false)
    tab.active = true
  }
  closeTab(e: MouseEvent, tab: TabInterface) {
    e.preventDefault()
    e.stopPropagation()
    if (this.tabs.length <= 1) return

    const deletedTabIndex = this.tabs.indexOf(tab)
    this.tabs.splice(deletedTabIndex, 1)
    if(tab.active) {
      // 切换到其他标签
      this.selectTab(this.tabs[deletedTabIndex])
    }
    console.log(this.tabs);
  }
}
