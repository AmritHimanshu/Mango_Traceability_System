"use client";

import React, { useState } from "react";

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

function page() {
  const [tracking, setTracking] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Start tracking
  const startTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          
          const timestamp = position.timestamp;
          setLocations((prev) => [
            ...prev,
            { lat: latitude, lng: longitude, timestamp },
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Wait 30 seconds for an update before failing
          maximumAge: 0, // Force no cached results
        }
      );
      setWatchId(id);
      setTracking(true);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Location Tracking</h1>
      <div className="space-y-4">
        <button
          onClick={startTracking}
          disabled={tracking}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Start Tracking
        </button>
        <button
          onClick={stopTracking}
          disabled={!tracking}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Stop Tracking
        </button>
        <button
          //   onClick={savePath}
          disabled={locations.length === 0}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save Path
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-medium">Tracked Locations:</h2>
        <ul className="list-disc pl-6 mt-2">
          {locations.map((loc, index) => (
            <li key={index} className="text-sm">
              Lat: {loc.lat}, Lng: {loc.lng}, Timestamp:{" "}
              {new Date(loc.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default page;
