"use client";

import React from "react";
import { ListFarmTableProps } from "@/utils/Types/interfaces";
import InfoIcon from "@mui/icons-material/Info";

function ListFarmTable({ farms, idxCalc, handleClick }: ListFarmTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full table-fixed">
          <thead>
            <tr className="font-bold bg-customGreen text-white text-table-head-size">
              <td className="px-4 py-3 text-left w-[100px]">S. No.</td>
              <td className="px-4 py-3 text-left">ID</td>
              <td className="px-4 py-3 text-left">Farm Name</td>
              <td className="px-4 py-3 text-left">Crop Name</td>
              <td className="px-4 py-3 text-left">Created on</td>
              <td className="px-4 py-3 text-left"></td>
            </tr>
          </thead>

          <tbody className="text-table-body-size">
            {farms.map((farm, index) => (
              <tr
                key={index}
                className="text-black bg-customGreen bg-opacity-10 odd:bg-opacity-5 border-b-[1px] border-black last:border-b-0"
              >
                <td className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {idxCalc + index + 1}
                </td>
                <td
                  className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={farm.uniqueID}
                >
                  {farm.uniqueID}
                </td>
                <td
                  className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={farm.farm}
                >
                  {farm.farm}
                </td>
                <td
                  className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={farm.crop}
                >
                  {farm.crop}
                </td>
                <td className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {new Date(farm.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </td>
                <td className="px-4 text-end">
                  <InfoIcon
                    style={{
                      color: "#31473A",
                      cursor: "pointer",
                      fontSize: "30px",
                    }}
                    onClick={() => handleClick(farm.uniqueID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListFarmTable;
