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
import { ADMIN_FARM, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import Message from "@/app/components/common/Message";
import CloseIcon from "@mui/icons-material/Close";

function Edit_Farm({ onclick }: { onclick: (value: boolean) => void }) {
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
  const [newSingleValue, setNewSingleValue] = useState<string>("");
  const [newMultiValue, setNewMultiValue] = useState<{
    date?: string;
    volume?: number;
    quantity?: number;
    yield?: number;
    name?: string;
  }>({});

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

      if (res.status === 400) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
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
        router.push(`${ADMIN_FARM}?farm_id=${farm_id}`);
        throw new Error(data.error);
      }

      setFarmData(data.farm);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

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
    setNewSingleValue("");
    setNewMultiValue({});
  };

  const handleIndexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndex(parseInt(e.target.value));
  };

  const handleSubFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubField(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSingleValue(e.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedField) {
      setMessage({
        text: "Please select a field",
        type: "error",
      });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    const isArrayField = [
      "fertilizerApplications",
      "pesticideApplications",
      "bagging",
      "specialCare",
    ].includes(selectedField);

    const isObjectField = selectedField === "harvest";

    if (isArrayField && selectedIndex === null) {
      setMessage({
        text: "Please select an entry to update",
        type: "error",
      });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (isObjectField && (!newMultiValue.date || !newMultiValue.yield)) {
      setMessage({
        text: "Please fill all fields for the harvest entry",
        type: "error",
      });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (!isArrayField && !isObjectField && !newSingleValue) {
      setMessage({
        text: "Please enter a value",
        type: "error",
      });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
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
            value:
              isArrayField || isObjectField ? newMultiValue : newSingleValue,
            index: selectedIndex,
            subField: selectedSubField,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 400 || res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
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
        router.push(`${ADMIN_FARM}?farm_id=${farm_id}`);
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
    } catch (error) {}

    onclick(false);

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleDelete = async () => {
    if (!selectedField) {
      setMessage({
        text: "Please select a field",
        type: "error",
      });
      return;
    }

    if (selectedIndex === null) {
      setMessage({
        text: "Please select an entry to delete",
        type: "error",
      });
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
            subField: selectedSubField || null,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 400 || res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
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
        router.push(`${ADMIN_FARM}?farm_id=${farm_id}`);
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
    } catch (error) {}

    onclick(false);

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const renderInputField = () => {
    if (!farmData) return null;

    switch (selectedField) {
      case "farm":
      case "crop":
        return (
          <input
            type="text"
            value={newSingleValue}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
            onChange={handleValueChange}
          />
        );
      case "ploughingDate":
      case "sowingDate":
      case "floweringDate":
      case "pheromoneTrapDate":
      case "lureChangeDate":
        return (
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={newSingleValue}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
            onChange={handleValueChange}
          />
        );
      case "weedingDate":
        return (
          <>
            <select
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleIndexChange}
            >
              <option value="">Select a date to edit/delete</option>
              {farmData.weedingDate.map((date, index) => (
                <option key={index} value={index}>
                  {new Date(date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={newSingleValue}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleValueChange}
            />
          </>
        );
      case "irrigationDates":
        return (
          <>
            <select
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleSubFieldChange}
            >
              <option value="">Select a sub-field</option>
              <option value="artificial">Artificial</option>
              <option value="natural">Natural</option>
            </select>

            {selectedSubField && (
              <>
                <select
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={handleIndexChange}
                >
                  <option value="">Select a date to edit</option>
                  {farmData.irrigationDates[
                    selectedSubField as keyof typeof farmData.irrigationDates
                  ].map((date, index) => (
                    <option key={index} value={index}>
                      {new Date(date).toISOString().split("T")[0]}
                    </option>
                  ))}
                </select>

                {selectedIndex !== null && (
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={newSingleValue}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                    onChange={handleValueChange}
                  />
                )}
              </>
            )}
          </>
        );
      case "fertilizerApplications":
      case "pesticideApplications":
        return (
          <>
            <select
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleIndexChange}
            >
              <option value="">Select an entry to edit/delete</option>
              {farmData[selectedField].map((entry, index) => (
                <option key={index} value={index}>
                  {new Date(entry.date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            {selectedIndex !== null && (
              <div className="space-y-2">
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={newMultiValue.date || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({ ...newMultiValue, date: e.target.value })
                  }
                  placeholder="Date"
                />
                <input
                  type="number"
                  value={newMultiValue.volume || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({
                      ...newMultiValue,
                      volume: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Volume"
                />
              </div>
            )}
          </>
        );
      case "bagging":
        return (
          <>
            <select
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleIndexChange}
            >
              <option value="">Select an entry to edit/delete</option>
              {farmData[selectedField].map((entry, index) => (
                <option key={index} value={index}>
                  {new Date(entry.date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            {selectedIndex !== null && (
              <div className="space-y-2">
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={newMultiValue.date || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({ ...newMultiValue, date: e.target.value })
                  }
                  placeholder="Date"
                />
                <input
                  type="number"
                  value={newMultiValue.quantity || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({
                      ...newMultiValue,
                      quantity: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Quantity"
                />
              </div>
            )}
          </>
        );
      case "specialCare":
        return (
          <>
            <select
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={handleIndexChange}
            >
              <option value="">Select an entry to edit/delete</option>
              {farmData[selectedField].map((entry, index) => (
                <option key={index} value={index}>
                  {new Date(entry.date).toISOString().split("T")[0]}
                </option>
              ))}
            </select>
            {selectedIndex !== null && (
              <div className="space-y-2">
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={newMultiValue.date || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({ ...newMultiValue, date: e.target.value })
                  }
                  placeholder="Date"
                />
                <input
                  type="text"
                  value={newMultiValue.name || ""}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) =>
                    setNewMultiValue({ ...newMultiValue, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
            )}
          </>
        );
      case "harvest":
        return (
          <div className="space-y-2">
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={newMultiValue.date || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={(e) =>
                setNewMultiValue({ ...newMultiValue, date: e.target.value })
              }
              placeholder="Harvest Date"
            />
            <input
              type="number"
              value={newMultiValue.yield || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
              onChange={(e) =>
                setNewMultiValue({
                  ...newMultiValue,
                  yield: parseFloat(e.target.value),
                })
              }
              placeholder="Harvest Yield"
            />
          </div>
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

      <div className="bg-white text-black p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5 rounded-md">
        <div className="py-2 flex items-center justify-between border-black border-b-[1px]">
          <div className="font-bold">Edit Data</div>
          <CloseIcon
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => onclick(false)}
          />
        </div>
        <div className="space-y-2">
          <label>Select Field:</label>
          <select
            className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
            onChange={handleFieldChange}
          >
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
            <option value="harvest">Harvest</option>
          </select>
        </div>

        {selectedField && (
          <div className="space-y-2">
            <label>New Value:</label>
            {renderInputField()}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className="!w-[130px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            onClick={handleDelete}
          >
            Delete
          </button>

          <button
            className="!w-[130px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default Edit_Farm;
