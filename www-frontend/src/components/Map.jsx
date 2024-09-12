import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { PinElement } from '@vis.gl/react-google-maps';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';
import '../styles/Map.css'

const Map = () => {
   const libraries = useLoadGMapsLibraries();
   const markerCluster = useRef();
   const mapNodeRef = useRef();
   const mapRef = useRef();
   const [bars, setBars] = useState([]);
   const inputRef = useRef()

   useEffect(() => {
      const fetchBars = async () => {
        const url = 'http://localhost:3001/api/v1/bars';
        try {
          const response = await fetch(url);
          const dataPaired = await response.json();
          console.log('Data from API:', dataPaired); // Log the data to check its structure
          setBars(dataPaired.bars); // Access the bars array from the API response
        } catch (error) {
          console.error('Error fetching bars:', error);
        }
      };
      fetchBars();
    }, []);

   // Log when bars state is updated
   useEffect(() => {
      console.log('Updated bars:', bars); // This will log when bars is updated
   }, [bars]);

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

      // Use try-catch for DOMException handling
      try {
         navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userCoords = { lat: latitude, lng: longitude };
            const marker = new Marker({ position: userCoords });
            marker.setMap(mapRef.current);
            mapRef.current.panTo(userCoords);
         }, (error) => {
            console.error('Error retrieving geolocation:', error);
         });
      } catch (error) {
         if (error instanceof DOMException) {
            console.error('DOMException occurred:', error.message);
         } else {
            console.error('An error occurred:', error);
         }
      }

      const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
      const markers = bars.map(({name, latitude, longitude}) => {
         const pin = PinElement()
         pin.glyph = name
         pin.background = "#00ff00"
         const position = (latitude, longitude)
         const marker = new Marker({ position, content: pin.element });
         return marker
      });

      markerCluster.current = new MarkerClusterer({
         map: mapRef.current,
         markers,
      });
   }, [libraries]);

return (
    <Box id="map-container">
      <Box className="search-bar">
        <input ref={inputRef} type="text" />
      </Box>
      <Box id="map" ref={mapNodeRef} />
    </Box>
  );
}

export default Map;