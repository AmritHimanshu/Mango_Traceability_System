"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import {
  FARMER_FETCH_FARM_DATA,
  FARMER_SAVE_FARM_DATA,
} from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
const Map = dynamic(
  () => import("@/app/components/farmer/components/MapCoordinates"),
  {
    ssr: false,
  }
);
import ListFarmApplicationsData from "@/app/components/farmer/components/ListFarmApplicationsData";
import CloseIcon from "@mui/icons-material/Close";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");

  const [farm, setFarm] = useState({
    farm: "",
    crop: "",
    geoFenceData: [{ lat: 0, lng: 0 }],
    ploughingDate: "",
    weedingDate: "",
    sowingDate: "",
    floweringDate: "",
    pheromoneTrapDate: "",
    lureChangeDate: "",
    irrigationDates: {
      artificial: [],
      natural: [],
    },
    fertilizerApplications: [{ date: "", volume: "" }],
    pesticideApplications: [],
    bagging: [],
    specialCare: [],
    harvest: { date: "", yield: "" },
  });

  const [changedFarmData, setChangedFarmData] = useState({});

  const [artificial, setArtificial] = useState("");
  const [natural, setNatural] = useState("");
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

      if(res.status === 404){
        router.push(NOT_FOUND);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        router.push(FARMS);
        const error = new Error(data.error);
        throw error;
      }

      setFarm({
        farm: data.farm || "",
        crop: data.crop || "",
        geoFenceData: data.geoFenceData || [{ lat: 0, lng: 0 }],
        ploughingDate: data.ploughingDate || "",
        weedingDate: data.weedingDate || "",
        sowingDate: data.sowingDate || "",
        floweringDate: data.floweringDate || "",
        pheromoneTrapDate: data.pheromoneTrapDate || "",
        lureChangeDate: data.lureChangeDate || "",
        irrigationDates: {
          artificial: data.irrigationDates?.artificial || "",
          natural: data.irrigationDates?.natural || "",
        },
        fertilizerApplications: data.fertilizerApplications || [],
        pesticideApplications: data.pesticideApplications || [],
        bagging: data.bagging || [],
        specialCare: data.specialCare || [],
        harvest: data.harvest || "",
      });
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFarm((prev) => ({ ...prev, [name]: value }));
    setChangedFarmData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnEdit = () => {
    router.push(`${FARMS}/${id}?edit=true`);
  };

  const handleOnClose = () => {
    router.push(`${FARMS}/${id}`);
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
      };

      if (Object.keys(payload).length === 0) {
        alert("No changes to save!");
        router.push(`${FARMS}/${id}`);
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

      if (res.status === 400) {
        alert(data.error);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      router.push(`${FARMS}/${id}`);
    } catch (error) {
      console.log("Error: ", error);
      alert("Error while saving changes.");
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)]">
      <CustomLoadingBar ref={loadingBarRef} />

      {farm && (
        <>
          {edit && (
            <div className="text-end">
              <CloseIcon onClick={handleOnClose} />
            </div>
          )}
          <div className="space-y-10 my-5">
            <Map coordinates={farm.geoFenceData} />

            {farm.farm && (
              <div className="flex items-start flex-col">
                <label htmlFor="farm" className="font-bold">
                  Farm Name:
                </label>
                <input
                  type="text"
                  id="farm"
                  name="farm"
                  value={farm.farm}
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {farm.crop && (
              <div className="flex items-start flex-col">
                <label htmlFor="crop" className="font-bold">
                  Crop Name:
                </label>
                <input
                  type="text"
                  id="crop"
                  name="crop"
                  value={farm.crop}
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.ploughingDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="ploughingDate" className="font-bold">
                  Ploughing Date:
                </label>
                <input
                  type="date"
                  id="ploughingDate"
                  name="ploughingDate"
                  value={
                    farm.ploughingDate
                      ? new Date(farm.ploughingDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.weedingDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="weedingDate" className="font-bold">
                  Weeding Date:
                </label>
                <input
                  type="date"
                  id="weedingDate"
                  name="weedingDate"
                  value={
                    farm.weedingDate
                      ? new Date(farm.weedingDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.sowingDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="sowingDate" className="font-bold">
                  Sowing Date:
                </label>
                <input
                  type="date"
                  id="sowingDate"
                  name="sowingDate"
                  value={
                    farm.sowingDate
                      ? new Date(farm.sowingDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.floweringDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="floweringDate" className="font-bold">
                  Flowering Date:
                </label>
                <input
                  type="date"
                  id="floweringDate"
                  name="floweringDate"
                  value={
                    farm.floweringDate
                      ? new Date(farm.floweringDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.pheromoneTrapDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="pheromoneTrapDate" className="font-bold">
                  Pheromone Trap Date:
                </label>
                <input
                  type="date"
                  id="pheromoneTrapDate"
                  name="pheromoneTrapDate"
                  value={
                    farm.pheromoneTrapDate
                      ? new Date(farm.pheromoneTrapDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.lureChangeDate || edit) && (
              <div className="flex items-start flex-col">
                <label htmlFor="lureChangeDate" className="font-bold">
                  Lure Change Date:
                </label>
                <input
                  type="date"
                  id="lureChangeDate"
                  name="lureChangeDate"
                  value={
                    farm.lureChangeDate
                      ? new Date(farm.lureChangeDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="input-tag"
                  disabled={!(edit === "true")}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            )}

            {(farm.irrigationDates.artificial.length > 0 ||
              farm.irrigationDates.natural.length > 0 ||
              edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Irrigation Dates:</div>
                {edit ? (
                  <>
                    <label htmlFor="artificial">Artificial</label>
                    <input
                      type="date"
                      id="artificial"
                      name="artificial"
                      value={artificial}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) => setArtificial(e.target.value)}
                    />
                    <label htmlFor="natural">Natural</label>
                    <input
                      type="date"
                      id="natural"
                      name="natural"
                      value={natural}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) => setNatural(e.target.value)}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}

            {(farm.fertilizerApplications.length > 0 || edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Fertilizer Application:</div>
                {edit ? (
                  <>
                    <label htmlFor="fertilizerDate">Date:</label>
                    <input
                      type="date"
                      id="fertilizerDate"
                      name="fertilizerDate"
                      value={fertilizerApplications.date}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setFertilizerApplications((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="fertilizerVolume">Volume (L):</label>
                    <input
                      type="number"
                      id="fertilizerApplications fertilizerVolume"
                      name="fertilizerApplications"
                      value={fertilizerApplications.volume}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setFertilizerApplications((prev) => ({
                          ...prev,
                          volume: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <ListFarmApplicationsData
                    data={farm.fertilizerApplications}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Volume (L)", key: "volume" },
                    ]}
                  />
                )}
              </div>
            )}

            {(farm.pesticideApplications.length > 0 || edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Pesticide Application:</div>
                {edit ? (
                  <>
                    <label htmlFor="pesticideDate">Date:</label>
                    <input
                      type="date"
                      id="pesticideDate"
                      name="pesticideDate"
                      value={pesticideApplications.date}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setPesticideApplications((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="pesticideVolume">Volume (in litre):</label>
                    <input
                      type="number"
                      id="pesticideVolume"
                      name="pesticideVolume"
                      value={pesticideApplications.volume}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setPesticideApplications((prev) => ({
                          ...prev,
                          volume: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <ListFarmApplicationsData
                    data={farm.pesticideApplications}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Volume (L)", key: "volume" },
                    ]}
                  />
                )}
              </div>
            )}

            {(farm.bagging.length > 0 || edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Bagging:</div>
                {edit ? (
                  <>
                    <label htmlFor="bagginDate">Date:</label>
                    <input
                      type="date"
                      id="baggingDate"
                      name="baggingDate"
                      value={bagging.date}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setBagging((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="bagginQuantity">Quantity:</label>
                    <input
                      type="number"
                      id="baggingQuantity"
                      name="baggingQuantity"
                      value={bagging.quantity}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setBagging((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <ListFarmApplicationsData
                    data={farm.bagging}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Quantity", key: "quantity" },
                    ]}
                  />
                )}
              </div>
            )}

            {(farm.specialCare.length > 0 || edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Special care:</div>
                {edit ? (
                  <>
                    <label htmlFor="specialCareDate">Date:</label>
                    <input
                      type="date"
                      id="specialCareDate"
                      name="specialCareDate"
                      value={specialCare.date}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setSpecialCare((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="specialCareName">Name:</label>
                    <input
                      type="text"
                      id="specialCareName"
                      name="specialCareName"
                      value={specialCare.name}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setSpecialCare((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <ListFarmApplicationsData
                    data={farm.specialCare}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Name", key: "name" },
                    ]}
                  />
                )}
              </div>
            )}

            {(farm.harvest || edit) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Harvest Date:</div>
                {edit ? (
                  <>
                    <label htmlFor="harvestDate">Date:</label>
                    <input
                      type="date"
                      id="harvestDate"
                      name="harvestDate"
                      value={harvest.date}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setHarvest((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="harvestYield">Yield:</label>
                    <input
                      type="number"
                      id="harvestYield"
                      name="harvestYield"
                      value={harvest.yield}
                      className="input-tag"
                      disabled={!(edit === "true")}
                      onChange={(e) =>
                        setHarvest((prev) => ({
                          ...prev,
                          yield: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <div>
                    {farm.harvest.date && (
                      <div className="flex space-x-5">
                        <div>Date:</div>
                        <div>
                          {
                            new Date(farm.harvest.date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-5">
                      <div>Yield:</div>
                      <div>{farm.harvest.yield}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {edit ? (
              <button
                className="btn bg-green-600 text-white"
                onClick={handleOnSave}
              >
                Save
              </button>
            ) : (
              <button
                className="btn bg-black text-white"
                onClick={handleOnEdit}
              >
                Edit / Add
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default page;
