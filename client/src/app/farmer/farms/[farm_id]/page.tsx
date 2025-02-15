"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import {
  FARMER_DELETE_FARM_DATA,
  FARMER_FETCH_FARM_DATA,
} from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import dynamic from "next/dynamic";
import Heading from "@/app/components/common/Heading";
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import Message from "@/app/components/common/Message";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [message, setMessage] = useState({ text: "", type: "" });

  const [farm, setFarm] = useState<Farm>();

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

  const handleOnEdit = () => {
    router.push(`${FARMS}/${id}/edit`);
  };

  const handleOnDelete = async () => {
    if (!confirm("Do you want to delete this farm?")) {
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${FARMER_DELETE_FARM_DATA}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 403) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      } else if (res.status === 404 || res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      } else if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "error" });
      router.push(FARMS);
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

      {farm?.farm && <Heading text={farm.farm} />}

      {farm && (
        <>
          <button
            onClick={handleOnDelete}
            className="my-5 bg-red-600 text-white hover:bg-red-100 hover:text-red-600 duration-200 rounded-sm px-2 py-2"
          >
            Delete
          </button>

          <div className="space-y-5 lg:space-y-10 my-5">
            <Map coordinates={farm.geoFenceData} height="300px" />

            {farm.area && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Area:</div>
                <div>{farm.area.toFixed(2)} sq. m</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
              {farm.farm && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Farm Name:</div>
                  <div>{farm.farm}</div>
                </div>
              )}

              {farm.crop && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Crop Name:</div>
                  <div>{farm.crop}</div>
                </div>
              )}

              {farm.ploughingDate && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Ploughing Date:</div>
                  <div>
                    {new Date(farm.ploughingDate).toISOString().split("T")[0]}
                  </div>
                </div>
              )}

              {farm.sowingDate && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Sowing Date:</div>
                  <div>
                    {new Date(farm.sowingDate).toISOString().split("T")[0]}
                  </div>
                </div>
              )}

              {farm.floweringDate && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Flowering Date:</div>
                  <div>
                    {new Date(farm.floweringDate).toISOString().split("T")[0]}
                  </div>
                </div>
              )}

              {farm.pheromoneTrapDate && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Pheromone Trap Date:</div>
                  <div>
                    {
                      new Date(farm.pheromoneTrapDate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </div>
                </div>
              )}

              {farm.lureChangeDate && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold">Lure Change Date:</div>
                  <div>
                    {new Date(farm.lureChangeDate).toISOString().split("T")[0]}
                  </div>
                </div>
              )}

              {farm.harvest && (
                <div className="flex items-start flex-col space-y-3">
                  <div className="font-bold">Harvest Date:</div>
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
                </div>
              )}
            </div>

            {farm.weedingDate.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Weeding Date:</div>
                <>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead></thead>
                    <tbody>
                      {farm.weedingDate
                        .reduce<string[][]>((acc, date, index) => {
                          if (index % 3 === 0) acc.push([]);
                          acc[acc.length - 1].push(date);
                          return acc;
                        }, [])
                        .map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="text-center hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                          >
                            {row.map((date, index) => (
                              <td
                                key={index}
                                className="border border-gray-300 p-2"
                              >
                                {new Date(date).toISOString().split("T")[0]}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              </div>
            )}

            {(farm.irrigationDates.artificial.length > 0 ||
              farm.irrigationDates.natural.length > 0) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Irrigation Dates:</div>
                <>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {farm.irrigationDates.artificial.length > 0 && (
                          <th className="border border-gray-300 px-4 py-2">
                            Artificial
                          </th>
                        )}
                        {farm.irrigationDates.natural.length > 0 && (
                          <th className="border border-gray-300 px-4 py-2">
                            Natural
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const maxLength = Math.max(
                          farm.irrigationDates.artificial.length,
                          farm.irrigationDates.natural.length
                        );

                        return Array.from({ length: maxLength }).map(
                          (_, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                            >
                              {farm.irrigationDates.artificial.length > 0 && (
                                <td className="border border-gray-300 px-4 py-2">
                                  {farm.irrigationDates.artificial[index]
                                    ? new Date(
                                        farm.irrigationDates.artificial[index]
                                      )
                                        .toISOString()
                                        .split("T")[0]
                                    : ""}
                                </td>
                              )}
                              {farm.irrigationDates.natural.length > 0 && (
                                <td className="border border-gray-300 px-4 py-2">
                                  {farm.irrigationDates.natural[index]
                                    ? new Date(
                                        farm.irrigationDates.natural[index]
                                      )
                                        .toISOString()
                                        .split("T")[0]
                                    : ""}
                                </td>
                              )}
                            </tr>
                          )
                        );
                      })()}
                    </tbody>
                  </table>
                </>
              </div>
            )}

            {farm.fertilizerApplications.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Fertilizer Application:</div>
                <ListFarmApplicationsData
                  data={farm.fertilizerApplications}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Volume (L)", key: "volume" },
                  ]}
                />
              </div>
            )}

            {farm.pesticideApplications.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Pesticide Application:</div>
                <ListFarmApplicationsData
                  data={farm.pesticideApplications}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Volume (L)", key: "volume" },
                  ]}
                />
              </div>
            )}

            {farm.bagging.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Bagging:</div>
                <ListFarmApplicationsData
                  data={farm.bagging}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Quantity", key: "quantity" },
                  ]}
                />
              </div>
            )}

            {farm.specialCare.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Special care:</div>
                <ListFarmApplicationsData
                  data={farm.specialCare}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Name", key: "name" },
                  ]}
                />
              </div>
            )}

            <button
              className="btn bg-blue-500 text-white hover:bg-blue-600 duration-200"
              onClick={handleOnEdit}
            >
              Add data
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default page;
