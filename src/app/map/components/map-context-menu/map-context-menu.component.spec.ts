import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MapContextMenuComponent } from './map-context-menu.component'

describe('MapContextMenuComponent', () => {
  let component: MapContextMenuComponent
  let fixture: ComponentFixture<MapContextMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapContextMenuComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(MapContextMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
