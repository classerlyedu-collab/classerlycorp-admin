import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface MapProps {
  center: google.maps.LatLngLiteral;
  onDrag: (event: google.maps.MapMouseEvent) => void;
  draggable: boolean;
}

function Map({ center, onDrag, draggable }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`,
    // libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "350px", height: "350px", marginTop: "10px" }}
      center={center}
      zoom={17}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} draggable={draggable} onDragEnd={onDrag} />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
