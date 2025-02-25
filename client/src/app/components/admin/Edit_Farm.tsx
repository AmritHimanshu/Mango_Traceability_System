"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ADMIN_DELETE_FARM_DATA,
  ADMIN_EDIT_FARM_DATA,
  ADMIN_FETCH_FARMER_FARM_DATA,
} from "@/utils/Apis/api";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { FARMER, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import Heading from "@/app/components/common/Heading";
import Message from "@/app/components/common/Message";

// interface Farm {
//   farm: string;
//   geoFenceData: { lat: number; lng: number }[];
//   area: number;
//   crop: string;
//   ploughingDate: string;
//   weedingDate: string[];
//   sowingDate: string;
//   floweringDate: string;
//   pheromoneTrapDate: string;
//   lureChangeDate: string;
//   irrigationDates: {
//     artificial: string[];
//     natural: string[];
//   };
//   fertilizerApplications: { date: string; volume: number }[];
//   pesticideApplications: { date: string; volume: number }[];
//   bagging: { date: string; quantity: number }[];
//   specialCare: { date: string; name: string }[];
//   harvest: {
//     date: string;
//     yield: number;
//   };
//   uniqueID: string;
//   qrCode: string;
// }

function Edit_Farm() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedField, setSelectedField] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedSubField, setSelectedSubField] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchFarmData = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_DATA}/${farm_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.status === 404) {
        return router.push(NOT_FOUND);
      }

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(FARMER);
        throw new Error(data.error);
      }

      setFarmData(data.farm);
    } catch (error) {
      setMessage({ text: "An error occurred", type: "error" });
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value);
    setSelectedIndex(null);
    setSelectedSubField("");
    setNewValue("");
  };

  const handleIndexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndex(parseInt(e.target.value));
  };

  const handleSubFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubField(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedField || !newValue) {
      setMessage({
        text: "Please select a field and enter a value",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_EDIT_FARM_DATA}/${farm_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            field: selectedField,
            value: newValue,
            index: selectedIndex,
            subField: selectedSubField,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 201) {
        setMessage({ text: data.message, type: "success" });
        fetchFarmData();
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!selectedField) {
      setMessage({ text: "Please select a field to delete", type: "error" });
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_DELETE_FARM_DATA}/${farm_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            field: selectedField,
            index: selectedIndex,
            subField: selectedSubField,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 201) {
        setMessage({ text: "Data deleted successfully", type: "success" });
        fetchFarmData(); // Refresh the data
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred", type: "error" });
    }
  };

  const renderInputField = () => {
    if (!farmData) return null;

    switch (selectedField) {
      case "farm":
      case "crop":
        return (
          <input type="text" value={newValue} onChange={handleValueChange} />
        );
      case "ploughingDate":
      case "sowingDate":
      case "floweringDate":
      case "pheromoneTrapDate":
      case "lureChangeDate":
        return (
          <input type="date" value={newValue} onChange={handleValueChange} />
        );
      case "weedingDate":
        return (
          <>
            <select onChange={handleIndexChange}>
              <option value="">Select a date to edit/delete</option>
              {farmData.weedingDate.map((date, index) => (
                <option key={index} value={index}>
                  {new Date(date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            <input type="date" value={newValue} onChange={handleValueChange} />
          </>
        );
      case "irrigationDates":
        return (
          <>
            <select onChange={handleSubFieldChange}>
              <option value="">Select a sub-field</option>
              <option value="artificial">Artificial</option>
              <option value="natural">Natural</option>
            </select>
            <input type="date" value={newValue} onChange={handleValueChange} />
          </>
        );
      case "fertilizerApplications":
      case "pesticideApplications":
      case "bagging":
      case "specialCare":
        return (
          <>
            <select onChange={handleIndexChange}>
              <option value="">Select an entry to edit/delete</option>
              {farmData[selectedField].map((entry, index) => (
                <option key={index} value={index}>
                  {new Date(entry.date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newValue}
              onChange={handleValueChange}
              placeholder="Enter new value"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="bg-white text-black p-5 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5">
        <div className="space-x-3">
          <label>Select Field:</label>
          <select onChange={handleFieldChange}>
            <option value="">Select a field</option>
            <option value="farm">Farm Name</option>
            <option value="crop">Crop Name</option>
            <option value="ploughingDate">Ploughing Date</option>
            <option value="sowingDate">Sowing Date</option>
            <option value="floweringDate">Flowering Date</option>
            <option value="pheromoneTrapDate">Pheromone Trap Date</option>
            <option value="lureChangeDate">Lure Change Date</option>
            <option value="weedingDate">Weeding Date</option>
            <option value="irrigationDates">Irrigation Dates</option>
            <option value="fertilizerApplications">
              Fertilizer Applications
            </option>
            <option value="pesticideApplications">
              Pesticide Applications
            </option>
            <option value="bagging">Bagging</option>
            <option value="specialCare">Special Care</option>
          </select>
        </div>

        {selectedField && (
          <div>
            <label>New Value:</label>
            {renderInputField()}
          </div>
        )}

        <button
          className="px-[7px] text-[14px] bg-blue-200 hover:bg-blue-100 duration-300"
          onClick={handleUpdate}
        >
          Update
        </button>

        <button
          className="px-[7px] text-[14px] bg-red-200 hover:bg-red-100 duration-300"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Edit_Farm;
