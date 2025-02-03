"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_FETCH_FARMER_FARM_DATA } from "@/utils/Apis/api";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { CERTIFICATE, FARMER, LOGIN } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import QRCode from "react-qr-code";
import { Farm } from "@/utils/Types/interfaces";
import Heading from "@/app/components/admin/Heading";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import CloseIcon from "@mui/icons-material/Close";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();
  const [isQRCode, setIsQRCode] = useState(false);

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

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        router.push(FARMER);
        const error = new Error(data.error);
        throw error;
      }

      setFarmData(data);
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

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {farmData && <Heading text={farmData.farm} />}

      {farmData && !isQRCode ? (
        <div className="space-y-3 my-5">
          <Map coordinates={farmData.geoFenceData} height="300px" />

          {farmData.area && (
            <div className="flex items-center space-x-3">
              <div className="font-bold">Farm Area: </div>
              <div>{farmData.area.toFixed(2)} sq. m</div>
            </div>
          )}

          <div className="bg-cardBackground p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="font-bold">Farmer Name: </div>
              <div>{farmData.userId.name}</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="font-bold">Farmer Email: </div>
              <div>{farmData.userId.email}</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="font-bold">Farmer Phone: </div>
              <div>{farmData.userId.phone}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="font-bold">Farm name:</div>
            <div>{farmData.farm}</div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="font-bold">Crop name:</div>
            <div>{farmData.crop}</div>
          </div>

          {farmData.ploughingDate && (
            <div className="flex items-center space-x-3">
              <div className="font-bold">Ploughing Date:</div>
              <div>
                {new Date(farmData.ploughingDate).toISOString().split("T")[0]}
              </div>
            </div>
          )}

          {farmData.weedingDate && (
            <div className="flex flex-col space-y-3">
              <div className="font-bold">Weeding Dates:</div>
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
            </div>
          )}

          {farmData.sowingDate && (
            <div className="flex items-center space-x-3">
              <div className="font-bold">Sowing Date:</div>
              <div>
                {new Date(farmData.sowingDate).toISOString().split("T")[0]}
              </div>
            </div>
          )}

          {farmData.floweringDate && (
            <div className="flex items-center space-x-3">
              <div className="font-bold">Flowering Date:</div>
              <div>
                {new Date(farmData.floweringDate).toISOString().split("T")[0]}
              </div>
            </div>
          )}

          {farmData.pheromoneTrapDate && (
            <div className="flex items-center space-x-3">
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
            <div className="flex items-center space-x-3">
              <div className="font-bold">Lure Change Date:</div>
              <div>
                {new Date(farmData.lureChangeDate).toISOString().split("T")[0]}
              </div>
            </div>
          )}

          {(farmData.irrigationDates.artificial.length > 0 ||
            farmData.irrigationDates.natural.length > 0) && (
            <div className="mt-4">
              <div className="font-bold mb-2">Irrigation Dates:</div>
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

                    return Array.from({ length: maxLength }).map((_, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                      >
                        {farmData.irrigationDates.artificial.length > 0 && (
                          <td className="border border-gray-300 px-4 py-2">
                            {farmData.irrigationDates.artificial[index]
                              ? new Date(
                                  farmData.irrigationDates.artificial[index]
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
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {farmData.fertilizerApplications.length > 0 && (
            <>
              <div className="font-bold">Fertilizer Application:</div>
              <ListFarmApplicationsData
                data={farmData.fertilizerApplications}
                columns={[
                  { header: "Date", key: "date" },
                  { header: "Volume (L)", key: "volume" },
                ]}
              />
            </>
          )}

          {farmData.pesticideApplications.length > 0 && (
            <>
              <div className="font-bold">Pesticide Application:</div>
              <ListFarmApplicationsData
                data={farmData.pesticideApplications}
                columns={[
                  { header: "Date", key: "date" },
                  { header: "Volume (L)", key: "volume" },
                ]}
              />
            </>
          )}

          {farmData.bagging.length > 0 && (
            <>
              <div className="font-bold">Bagging:</div>
              <ListFarmApplicationsData
                data={farmData.bagging}
                columns={[
                  { header: "Date", key: "date" },
                  { header: "Quantity", key: "quantity" },
                ]}
              />
            </>
          )}

          {farmData.specialCare.length > 0 && (
            <>
              <div className="font-bold">Special care:</div>
              <ListFarmApplicationsData
                data={farmData.specialCare}
                columns={[
                  { header: "Date", key: "date" },
                  { header: "Name", key: "name" },
                ]}
              />
            </>
          )}

          {farmData.harvest && (
            <>
              <div className="font-bold">Harvest:</div>
              <div className="flex space-x-5">
                <div>Date:</div>
                <div>
                  {new Date(farmData.harvest.date).toISOString().split("T")[0]}
                </div>
              </div>
              <div className="flex space-x-5">
                <div>Yield:</div>
                <div>{farmData.harvest.yield}</div>
              </div>
            </>
          )}

          <button
            className="btn bg-blue-500 text-white hover:bg-blue-600 duration-200"
            onClick={() => setIsQRCode(true)}
          >
            Generate QR code
          </button>
        </div>
      ) : (
        <>
          {isQRCode && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">QR Code for Certificate</h2>
                <CloseIcon className="cursor-pointer" onClick={() => setIsQRCode(false)} />
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
    </div>
  );
}

export default page;
