"use client";

import React from "react";
import { ListFarmTableProps } from "@/utils/Types/interfaces";

function ListFarmTable({ farms, handleClick }: ListFarmTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
      <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
        <thead>
          <tr className="font-bold bg-primarycColor bg-opacity-80 text-white">
            <td className="px-4 py-3 text-left">ID</td>
            <td className="px-4 py-3 text-left">Farm Name</td>
            <td className="px-4 py-3 text-left">Crop Name</td>
            <td className="px-4 py-3 text-left">Created on</td>
            <td className="px-4 py-3 text-left"></td>
          </tr>
        </thead>

        <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
          {farms.map((farm, index) => (
            <tr
              key={index}
              className="text-black bg-secondaryColor odd:bg-opacity-30 border-b-[1px] border-black last:border-b-0"
            >
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
              <td className="px-2 text-end">
                <button
                  className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-900 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
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
