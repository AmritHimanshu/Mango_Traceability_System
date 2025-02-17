"use client";

import React from "react";
import { ListFarmTableProps } from "@/utils/Types/interfaces";

function ListFarmTable({ farms, handleClick }: ListFarmTableProps) {

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] border-2 table-fixed">
        <thead>
          <tr className="text-start font-bold bg-gray-200">
            <td className="px-2 py-4 border-y-2">ID</td>
            <td className="px-2 py-4 border-y-2">Farm Name</td>
            <td className="px-2 py-4 border-y-2">Crop Name</td>
            <td className="px-2 py-4 border-y-2">Created on</td>
            <td className="px-2 py-4 border-y-2"></td>
          </tr>
        </thead>

        <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
          {farms.map((farm, index) => (
            <tr key={index} className="text-start even:bg-gray-50">
              <td
                className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.uniqueID}
              >
                {farm.uniqueID}
              </td>
              <td
                className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.farm}
              >
                {farm.farm}
              </td>
              <td
                className="px-2 py-4 border-y-2 w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.crop}
              >
                {farm.crop}
              </td>
              <td className="px-2 py-4 border-y-2 w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {new Date(farm.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </td>
              <td className="px-2 border-y-2 text-end">
                <button
                  className="w-[30px] md:w-[50px] lg:w-[100px] bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white py-2 rounded-sm duration-200"
                  onClick={() => handleClick(farm._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListFarmTable;
