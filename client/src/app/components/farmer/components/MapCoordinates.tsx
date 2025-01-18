"use client";

import React, { useEffect } from "react";
import { MapCoordinatesProps } from "@/utils/Types/interfaces";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons not showing
const customIcon = new L.Icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point
  popupAnchor: [1, -34], // Popup position
  shadowSize: [41, 41], // Shadow size
});

function MapCoordinates({ coordinates }: MapCoordinatesProps) {
  const ResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
      const resizeTimeout = setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 500);
      return () => clearTimeout(resizeTimeout);
    }, [map]);
    return null;
  };

  const bounds = L.latLngBounds(
    coordinates.map((coord) => L.latLng(coord.lat, coord.lng))
  );

  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          border: "2px solid black",
          overflow: "hidden",
        }}
        bounds={bounds}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polyline
          positions={coordinates.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{ color: "blue", weight: 3 }}
        />

        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            position={[coord.lat, coord.lng]}
            icon={customIcon}
          >
            <Popup>
              Coordinates: {coord.lat}, {coord.lng}
            </Popup>
          </Marker>
        ))}

        <ResizeHandler />
      </MapContainer>
    </div>
  );
}

export default MapCoordinates;
