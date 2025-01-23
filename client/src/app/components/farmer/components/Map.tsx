"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { MapProps } from "@/utils/Types/interfaces";
import "leaflet/dist/leaflet.css";

function Map({ submitForm }: MapProps) {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [userPath, setUserPath] = useState<[number, number][]>([]);
  const [tracking, setTracking] = useState(false);

  // Function to start tracking the user
  const handleStartTracking = () => {
    setTracking(true);
  };

  // Function to stop tracking the user
  const handleStopTracking = () => {
    setTracking(false);
  };

  // Add path tracking functionality
  useEffect(() => {
    if (!tracking) return;

    const geolocation = navigator.geolocation;

    if (geolocation) {
      const watchId = geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserPosition: [number, number] = [latitude, longitude];

          setUserPath((prevPath) => [...prevPath, newUserPosition]); // Update user path
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => {
        geolocation.clearWatch(watchId);
      };
    }
  }, [tracking]);

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
        center={[25.5941, 85.1376]}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          border: "2px solid black",
          overflow: "hidden",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler />

        <ResizeHandler />

        <Polyline positions={userPath} color="blue" />

        <Polygon positions={coordinates} color="blue" />
      </MapContainer>

      <div className="mt-5 space-y-5">
        <button
          onClick={handleReset}
          className="bg-black text-white p-2 rounded-md"
          style={{ marginRight: "10px" }}
        >
          Reset
        </button>

        <button className="btn bg-black text-white" onClick={handleSubmit}>
          Create farm
        </button>

        {/* Buttons to control path tracking */}
        {!tracking ? (
          <button
            onClick={handleStartTracking}
            className="bg-green-500 text-white p-2 rounded-md"
          >
            Start Tracking
          </button>
        ) : (
          <button
            onClick={handleStopTracking}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            Stop Tracking
          </button>
        )}
      </div>
    </div>
  );
}

export default Map;
