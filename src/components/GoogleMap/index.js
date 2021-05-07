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
    console.log("this.state.mapOptions.zoom", this.state.mapOptions.zoom)
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
              //console.log('Marker', <Marker
              //      key={item.id}
              //      lat={item.points[0].lat}
              //      lng={item.points[0].lng}
              //      />)
              return (
                <Marker
                  key={item.id}
                  lat={item.points[0].lat}
                  lng={item.points[0].lng}
                />
              );
            } else if (latMap[0] === latMap[1] && lngMap[0] === lngMap[1]) {
                //console.log('同じ緯度経度！')
                if (this.state.mapOptions.zoom < 10) {
                  console.log('###同じ緯度経度のcluster###')
                  return (
                    <ClusterMarker
                      key={item.id}
                      lat={item.lat}
                      lng={item.lng}
                      points={item.points}
                    />
                  );
                } else {
                  console.log('@@@@@同じ緯度経度のmarker@@@@@')
                  //console.log('item', item)
                  item.points[1] = {id: item.points[1].id, lat: item.points[1].lat + 0.5, lng: item.points[1].lng + 0.5}
                  console.log('item.points[0].id', item.points[0].id)

                  // マーカー一つしか返されない
                  //for (let i of item.points) {
                  //  //console.log('item.points', item.points)
                  //  //console.log('i', i)
                  //  return (
                  //    <Marker
                  //      key={i.id}
                  //      lat={i.lat}
                  //      lng={i.lng}
                  //    />
                  //  )
                  //}


                  // returnでマーカー二つ返せるかやってみたが、エラー
                  //return(
                  //  <>
                  //    <Marker
                  //      key={item.id}
                  //      lat={item.points[0].lat}
                  //      lng={item.points[0].lng}
                  //    />
                  //    <Marker
                  //      key={item.points[1].id}
                  //      lat={item.points[1].lat}
                  //      lng={item.points[1].lng}
                  //    />
                  //  </>
                  //)


                  // 配列の一つ目しかマーカー表示されない
                  const markersArray = item.points.map(i =>
                   <Marker
                     key={i.id}
                     lat={i.lat}
                     lng={i.lng}
                   />
                  )             
                  console.log('markersArray', markersArray)     
                  return (markersArray[0])


                  // forEachの返り値はundefined
                  //item.points.forEach(i => 
                    //console.log('marker', <Marker key={i.id} lat={i.lat} lng={i.lng}/>
                    //{return (
                    //<Marker
                    //  key={i.id}
                    //  lat={i.lat}
                    //  lng={i.lng}
                    ///>)}
                  //)


                  // こういうことではなかった
                  //for (let it of item.points) {
                  //    console.log('外')
                  //  for (let i = 0; i <= item.numPoints; i++ ) {
                  //    console.log(i + '回目のループin')
                  //    return (
                  //      <Marker
                  //        key={it.id}
                  //        lat={it.lat}
                  //        lng={it.lng}
                  //      />
                  //    )
                  //  }
                  //}          


                  // points分、マーカーを作成するまでループしたい
                  // こういうことでもなかった
                  //  let count = 0
                  //  for (let i of item.points) {
                  //    console.log('item.numPoints', item.numPoints)
                  //    while (count <= item.numPoints) {
                  //      count ++;
                  //      console.log('count', count)
                  //      return (<Marker
                  //        key={i.id}
                  //        lat={i.lat}
                  //        lng={i.lng}
                  //      />)
                  //    }
                  //  }
              }
            } else {
              console.log('###cluster###')
              return (
                <ClusterMarker
                  key={item.id}
                  lat={item.lat}
                  lng={item.lng}
                  points={item.points}
                />
              );              
            }         
          }
        )}
        </GoogleMapReact>
      </MapWrapper>
    );
  }
}

export default GoogleMap;
