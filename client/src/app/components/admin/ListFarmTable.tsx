"use client";

import React from "react";
import { ListFarmTableProps } from "@/utils/Types/interfaces";
import { MDBBtn } from "mdb-react-ui-kit";

function ListFarmTable({ farms, handleClick }: ListFarmTableProps) {
  return (
    <div className="w-full max-w-[1100px] m-auto overflow-x-auto rounded-lg overflow-hidden shadow-2xl">
      <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
        <thead>
          <tr className="text-start font-bold bg-gray-600 text-white">
            <td className="px-2 py-4 border-y-2">ID</td>
            <td className="px-2 py-4 border-y-2">Farm Name</td>
            <td className="px-2 py-4 border-y-2">Crop Name</td>
            <td className="px-2 py-4 border-y-2">Created on</td>
            <td className="px-2 py-4 border-y-2"></td>
          </tr>
        </thead>

        <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
          {farms.map((farm, index) => (
            <tr
              key={index}
              className="text-start text-black bg-indigo-100 border-b-[1px] border-black last:border-b-0"
            >
              <td
                className="px-2 py-4 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.uniqueID}
              >
                {farm.uniqueID}
              </td>
              <td
                className="px-2 py-4 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.farm}
              >
                {farm.farm}
              </td>
              <td
                className="px-2 py-4 w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={farm.crop}
              >
                {farm.crop}
              </td>
              <td className="px-2 py-4 w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
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
                <MDBBtn
                  className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[13px]"
                  onClick={() => handleClick(farm._id)}
                >
                  View
                </MDBBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListFarmTable;
