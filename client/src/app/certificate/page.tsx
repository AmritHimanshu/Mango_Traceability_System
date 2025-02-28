"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useSearchParams } from "next/navigation";
import { Farm, userCert } from "@/utils/Types/interfaces";
import dynamic from "next/dynamic";
import { CERTIFICATE_FARM_DETAIL } from "@/utils/Apis/api";
import { isMobile } from "@/utils/IsMobile/isMobile";
import ListFarmApplicationsData from "@/app/components/farmer/ListFarmApplicationsData";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
const Certificate = dynamic(() => import("@/app/certificate/Certificate"), {
  ssr: false,
});
const Map = dynamic(() => import("@/app/components/farmer/MapCoordinates"), {
  ssr: false,
});
import CloseIcon from "@mui/icons-material/Close";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();
  const [userData, setUserData] = useState<userCert>();
  const [isPDF, setIsPDF] = useState(false);

  const fetchFarmData = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${CERTIFICATE_FARM_DETAIL}/${farm_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setFarmData(data.farm);
      setUserData(data.user);
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

  const handleDownload = () => {
    if (isMobile()) {
      setIsPDF(true);
    } else {
      setIsPDF(true);
    }
  };

  return (
    <div className="page-main-div-certificate">
      <CustomLoadingBar ref={loadingBarRef} />

      {farmData && !isPDF ? (
        <>
          <div className="sspace-y-5 lg:space-y-10 my-5">
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
                    {
                      new Date(farmData.ploughingDate)
                        .toISOString()
                        .split("T")[0]
                    }
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
                    {
                      new Date(farmData.floweringDate)
                        .toISOString()
                        .split("T")[0]
                    }
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
                    <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
                      <thead></thead>
                      <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
                        {farmData.weedingDate
                          .reduce<string[][]>((acc, date, index) => {
                            if (index % 3 === 0) acc.push([]);
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
                  <div className="font-bold">Irrigation Dates:</div>
                  <>
                    <table className="table">
                      <thead>
                        <tr className="table-head-tr">
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
                      <tbody className="table-body">
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
                                {farmData.irrigationDates.natural.length >
                                  0 && (
                                  <td className="table-body-tr-td">
                                    {farmData.irrigationDates.natural[index]
                                      ? new Date(
                                          farmData.irrigationDates.natural[
                                            index
                                          ]
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
              onClick={handleDownload}
              className="!w-[130px] md:!w-[150px] lg:!w-[200px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-900 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            >
              Download PDF
            </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-2 text-right">
            <CloseIcon onClick={() => setIsPDF(false)} />
          </div>
          <Certificate
            farmData={farmData}
            userData={userData}
            farm_id={farm_id}
          />
        </>
      )}
    </div>
  );
}

export default page;
