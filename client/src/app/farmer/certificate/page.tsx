"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useSearchParams } from "next/navigation";
import { Farm } from "@/utils/Types/interfaces";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CERTIFICATE_FARM_DETAIL } from "@/utils/Apis/api";
import ListFarmApplicationsData from "@/app/components/farmer/components/ListFarmApplicationsData";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
const Map = dynamic(
  () => import("@/app/components/farmer/components/MapCoordinates"),
  {
    ssr: false,
  }
);

class PDFWithAutoTable extends jsPDF {
  autoTable(options: any) {
    // @ts-ignore
    super.autoTable(options);
  }
}

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();

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

      setFarmData(data);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleDownloadPDF = (farmData: Farm) => {
    const doc = new PDFWithAutoTable();

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const tableData = [
      ["Farm id", farm_id ? `${farm_id}` : " - "],
      ["Farmer Name", farmData.userId.name ? `${farmData.userId.name}` : " - "],
      [
        "Farmer Email",
        farmData.userId.email ? `${farmData.userId.email}` : " - ",
      ],
      ["Farm name", farmData.farm ? `${farmData.farm}` : " - "],
      ["Crop name", farmData.crop ? `${farmData.crop}` : " - "],
      [
        "Ploughing date",
        farmData.ploughingDate
          ? `${new Date(farmData.ploughingDate).toISOString().split("T")[0]}`
          : " - ",
      ],
      [
        "Weeding date",
        farmData.weedingDate
          ? `${new Date(farmData.weedingDate).toISOString().split("T")[0]}`
          : " - ",
      ],
      [
        "Sowing date",
        farmData.sowingDate
          ? `${new Date(farmData.sowingDate).toISOString().split("T")[0]}`
          : " - ",
      ],
      [
        "Flowering date",
        farmData.floweringDate
          ? `${new Date(farmData.floweringDate).toISOString().split("T")[0]}`
          : " - ",
      ],
      [
        "Pheromone Trap date",
        farmData.pheromoneTrapDate
          ? `${
              new Date(farmData.pheromoneTrapDate).toISOString().split("T")[0]
            }`
          : " - ",
      ],
      [
        "Lure change date",
        farmData.lureChangeDate
          ? `${new Date(farmData.lureChangeDate).toISOString().split("T")[0]}`
          : " - ",
      ],
      [
        "Irrigation date",
        <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {farmData.irrigationDates.artificial.length > 0 && (
              <th className="border border-gray-300 px-4 py-2">Artificial</th>
            )}
            {farmData.irrigationDates.natural.length > 0 && (
              <th className="border border-gray-300 px-4 py-2">Natural</th>
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
                      ? new Date(farmData.irrigationDates.natural[index])
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </td>
                )}
              </tr>
            ));
          })()}
        </tbody>
      </table>,
      ],
    ];

    doc.autoTable({
      startY: 40,
      head: [["Farm", "Details"]],
      body: tableData,
      headStyles: { fontSize: 18, fontStyle: "bold" },
      styles: { fontSize: 15, fontStyle: "semibold" },
    });

    doc.save(`Invoice_${farm_id}.pdf`);
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)] relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {farmData && (
        <>
          <div className="space-y-3 my-5">
            <Map coordinates={farmData.geoFenceData} height="300px" />

            <div className="bg-cardBackground p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="font-bold">Farmer Name: </div>
                <div>{farmData.userId.name}</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="font-bold">Farmer Email: </div>
                <div>{farmData.userId.email}</div>
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
              <div className="flex items-center space-x-3">
                <div className="font-bold">Weeding Date:</div>
                <div>
                  {new Date(farmData.weedingDate).toISOString().split("T")[0]}
                </div>
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
                  {
                    new Date(farmData.lureChangeDate)
                      .toISOString()
                      .split("T")[0]
                  }
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

                      return Array.from({ length: maxLength }).map(
                        (_, index) => (
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
                        )
                      );
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
                    {
                      new Date(farmData.harvest.date)
                        .toISOString()
                        .split("T")[0]
                    }
                  </div>
                </div>
                <div className="flex space-x-5">
                  <div>Yield:</div>
                  <div>{farmData.harvest.yield}</div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => handleDownloadPDF(farmData)}
            className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

export default page;
