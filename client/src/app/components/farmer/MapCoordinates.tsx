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
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function FitBounds({
  coordinates,
}: {
  coordinates: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(
        coordinates.map((coord) => L.latLng(coord.lat, coord.lng))
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [coordinates, map]);

  return null;
}

function MapCoordinates({ coordinates, height }: MapCoordinatesProps) {
  return (
    <div>
      <MapContainer
        center={[25.5941, 85.1376]}
        zoom={13}
        style={{
          height: `${height}`,
          width: "100%",
          border: "1px solid black",
          overflow: "hidden",
        }}
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

            <Tooltip direction="top" offset={[0, -20]} permanent={false}>
              Lat: {coord.lat.toFixed(6)}, Lng: {coord.lng.toFixed(6)}
            </Tooltip>
          </Marker>
        ))}

        <FitBounds coordinates={coordinates} />
      </MapContainer>
    </div>
  );
}

export default MapCoordinates;
