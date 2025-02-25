"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_FETCH_FARMER_FARM_DATA } from "@/utils/Apis/api";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { CERTIFICATE, FARMER, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import QRCode from "react-qr-code";
import { Farm } from "@/utils/Types/interfaces";
import Heading from "@/app/components/common/Heading";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import CloseIcon from "@mui/icons-material/Close";
import Message from "@/app/components/common/Message";
import Edit_Farm from "@/app/components/admin/Edit_Farm";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();
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

  return (
    <div className="page-main-div relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      {farmData && <Heading text={farmData.farm} />}

      {farmData && !isQRCode ? (
        <div className="space-y-5 lg:space-y-10 my-5">
          <div className="text-right">
            <button
              className="!w-[130px] md:!w-[150px] lg:!w-[200px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          </div>

          <Map coordinates={farmData.geoFenceData} height="300px" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="font-bold">ID:</div>
              <div className="text-sm">{farmData.uniqueID}</div>
            </div>
            {farmData.area && (
              <div className="flex items-center space-x-3">
                <div className="font-bold">Area:</div>
                <div>{farmData.area.toFixed(2)} sq. m</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {farmData.farm && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Farm Name:</div>
                <div>{farmData.farm}</div>
              </div>
            )}

            {farmData.crop && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Crop Name:</div>
                <div>{farmData.crop}</div>
              </div>
            )}

            {farmData.ploughingDate && (
              <div className="flex items-star items-center space-x-3">
                <div className="font-bold">Ploughing Date:</div>
                <div>
                  {new Date(farmData.ploughingDate).toISOString().split("T")[0]}
                </div>
              </div>
            )}

            {farmData.sowingDate && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Sowing Date:</div>
                <div>
                  {new Date(farmData.sowingDate).toISOString().split("T")[0]}
                </div>
              </div>
            )}

            {farmData.floweringDate && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Flowering Date:</div>
                <div>
                  {new Date(farmData.floweringDate).toISOString().split("T")[0]}
                </div>
              </div>
            )}

            {farmData.pheromoneTrapDate && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Pheromone Trap Date:</div>
                <div>
                  {
                    new Date(farmData.pheromoneTrapDate)
                      .toISOString()
                      .split("T")[0]
                  }
                </div>
              </div>
            )}

            {farmData.lureChangeDate && (
              <div className="flex items-start space-x-3">
                <div className="font-bold">Lure Change Date:</div>
                <div>
                  {
                    new Date(farmData.lureChangeDate)
                      .toISOString()
                      .split("T")[0]
                  }
                </div>
              </div>
            )}

            {farmData.harvest && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Harvest Date:</div>
                <div>
                  {farmData.harvest.date && (
                    <div className="flex space-x-5">
                      <div>Date:</div>
                      <div>
                        {
                          new Date(farmData.harvest.date)
                            .toISOString()
                            .split("T")[0]
                        }
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-5">
                    <div>Yield:</div>
                    <div>{farmData.harvest.yield}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {farmData.weedingDate.length > 0 && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Weeding Date:</div>
                <>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead></thead>
                    <tbody>
                      {farmData.weedingDate
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

            {(farmData.irrigationDates.artificial.length > 0 ||
              farmData.irrigationDates.natural.length > 0) && (
              <div className="flex items-start flex-col space-y-3">
                <div className="font-bold">Irrigation Dates:</div>
                <>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
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
                    <tbody>
                      {(() => {
                        const maxLength = Math.max(
                          farmData.irrigationDates.artificial.length,
                          farmData.irrigationDates.natural.length
                        );

                        return Array.from({ length: maxLength }).map(
                          (_, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                            >
                              {farmData.irrigationDates.artificial.length >
                                0 && (
                                <td className="border border-gray-300 px-4 py-2">
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
                                <td className="border border-gray-300 px-4 py-2">
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
                <div className="font-bold">Fertilizer Application:</div>
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
                <div className="font-bold">Pesticide Application:</div>
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
                <div className="font-bold">Bagging:</div>
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
                <div className="font-bold">Special care:</div>
                <ListFarmApplicationsData
                  data={farmData.specialCare}
                  columns={[
                    { header: "Date", key: "date" },
                    { header: "Name", key: "name" },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              className="!w-[130px] md:!w-[150px] lg:!w-[200px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-900 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
              onClick={() => setIsQRCode(true)}
            >
              Generate QR code
            </button>
          </div>
        </div>
      ) : (
        <>
          {isQRCode && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">QR Code for Certificate</h2>
                <CloseIcon
                  className="cursor-pointer"
                  onClick={() => setIsQRCode(false)}
                />
              </div>
              <div className="flex justify-center items-center bg-white p-4">
                <QRCode
                  value={`${FRONTEND_BASE_URL}/${CERTIFICATE}?farm_id=${farm_id}`}
                  size={200}
                />
              </div>
            </div>
          )}
        </>
      )}

      {isEdit && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <Edit_Farm onclick={setIsEdit}/>
        </div>
      )}
    </div>
  );
}

export default page;
