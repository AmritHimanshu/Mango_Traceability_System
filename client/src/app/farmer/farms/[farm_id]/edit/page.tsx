"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import {
  FARMER_FETCH_FARM_DATA,
  FARMER_SAVE_FARM_DATA,
} from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import Message from "@/app/components/common/Message";
import Heading from "@/app/components/common/Heading";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/")[3];

  const [message, setMessage] = useState({ text: "", type: "" });

  const [farm, setFarm] = useState<Farm>();
  const [farmData, setFarmData] = useState({
    area: 0,
    farm: "",
    crop: "",
    geoFenceData: [{ lat: 0, lng: 0 }],
    ploughingDate: "",
    weedingDate: [],
    sowingDate: "",
    floweringDate: "",
    pheromoneTrapDate: "",
    lureChangeDate: "",
    irrigationDates: {
      artificial: [],
      natural: [],
    },
    fertilizerApplications: [],
    pesticideApplications: [],
    bagging: [],
    specialCare: [],
    harvest: { date: "", yield: "" },
  });
  const [changedFarmData, setChangedFarmData] = useState({});

  const [artificial, setArtificial] = useState("");
  const [natural, setNatural] = useState("");

  const [weedingDate, setWeedingDate] = useState("");
  const [fertilizerApplications, setFertilizerApplications] = useState({
    date: "",
    volume: "0",
  });
  const [pesticideApplications, setPesticideApplications] = useState({
    date: "",
    volume: "0",
  });
  const [bagging, setBagging] = useState({
    date: "",
    quantity: "0",
  });
  const [specialCare, setSpecialCare] = useState({
    date: "",
    name: "",
  });
  const [harvest, setHarvest] = useState({
    date: "",
    yield: "0",
  });

  const fetchFarmData = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${FARMER_FETCH_FARM_DATA}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        router.push(NOT_FOUND);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setFarm(data);
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

  const handleOnClose = () => {
    router.push(`${FARMS}/${id}`);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFarmData((prev) => ({ ...prev, [name]: value }));
    setChangedFarmData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSave = async () => {
    try {
      const payload = {
        ...Object.fromEntries(
          Object.entries(changedFarmData).filter(([key, value]) => value !== "")
        ),
        ...(artificial || natural
          ? {
              irrigationDates: {
                artificial: artificial ? [artificial] : [],
                natural: natural ? [natural] : [],
              },
            }
          : {}),
        ...(fertilizerApplications.date && fertilizerApplications.volume !== "0"
          ? { fertilizerApplications }
          : {}),
        ...(pesticideApplications.date && pesticideApplications.volume !== "0"
          ? { pesticideApplications }
          : {}),
        ...(bagging.date && bagging.quantity !== "0" ? { bagging } : {}),
        ...(specialCare.date && specialCare.name ? { specialCare } : {}),
        ...(harvest.date && harvest.yield !== "0" ? { harvest } : {}),
        ...(weedingDate ? { weedingDate } : {}),
      };

      if (Object.keys(payload).length === 0) {
        setMessage({ text: "No changes to save!", type: "error" });
        router.push(`${FARMS}/${id}`);
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 2000);
        return;
      }

      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }

      const res = await fetch(`${BASE_URL}/${FARMER_SAVE_FARM_DATA}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        router.push(NOT_FOUND);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      router.push(`${FARMS}/${id}`);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <Heading text={`${farm?.farm} (Edit)`} />

      <div className="text-end my-7">
        <button
          onClick={handleOnClose}
          className="bg-red-600 text-white hover:bg-red-100 hover:text-red-600 duration-200 rounded-sm px-2 py-2"
        >
          Cancel
        </button>
      </div>

      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-16">
        {!farm?.ploughingDate && (
          <div className="flex items-start flex-col">
            <label htmlFor="ploughingDate" className="font-bold">
              Ploughing Date:
            </label>
            <input
              type="date"
              id="ploughingDate"
              name="ploughingDate"
              value={
                farmData.ploughingDate
                  ? new Date(farmData.ploughingDate).toISOString().split("T")[0]
                  : ""
              }
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        )}

        <div className="flex items-start flex-col">
          <div className="font-bold">Weeding Date:</div>
          <input
            type="date"
            id="weedingDate"
            name="weedingDate"
            value={weedingDate}
            className="input-tag"
            onChange={(e) => setWeedingDate(e.target.value)}
          />
        </div>

        {!farm?.sowingDate && (
          <div className="flex items-start flex-col">
            <label htmlFor="sowingDate" className="font-bold">
              Sowing Date:
            </label>
            <input
              type="date"
              id="sowingDate"
              name="sowingDate"
              value={
                farmData.sowingDate
                  ? new Date(farmData.sowingDate).toISOString().split("T")[0]
                  : ""
              }
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        )}

        {!farm?.floweringDate && (
          <div className="flex items-start flex-col">
            <label htmlFor="floweringDate" className="font-bold">
              Flowering Date:
            </label>
            <input
              type="date"
              id="floweringDate"
              name="floweringDate"
              value={
                farmData.floweringDate
                  ? new Date(farmData.floweringDate).toISOString().split("T")[0]
                  : ""
              }
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        )}

        {!farm?.pheromoneTrapDate && (
          <div className="flex items-start flex-col">
            <label htmlFor="pheromoneTrapDate" className="font-bold">
              Pheromone Trap Date:
            </label>
            <input
              type="date"
              id="pheromoneTrapDate"
              name="pheromoneTrapDate"
              value={
                farmData.pheromoneTrapDate
                  ? new Date(farmData.pheromoneTrapDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        )}

        {!farm?.lureChangeDate && (
          <div className="flex items-start flex-col">
            <label htmlFor="lureChangeDate" className="font-bold">
              Lure Change Date:
            </label>
            <input
              type="date"
              id="lureChangeDate"
              name="lureChangeDate"
              value={
                farmData.lureChangeDate
                  ? new Date(farmData.lureChangeDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-16">
        <div className="flex items-start flex-col space-y-3">
          <div className="font-bold">Irrigation Dates:</div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[48%]">
              <label htmlFor="artificial">Artificial</label>
              <input
                type="date"
                id="artificial"
                name="artificial"
                value={artificial}
                className="input-tag"
                onChange={(e) => setArtificial(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="natural">Natural</label>
              <input
                type="date"
                id="natural"
                name="natural"
                value={natural}
                className="input-tag"
                onChange={(e) => setNatural(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start flex-col space-y-3">
          <div className="font-bold">Fertilizer Application:</div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[48%]">
              <label htmlFor="fertilizerDate">Date:</label>
              <input
                type="date"
                id="fertilizerDate"
                name="fertilizerDate"
                value={fertilizerApplications.date}
                className="input-tag"
                onChange={(e) =>
                  setFertilizerApplications((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="fertilizerVolume">Volume (L):</label>
              <input
                type="number"
                id="fertilizerApplications fertilizerVolume"
                name="fertilizerApplications"
                value={fertilizerApplications.volume}
                className="input-tag"
                onChange={(e) =>
                  setFertilizerApplications((prev) => ({
                    ...prev,
                    volume: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-start flex-col space-y-3">
          <div className="font-bold">Pesticide Application:</div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[48%]">
              <label htmlFor="pesticideDate">Date:</label>
              <input
                type="date"
                id="pesticideDate"
                name="pesticideDate"
                value={pesticideApplications.date}
                className="input-tag"
                onChange={(e) =>
                  setPesticideApplications((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="pesticideVolume">Volume (in litre):</label>
              <input
                type="number"
                id="pesticideVolume"
                name="pesticideVolume"
                value={pesticideApplications.volume}
                className="input-tag"
                onChange={(e) =>
                  setPesticideApplications((prev) => ({
                    ...prev,
                    volume: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-start flex-col space-y-3">
          <div className="font-bold">Bagging:</div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[48%]">
              <label htmlFor="baggingDate">Date:</label>
              <input
                type="date"
                id="baggingDate"
                name="baggingDate"
                value={bagging.date}
                className="input-tag"
                onChange={(e) =>
                  setBagging((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="baggingQuantity">Quantity:</label>
              <input
                type="number"
                id="baggingQuantity"
                name="baggingQuantity"
                value={bagging.quantity}
                className="input-tag"
                onChange={(e) =>
                  setBagging((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-start flex-col space-y-3">
          <div className="font-bold">Special care:</div>
          <div className="w-full flex items-center justify-between">
            <div className="w-[48%]">
              <label htmlFor="specialCareDate">Date:</label>
              <input
                type="date"
                id="specialCareDate"
                name="specialCareDate"
                value={specialCare.date}
                className="input-tag"
                onChange={(e) =>
                  setSpecialCare((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="specialCareName">Name:</label>
              <input
                type="text"
                id="specialCareName"
                name="specialCareName"
                value={specialCare.name}
                className="input-tag"
                onChange={(e) =>
                  setSpecialCare((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {!farm?.harvest && (
          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Harvest Date:</div>
            <div className="w-full flex items-center justify-between">
              <div className="w-[48%]">
                <label htmlFor="harvestDate">Date:</label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  value={harvest.date}
                  className="input-tag"
                  onChange={(e) =>
                    setHarvest((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-[48%]">
                <label htmlFor="harvestYield">Yield:</label>
                <input
                  type="number"
                  id="harvestYield"
                  name="harvestYield"
                  value={harvest.yield}
                  className="input-tag"
                  onChange={(e) =>
                    setHarvest((prev) => ({
                      ...prev,
                      yield: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16">
        <button
          className="btn bg-green-600 bg-opacity-90 text-white hover:bg-opacity-100 duration-200"
          onClick={handleOnSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default page;
