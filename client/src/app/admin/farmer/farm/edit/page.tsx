"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import {
  ADMIN_ADD_FARM_DATA,
  ADMIN_FETCH_FARMER_FARM_DATA,
} from "@/utils/Apis/api";
import { ADMIN_FARM, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import Message from "@/app/components/common/Message";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("farm_id");

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSave, setIsSave] = useState(false);

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
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_DATA}/${id}`,
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

      setFarm(data.farm);
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

  const handleOnCancel = () => {
    router.push(`${ADMIN_FARM}?farm_id=${id}`);
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
        router.push(`${ADMIN_FARM}?farm_id=${id}`);
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 2000);
        return;
      }

      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }

      const res = await fetch(`${BASE_URL}/${ADMIN_ADD_FARM_DATA}/${id}`, {
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
      router.push(`${ADMIN_FARM}?farm_id=${id}`);
    } catch (error) {}

    setIsSave(false);

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="page-main-div relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/plant.jpg"
          alt="Plant"
          fill
          priority
          style={{ objectPosition: "top", objectFit: "cover" }}
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-70 flex items-center justify-start">
          <div className="w-[80%] m-auto">
            <div className="text-[30px] md:text-[50px] font-bold text-white">
              Edit Farm
            </div>
            <div className="text-customOrange text-[20px] md:text-[30px]">
              {farm?.farm}
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 max-w-[90%] m-auto text-black">
        <div className="text-end my-3">
          <button
            onClick={handleOnCancel}
            className="!w-[100px] text-button-size bg-red-600 text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
          >
            Cancel
          </button>
        </div>

        <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-16">
          {!farm?.ploughingDate && (
            <div className="flex items-start flex-col">
              <label htmlFor="ploughingDate" className="font-bold">
                Ploughing Date:
              </label>
              <input
                type="date"
                id="ploughingDate"
                name="ploughingDate"
                max={new Date().toISOString().split("T")[0]}
                value={
                  farmData.ploughingDate
                    ? new Date(farmData.ploughingDate)
                        .toISOString()
                        .split("T")[0]
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
              max={new Date().toISOString().split("T")[0]}
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
                max={new Date().toISOString().split("T")[0]}
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
                max={new Date().toISOString().split("T")[0]}
                value={
                  farmData.floweringDate
                    ? new Date(farmData.floweringDate)
                        .toISOString()
                        .split("T")[0]
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
                max={new Date().toISOString().split("T")[0]}
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
                max={new Date().toISOString().split("T")[0]}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-16">
          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Irrigation Dates:</div>
            <div className="w-full flex items-center justify-between">
              <div className="w-[48%]">
                <label htmlFor="artificial">Artificial</label>
                <input
                  type="date"
                  id="artificial"
                  name="artificial"
                  max={new Date().toISOString().split("T")[0]}
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
                  max={new Date().toISOString().split("T")[0]}
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
                  max={new Date().toISOString().split("T")[0]}
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
                  max={new Date().toISOString().split("T")[0]}
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
                  max={new Date().toISOString().split("T")[0]}
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
                  max={new Date().toISOString().split("T")[0]}
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
                    max={new Date().toISOString().split("T")[0]}
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
                  <label htmlFor="harvestYield">Yield (kg):</label>
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

        <div className="mt-16 text-center">
          <button
            className="w-[100px] text-button-size bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            onClick={() => setIsSave(true)}
          >
            Save
          </button>
        </div>
      </div>

      {isSave && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <div className="bg-white text-black p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5 rounded-md">
            <div>
              <div className="text-title-size font-bold">
                Are you sure, you want to save?
              </div>
              <div className="text-[11px] md:text-[13px] lg:text-[15px]">
                You will not be able to edit/change after saving!
              </div>
            </div>
            <div className="text-end space-x-2">
              <button
                className="w-[100px] text-button-size bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => setIsSave(false)}
              >
                Cancel
              </button>
              <button
                className="w-[100px] text-button-size bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => handleOnSave()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
