"use client"

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { MapProps } from "@/utils/Types/interfaces";

function Map({ submitForm }: MapProps) {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const handleReset = () => setCoordinates([]);

  const handleSubmit = () => {
    submitForm(coordinates);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (event: LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        setCoordinates((prev) => [...prev, [lat, lng]]);
      },
    });
    return null;
  };

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

  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "500px", width: "100%", border: "2px solid black", overflow: "hidden", }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <ResizeHandler />
        <Polygon positions={coordinates} color="blue" />
      </MapContainer>
      <div className="mt-5 space-y-5">
        <button onClick={handleReset} className="bg-black text-white p-2 rounded-md" style={{ marginRight: "10px" }}>
          Reset
        </button>
        <button className="btn bg-black text-white" onClick={handleSubmit}>
          Create farm
        </button>
      </div>
    </div>
  );
}

export default Map;
