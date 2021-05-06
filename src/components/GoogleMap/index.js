import React from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';

import Marker from '../Marker';
import ClusterMarker from '../ClusterMarker';

import mapStyles from './mapStyles.json';
import { markersData, susolvkaCoords } from '../../fakeData';

import MapWrapper from './MapWrapper';

const MAP = {
  defaultZoom: 8,
  defaultCenter: susolvkaCoords,
  options: {
    styles: mapStyles,
    maxZoom: 19,
  },
};

export class GoogleMap extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    clusters: [],
  };

  getClusters = () => {
    const clusters = supercluster(markersData, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });
    //console.log("this.state.mapOptions", this.state.mapOptions)
    //console.log("this.state.mapOptions.zoom", this.state.mapOptions.zoom)
    return clusters(this.state.mapOptions);
  };

  createClusters = props => {
    this.setState({
      clusters: this.state.mapOptions.bounds
        ? this.getClusters(props).map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            numPoints,
            id: `${numPoints}_${points[0].id}`,
            points,
          }))
        : [],
    });
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createClusters(this.props);
      }
    );
  };

  render() {
    return (
      <MapWrapper>
        <GoogleMapReact
          defaultZoom={MAP.defaultZoom}
          defaultCenter={MAP.defaultCenter}
          options={MAP.options}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        >
          {this.state.clusters.map(item => {
            const copy = [ ...item.points ]
            const latMap = copy.map((poi) => poi.lat)
            const lngMap = copy.map((poi) => poi.lng)
            
            if (item.numPoints === 1) {
              console.log('@@@marker@@@@')
              return (
                <Marker
                  key={item.id}
                  lat={item.points[0].lat}
                  lng={item.points[0].lng}
                />
              );
            } else {
              if (this.state.mapOptions.zoom < 10 ) {
                console.log('###cluster###')
                return (
                  <ClusterMarker
                    key={item.id}
                    lat={item.lat}
                    lng={item.lng}
                    points={item.points}
                  />
                );
              } else if (this.state.mapOptions.zoom === 10 && latMap[0] === latMap[1] && lngMap[0] === lngMap[1]) {
                console.log('同じ緯度経度！')
                item.points[1] = {id: item.points[1].id, lat: item.points[1].lat + 0.00005, lng: item.points[1].lng + 0.00005}
                //console.log('item.points', item.points)
                item.points.forEach(i =>
                  {return (
                    <Marker
                    key={i.id}
                    lat={i.lat}
                    lng={i.lng}
                    />
                  )}
                )
              }
            }            
          })}
        </GoogleMapReact>
      </MapWrapper>
    );
  }
}

export default GoogleMap;
