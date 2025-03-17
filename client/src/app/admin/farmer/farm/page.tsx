"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ADMIN_FETCH_FARMER_FARM_DATA, GENERATE_PDF } from "@/utils/Apis/api";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import {
  ADMIN_FARM,
  FARMER,
  LOGIN,
  NOT_FOUND,
} from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import QRCode from "react-qr-code";
import { Farm, userCert } from "@/utils/Types/interfaces";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import CloseIcon from "@mui/icons-material/Close";
import Message from "@/app/components/common/Message";
import Edit_Farm from "@/app/components/admin/Edit_Farm";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();
  const [userData, setUserData] = useState<userCert>();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isQRCode, setIsQRCode] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
        const error = new Error(data.error);
        throw error;
      }

      setFarmData(data.farm);
      setUserData(data.user);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleOnClose = (bool: boolean) => {
    setIsEdit(bool);
    fetchFarmData();
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  const handleOnAddData = () => {
    router.push(`${ADMIN_FARM}/edit?farm_id=${farm_id}`);
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
              {userData?.name}
            </div>
            {/* <div className="text-[30px] md:text-[50px] font-bold text-customOrange">
              Farm
            </div> */}
            <div className="text-customOrange text-[20px] md:text-[30px]">
              {farmData?.farm}
            </div>
          </div>
        </div>
      </div>

      {farmData && (
        <div className="my-5 max-w-[90%] m-auto text-black space-y-5 lg:space-y-10">
          <div className="space-x-2 text-right">
            <button
              className="!w-[100px] text-button-size bg-green-600 text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
              onClick={() => handleOnAddData()}
            >
              Add data
            </button>
            <button
              className="!w-[100px] text-button-size bg-red-600 text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          </div>

          <Map coordinates={farmData.geoFenceData} height="300px" />

          <div className="flex items-center justify-between">
            <div>
              {farmData.farm && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-title-size">Farm Name:</div>
                  <div className="text-description-size">{farmData.farm}</div>
                </div>
              )}

              {farmData.crop && (
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-title-size">Crop Name:</div>
                  <div className="text-description-size">{farmData.crop}</div>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <div className="font-bold text-title-size">ID:</div>
                <div className="text-description-size">{farmData.uniqueID}</div>
              </div>
              {farmData.area && (
                <div className="flex items-center space-x-3">
                  <div className="font-bold text-title-size">Area:</div>
                  <div className="text-description-size">{farmData.area.toFixed(2)} sq. m</div>
                </div>
              )}
            </div>
          </div>

          <div>
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
                      {farmData?.ploughingDate ? (
                        <>
                          {
                            new Date(farmData.ploughingDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farmData?.sowingDate ? (
                        <>
                          {
                            new Date(farmData.sowingDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farmData?.floweringDate ? (
                        <>
                          {
                            new Date(farmData.floweringDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farmData?.pheromoneTrapDate ? (
                        <>
                          {
                            new Date(farmData.pheromoneTrapDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </>
                      ) : (
                        <>{"-"}</>
                      )}
                    </td>
                    <td className="table-body-tr-td">
                      {farmData?.lureChangeDate ? (
                        <>
                          {
                            new Date(farmData.lureChangeDate)
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {farmData.weedingDate.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Weeding Date:</div>
                <>
                  <table className="w-full table-fixed">
                    <thead></thead>
                    <tbody className="text-description-size">
                      {farmData.weedingDate
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

            {(farmData.irrigationDates.artificial.length > 0 ||
              farmData.irrigationDates.natural.length > 0) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Irrigation Dates:</div>
                <>
                  <table className="short-table">
                    <thead>
                      <tr className="table-head-tr text-table-head-size">
                        {farmData.irrigationDates.artificial.length > 0 && (
                          <th className="border border-gray-300 px-4 py-2">
                            Artificial
                          </th>
                        )}
                        {farmData.irrigationDates.natural.length > 0 && (
                          <th className="border border-gray-300 px-4 py-2">
                            Natural
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="table-body text-table-body-size">
                      {(() => {
                        const maxLength = Math.max(
                          farmData.irrigationDates.artificial.length,
                          farmData.irrigationDates.natural.length
                        );

                        return Array.from({ length: maxLength }).map(
                          (_, index) => (
                            <tr key={index} className="table-body-tr">
                              {farmData.irrigationDates.artificial.length >
                                0 && (
                                <td className="table-body-tr-td">
                                  {farmData.irrigationDates.artificial[index]
                                    ? new Date(
                                        farmData.irrigationDates.artificial[
                                          index
                                        ]
                                      )
                                        .toISOString()
                                        .split("T")[0]
                                    : ""}
                                </td>
                              )}
                              {farmData.irrigationDates.natural.length > 0 && (
                                <td className="table-body-tr-td">
                                  {farmData.irrigationDates.natural[index]
                                    ? new Date(
                                        farmData.irrigationDates.natural[index]
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

            {farmData.fertilizerApplications.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Fertilizer Application:</div>
                <ListFarmApplicationsData
                  data={farmData.fertilizerApplications}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Volume (L)", key: "volume" },
                  ]}
                />
              </div>
            )}

            {farmData.pesticideApplications.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Pesticide Application:</div>
                <ListFarmApplicationsData
                  data={farmData.pesticideApplications}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Volume (L)", key: "volume" },
                  ]}
                />
              </div>
            )}

            {farmData.bagging.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Bagging:</div>
                <ListFarmApplicationsData
                  data={farmData.bagging}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Quantity", key: "quantity" },
                  ]}
                />
              </div>
            )}

            {farmData.specialCare.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Special care:</div>
                <ListFarmApplicationsData
                  data={farmData.specialCare}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Name", key: "name" },
                  ]}
                />
              </div>
            )}

            {farmData.harvest && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold text-title-size">Harvest:</div>
                <table className="short-table">
                  <thead>
                    <tr className="table-head-tr text-table-head-size">
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Yield (kg)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body text-table-body-size">
                    <tr className="table-body-tr">
                      <td className="table-body-tr-td">
                        {
                          new Date(farmData.harvest.date)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="table-body-tr-td">
                        {farmData.harvest.yield}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              className="!w-[130px] md:!w-[150px] lg:!w-[200px] text-button-size bg-green-900 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
              onClick={() => setIsQRCode(true)}
            >
              Generate QR code
            </button>
          </div>
        </div>
      )}

      {isQRCode && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <div className="bg-white p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y- rounded-md">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-button-size">
                Scan QR Code for the Certificate
              </h2>
              <CloseIcon
                className="cursor-pointer text-red-600"
                onClick={() => setIsQRCode(false)}
              />
            </div>
            <div className="flex justify-center items-center bg-white p-4">
              <QRCode
                value={`${BASE_URL}/${GENERATE_PDF}?farm_id=${farm_id}`}
                size={200}
              />
            </div>
          </div>
        </div>
      )}

      {isEdit && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <Edit_Farm onclick={handleOnClose} />
        </div>
      )}
    </div>
  );
}

export default page;
