import React, { useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectDestination, selectOrigin } from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRef } from "react";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);

  const defaultLocation = {
    lat: 4.59723395,
    lng: -74.0697082127393,
    description: "Chorro de Quevedo, Bogotá",
  };

  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom & Fit to Markers
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin?.location?.lat || defaultLocation.lat,
        longitude: origin?.location?.lng || defaultLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {(origin || defaultLocation) && (
        <Marker
          coordinate={{
            latitude: origin?.location?.lat || defaultLocation.lat,
            longitude: origin?.location?.lng || defaultLocation.lng,
          }}
          title="Origin"
          description={origin?.description || defaultLocation.description}
          identifier="origin"
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )}
      {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor="#7fbbff"
          strokeWidth={3}
        />
      )}
    </MapView>
  );
};

export default Map;
