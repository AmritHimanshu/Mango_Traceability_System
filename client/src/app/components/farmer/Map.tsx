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

  const handleStartTracking = () => {
    setTracking(true);
  };

  const handleStopTracking = () => {
    setTracking(false);
  };

  useEffect(() => {
    if (!tracking) return;

    const geolocation = navigator.geolocation;

    if (geolocation) {
      const watchId = geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserPosition: [number, number] = [latitude, longitude];

          setUserPath((prevPath) => [...prevPath, newUserPosition]);
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
    coordinates.push(coordinates[0]);
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
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-gray-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            style={{ marginRight: "10px" }}
          >
            Reset
          </button>

          {!tracking ? (
            <button
              onClick={handleStartTracking}
              className="!w-[80px] md:!w-[100px] lg:!w-[150px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            >
              Start Tracking
            </button>
          ) : (
            <button
              onClick={handleStopTracking}
              className="!w-[80px] md:!w-[100px] lg:!w-[150px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            >
              Stop Tracking
            </button>
          )}
        </div>

        <button
          className="w-full !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
          onClick={handleSubmit}
        >
          Create farm
        </button>
      </div>
    </div>
  );
}

export default Map;
