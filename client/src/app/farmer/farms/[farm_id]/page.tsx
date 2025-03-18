"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import {
  FARMER_DELETE_FARM_DATA,
  FARMER_FETCH_FARM_DATA,
} from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { Farm } from "@/utils/Types/interfaces";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import Message from "@/app/components/common/Message";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";
import Banner from "@/app/components/common/Banner";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDelete, setIsDelete] = useState(false);

  const [farm, setFarm] = useState<Farm>();

  const fetchfarm = async () => {
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
    fetchfarm();
  }, []);

  const handleOnEdit = () => {
    router.push(`${FARMS}/${id}/edit`);
  };

  const handleOnDelete = async () => {
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

    setIsDelete(false);

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

      <Banner
        img_src="/assets/plant.jpg"
        img_alt="Plant"
        heading={farm?.farm}
        description={farm?.landmark}
      />

      {farm && (
        <div className="my-5 max-w-[90%] m-auto text-black">
          <div className="text-end">
            <button
              className="!w-[120px] text-button-size bg-customGreen text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
              onClick={handleOnEdit}
            >
              Add data
            </button>
          </div>

          <div className="space-y-5 lg:space-y-10 my-4 text-[10px] md:text-[13px] lg:text-[16px]">
            <Map coordinates={farm.geoFenceData} height="300px" />

            <div className="flex items-center justify-between">
              <div>
                {farm.farm && (
                  <div className="flex items-start space-x-3">
                    <div className="font-bold text-title-size">Farm Name:</div>
                    <div className="text-description-size">{farm.farm}</div>
                  </div>
                )}

                {farm.crop && (
                  <div className="flex items-start space-x-3">
                    <div className="font-bold text-title-size">Crop Name:</div>
                    <div className="text-description-size">{farm.crop}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="font-bold text-title-size">ID:</div>
                  <div className="text-description-size">{farm.uniqueID}</div>
                </div>
                {farm.area && (
                  <div className="flex items-center space-x-3">
                    <div className="font-bold text-title-size">Area:</div>
                    <div className="text-description-size">
                      {farm.area.toFixed(2)} sq. m
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="table-head-tr text-table-head-size">
                    <th>Ploughing Date</th>
                    <th>Sowing Date</th>
                    <th>Flowering Date:</th>
                    <th>Pheromone Trap Date</th>
                    <th>Lure Change Date</th>
                  </tr>
                </thead>
                <tbody className="table-body text-table-body-size">
                  <tr className="table-body-tr">
                    <td className="table-body-tr-td">
                      {farm?.ploughingDate ? (
                        <>
                          {
                            new Date(farm.ploughingDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farm?.sowingDate ? (
                        <>
                          {
                            new Date(farm.sowingDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farm?.floweringDate ? (
                        <>
                          {
                            new Date(farm.floweringDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farm?.pheromoneTrapDate ? (
                        <>
                          {
                            new Date(farm.pheromoneTrapDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farm?.lureChangeDate ? (
                        <>
                          {
                            new Date(farm.lureChangeDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              {farm.weedingDate.length > 0 && (
                <div className="flex items-start flex-col space-y-3">
                  <div className="font-bold text-title-size">Weeding Date:</div>
                  <>
                    <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
                      <thead></thead>
                      <tbody className="text-description-size">
                        {farm.weedingDate
                          .reduce<string[][]>((acc, date, index) => {
                            if (index % 2 === 0) acc.push([]);
                            acc[acc.length - 1].push(date);
                            return acc;
                          }, [])
                          .map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="text-black border-[1px] border-black"
                            >
                              {row.map((date, index) => (
                                <td
                                  key={index}
                                  className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
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
                  <div className="font-bold text-title-size">
                    Irrigation Dates:
                  </div>
                  <>
                    <table className="short-table">
                      <thead>
                        <tr className="table-head-tr text-table-head-size">
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
                      <tbody className="table-body text-table-body-size">
                        {(() => {
                          const maxLength = Math.max(
                            farm.irrigationDates.artificial.length,
                            farm.irrigationDates.natural.length
                          );

                          return Array.from({ length: maxLength }).map(
                            (_, index) => (
                              <tr key={index} className="table-body-tr">
                                {farm.irrigationDates.artificial.length > 0 && (
                                  <td className="table-body-tr-td">
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
                                  <td className="table-body-tr-td">
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
                  <div className="font-bold text-title-size">
                    Fertilizer Application:
                  </div>
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
                  <div className="font-bold text-title-size">
                    Pesticide Application:
                  </div>
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
                  <div className="font-bold text-title-size">Bagging:</div>
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
                  <div className="font-bold text-title-size">Special care:</div>
                  <ListFarmApplicationsData
                    data={farm.specialCare}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Name", key: "name" },
                    ]}
                  />
                </div>
              )}

              {farm.harvest && (
                <div className="flex items-start flex-col space-y-3">
                  <div className="font-bold text-title-size">Harvest:</div>
                  <table className="short-table">
                    <thead>
                      <tr className="table-head-tr text-table-head-size">
                        <th className="border border-gray-300 px-4 py-2">
                          Date
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Yield (kg)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-body text-table-body-size">
                      <tr className="table-body-tr">
                        <td className="table-body-tr-td">
                          {
                            new Date(farm.harvest.date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="table-body-tr-td">
                          {farm.harvest.yield}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="my-3 text-center">
              <button
                onClick={() => setIsDelete(true)}
                className="!w-[100px] text-button-size bg-red-600 text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDelete && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <div className="bg-white text-black p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5 rounded-md">
            <div>
              <div className="text-sm md:text-xl">
                Are you sure, you want to delete?
              </div>
            </div>
            <div className="text-end text-[11px] md:text-lg space-x-2">
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </button>
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => handleOnDelete()}
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
