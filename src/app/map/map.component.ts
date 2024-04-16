import { Component } from '@angular/core'
import { Feature, Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { fromLonLat } from 'ol/proj'
import { Cluster, OSM } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { defaults } from 'ol/control'
import { MapLayerService } from './services/map-layer.service'
import { Geometry, Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import { Icon, Style } from 'ol/style'
import { MapContextMenuComponent, MapOverlayComponent } from './components'
import { CommonModule } from '@angular/common'
import { MapContextMenuPosition } from './models/context-menu'
import { FormsModule } from '@angular/forms'
import { OverlayInfo } from './components/map-overlay/models/overlay.model'
import { boundingExtent } from 'ol/extent'
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule, MapContextMenuComponent, MapOverlayComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.less',
})
export class MapComponent {
  map!: Map
  layer!: VectorLayer<VectorSource>
  localMarkerLayer: VectorLayer<VectorSource> = new VectorLayer({
    source: new VectorSource(),
    properties: {
      name: 'localMarkerLayer',
    },
  })
  overlayInfo!: OverlayInfo
  selectFeature: any
  contextMenuPosition!: MapContextMenuPosition
  constructor(private mapLayerService: MapLayerService) {}
  ngOnInit() {
    this.layer = new VectorLayer({
      style: (features, _resolution) => this.mapLayerService.createFeatureLayerStyle(features, _resolution),
    })
  }
  ngAfterViewInit() {
    // 创建地图实例
    this.map = new Map({
      target: 'map',
      view: new View({ center: fromLonLat([104.06, 30.67]), zoom: 4 }),
      controls: defaults(),
      layers: [new TileLayer({ source: new OSM() }), this.layer, this.localMarkerLayer],
    })
    this.registerMapEvent()
    this.renderFeatures()
  }
  registerMapEvent() {
    this.map.on('pointermove', evt => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, f => f) as Feature<any>
      if (feature) {
        const properties = feature.getProperties()
        let f
        if (properties['features']?.length === 1) {
          f = properties['features'][0]
          if (properties['name'] === 'local marker') {
            f = feature
          }
          const position = this.map.getPixelFromCoordinate(f.getGeometry()?.getCoordinates())
          this.selectFeature = f
          this.contextMenuPosition = {
            top: position[1] + 'px',
            left: position[0] + 'px',
            display: 'block',
          }
        }
      }
      if (this.map.hasFeatureAtPixel(evt.pixel)) {
        this.map.getViewport().style.cursor = 'pointer'
      } else {
        this.map.getViewport().style.cursor = 'inherit'
        this.contextMenuPosition = {
          left: 0,
          top: 0,
          display: 'none',
        }
      }
    })
    this.map.on('click', evt => {
      const features = this.map.forEachFeatureAtPixel(evt.pixel, f => f)
      if (features) {
        const clickFeatures = features.get('features')
        if (clickFeatures.length > 1) {
          const extent = boundingExtent(clickFeatures.map((r: any) => r.getGeometry().getCoordinates()))
          this.map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] })
        }
      } else {
        this.createLocalMarker(evt.coordinate)
      }
    })
  }
  renderFeatures() {
    this.mapLayerService.getFeature().subscribe(res => {
      const data = res.split('\n').map((item: string) => {
        return item.split(',')
      })
      data.shift()
      const features: Feature<Geometry>[] = []
      data.forEach((item: string[]) => {
        const _feature = new Feature({
          mass: parseFloat(item[1]) || 0,
          year: parseInt(item[2]) || 0,
          geometry: new Point(fromLonLat([parseFloat(item[4]), parseFloat(item[3])])),
          name: item[0],
        })
        features.push(_feature)
      })
      const source = new VectorSource({
        features: features,
      })
      const cluster = new Cluster({
        distance: 60,
        minDistance: 1,
        source: source,
      })
      this.layer.setSource(cluster)
    })
  }
  createLocalMarker(coordinates: Coordinate) {
    this.localMarkerLayer.setSource(null)
    const marker = new Feature({
      geometry: new Point(coordinates),
      name: 'local marker',
    })
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/marker.png',
          scale: 0.4,
        }),
      }),
    )
    const markerSource = new VectorSource({
      features: [marker],
    })
    this.localMarkerLayer.setSource(markerSource)
  }
}
