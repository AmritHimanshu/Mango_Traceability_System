"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FARMER_FETCH_FARM_DATA, FARMER_SAVE_FARM_DATA } from "@/utils/Apis/api";
import { FARMS, LOGIN } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
const Map = dynamic(
  () => import("@/app/components/farmer/components/MapCoordinates"),
  {
    ssr: false,
  }
);

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
    fertilizerApplications: [],
    pesticideApplications: [],
    bagging: [],
    specialCare: [],
    harvest: "",
  });
  console.log(farm);

  const [changedFarmData, setChangedFarmData] = useState({});
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
    try {
      const res = await fetch(`${BASE_URL}/${FARMER_FETCH_FARM_DATA}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status !== 201) {
        router.push(LOGIN);
      }

      console.log("Data: ", data);

      setFarm({
        farm: data.farm || "",
        crop: data.crop.name || "",
        geoFenceData: data.geoFenceData || [{ lat: 0, lng: 0 }],
        ploughingDate: data.crop.ploughingDate || "",
        weedingDate: data.crop.weedingDate || "",
        sowingDate: data.crop.sowingDate || "",
        floweringDate: data.crop.floweringDate || "",
        pheromoneTrapDate: data.crop.pheromoneTrapDate || "",
        lureChangeDate: data.crop.lureChangeDate || "",
        irrigationDates: {
          artificial: data.crop.irrigationDates?.artificial || "",
          natural: data.crop.irrigationDates?.natural || "",
        },
        fertilizerApplications: data.crop.fertilizerApplications || [],
        pesticideApplications: data.crop.pesticideApplications || [],
        bagging: data.crop.bagging || [],
        specialCare: data.crop.specialCare || [],
        harvest: data.crop.harvest || "",
      });
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
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

  const handleOnSave = async () => {
    try {
      const payload = {
        ...Object.fromEntries(
          Object.entries(changedFarmData).filter(([key, value]) => value !== "")
        ),
        ...(fertilizerApplications.date && fertilizerApplications.volume !== "0" ? { fertilizerApplications } : {}),
        ...(pesticideApplications.date && pesticideApplications.volume !== "0" ? { pesticideApplications } : {}),
        ...(bagging.date && bagging.quantity !== "0" ? { bagging } : {}),
        ...(specialCare.date && specialCare.name ? { specialCare } : {}),
        ...(harvest.date && harvest.yield !== "0" ? { harvest } : {}),
      };
  
      if (Object.keys(payload).length === 0) {
        alert("No changes to save!");
        router.push(`${FARMS}/${id}`);
        return;
      }

      console.log(payload);

      const res = await fetch(`${BASE_URL}/${FARMER_SAVE_FARM_DATA}/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if(res.status !== 201){
        alert(data.error);
        console.log(data.error);
        return;
      }

      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert("Error while saving changes.");
    }
  };
  

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)]">
      {farm && (
        <div className="space-y-10 my-5">
          <Map coordinates={farm.geoFenceData} />

          <div className="flex items-start flex-col">
            <label htmlFor="farm">Farm Name:</label>
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

          <div className="flex items-start flex-col">
            <label htmlFor="crop">Crop Name:</label>
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

          <div className="flex items-start flex-col">
            <label htmlFor="ploughingDate">Ploughing Date:</label>
            <input
              type="date"
              id="ploughingDate"
              name="ploughingDate"
              value={farm.ploughingDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="weedingDate">Weeding Date:</label>
            <input
              type="date"
              id="weedingDate"
              name="weedingDate"
              value={farm.weedingDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="sowingDate">Sowing Date:</label>
            <input
              type="date"
              id="sowingDate"
              name="sowingDate"
              value={farm.sowingDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="floweringDate">Flowering Date:</label>
            <input
              type="date"
              id="floweringDate"
              name="floweringDate"
              value={farm.floweringDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="pheromoneTrapDate">Pheromone Trap Date:</label>
            <input
              type="date"
              id="pheromoneTrapDate"
              name="pheromoneTrapDate"
              value={farm.pheromoneTrapDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="lureChangeDate">Lure Change Date:</label>
            <input
              type="date"
              id="lureChangeDate"
              name="lureChangeDate"
              value={farm.lureChangeDate}
              className="input-tag"
              disabled={!(edit === "true")}
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="irrigationDates">Irrigation Dates:</label>
            {edit && (
              <input
                type="text"
                id="irrigationDates"
                name="irrigationDates"
                value=""
                className="input-tag"
                disabled={!(edit === "true")}
                onChange={(e) => handleOnChange(e)}
              />
            )}
          </div>

          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Fertilizer Application:</div>
            {edit && (
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
                <label htmlFor="fertilizerVolume">Volume (in litre):</label>
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
            )}
          </div>

          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Pesticide Application:</div>
            {edit && (
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
            )}
          </div>

          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Bagging:</div>
            {edit && (
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
            )}
          </div>

          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Special care:</div>
            {edit && (
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
            )}
          </div>

          <div className="flex items-start flex-col space-y-3">
            <div className="font-bold">Harvest Date:</div>
            {edit && (
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
            )}
          </div>

          {edit ? (
            <button
              className="btn bg-green-600 text-white"
              onClick={handleOnSave}
            >
              Save
            </button>
          ) : (
            <button className="btn bg-black text-white" onClick={handleOnEdit}>
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default page;
