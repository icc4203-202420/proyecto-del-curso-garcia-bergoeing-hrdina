import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from '../hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants';
import '../styles/Map.css'

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [showSuggestions, setShowSuggestions] = useState(false); // To toggle suggestions visibility
  const inputRef = useRef();
  
  const markersRef = useRef([]);

  useEffect(() => {
    const fetchBars = async () => {
      const url = 'http://localhost:3001/api/v1/bars';
      try {
        const response = await fetch(url);
        const dataPaired = await response.json();
        setBars(dataPaired.bars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
    fetchBars();
  }, []);

  // Handle Search: when user types in the search box
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSuggestions(true); // Show suggestions when the user types
  };

  // Zoom in and pan to a specific bar
  const zoomToBar = (bar) => {
    if (mapRef.current) {
      const position = { lat: bar.latitude, lng: bar.longitude };
      mapRef.current.setZoom(15);
      mapRef.current.panTo(position);
    }
    setShowSuggestions(false); // Hide suggestions once a bar is selected
    setSearchTerm(bar.name); // Update search bar with selected bar name
  };

  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: { lat: 0, lng: 0 }, // Placeholder
      isFractionalZoomEnabled: false,
      maxZoom: 15,
      minZoom: 3,
      streetViewControl: false,
      zoom: 10,
    });

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
      console.error('An error occurred:', error);
    }

    const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];

    markersRef.current = [];

    // Iterate over the bars array and create markers using PinElement
    const markers = bars.map((bar) => {
      const pin = new PinElement();
      pin.glyph = bar.name;
      pin.background = "#00ff00"; // Customize pin color

      const position = { lat: bar.latitude, lng: bar.longitude };
      const marker = new Marker({
        position,
        content: pin.element,
      });

      marker.setMap(mapRef.current);
      markersRef.current.push(marker);
      return marker;
    });

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries, bars]);

  // Filter the bars array based on the search term
  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box id="map-container">
      <Box className="search-bar">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearch} // Trigger search on input change
          placeholder="Search for a bar..."
        />

        {/* Suggestions dropdown */}
        {showSuggestions && searchTerm && filteredBars.length > 0 && (
          <Box className="suggestions">
            {filteredBars.map((bar) => (
              <Box
                key={bar.id}
                className="suggestion-item"
                onClick={() => zoomToBar(bar)} // Zoom to bar on click
              >
                {bar.name}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box id="map" ref={mapNodeRef} />
    </Box>
  );
}

export default Map;
