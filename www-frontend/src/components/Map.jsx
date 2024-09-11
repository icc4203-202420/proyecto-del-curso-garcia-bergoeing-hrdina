import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { ControlPosition, MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';

const Map = () => {
   const libraries = useLoadGMapsLibraries();
   const markerCluster = useRef();
   const mapNodeRef = useRef();
   const mapRef = useRef();
   const [cities, setCities] = useState([])
   const inputRef = useRef()

   // useEffect(()=> {
   //    const fetchCities = async() => {
   //      const url = import.meta.env.VITE_BACKEND_URL + '/markers'
   //      const response = await fetch(url)
   //      const dataPaired = await response.json()
   //      setCities(dataPaired)
   //    }
   //  })

   useEffect(() => {
      if (!libraries) {
        return;
      }
  
      const { Map } = libraries[MAPS_LIBRARY];
      mapRef.current = new Map(mapNodeRef.current, {
         mapId: 'DEMO_MAP_ID',
         center: { lat: 0, lng: 0 }, //Placeholder
         isFractionalZoomEnabled: false,
         maxZoom: 15,
         minZoom: 3,
         streetViewControl: false,
         zoom: 10,
      });

      mapRef.current.controls[ControlPosition.TOP].push(inputRef.current)
      navigator.geolocation.getCurrentPosition((position) => {
         const {latitud, longtitude} = position.coords
         const userCoords = {lat: latitud, lng: longtitude}
         marker.setMap(mapRef.current)
         const marker = new Marker({position : userCoords})
         mapRef.current.panTo(userCoords)
      })

      const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
      const markers = cities.map(({name, lat, lng}) => {
         const pin = PinElement()
         pin.glyph = name
         pin.background = "#00ff00"
         const position = (lat, lng)
         const marker = new Marker({ position, content: pin.element });
         return marker
      });

      markerCluster.current = new MarkerClusterer({
         map: mapRef.current,
         markers,
      });
   }, [libraries]);

   return (
      <>
        <input ref={inputRef} type="text" />
        <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
      </>);
}

export default Map;