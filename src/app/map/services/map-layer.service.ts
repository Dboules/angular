import { Injectable } from '@angular/core'
import Feature, { FeatureLike } from 'ol/Feature'
import Style from 'ol/style/Style'
import { Circle as CircleStyle, Fill, Icon, Stroke, Text } from 'ol/style'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Geometry, Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
@Injectable({
  providedIn: 'root',
})
export class MapLayerService {
  constructor(private http: HttpClient) {}

  createFeatureLayerStyle(features: FeatureLike, _resolution: number) {
    const size: number = features.get('features').length
    let style
    let radius
    if (size > 1) {
      if (size < 10) {
        radius = 10
      } else if (size >= 10 && size <= 50) {
        radius = size
      } else {
        radius = 50
      }
      style = new Style({
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({
            color: '#009DF599',
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      })
    } else {
      const feature = features.get('features')[0] as FeatureLike
      const properties = feature?.getProperties()
      style = new Style({
        image: new Icon({
          src: 'assets/data/vms.svg',
          anchor: [0.5, 1],
          scale: 1,
        }),
        text: new Text({
          text: properties?.['name'],
          fill: new Fill({
            color: '#000',
          }),
          stroke: new Stroke({
            color: '#000',
          }),
          offsetY: 5,
          font: 'normal 12px sans-serif',
        }),
      })
    }
    return style
  }
  getFeature(): Observable<any> {
    return this.http.get('assets/data/meteorites.csv', {
      responseType: 'text',
    })
  }
}
