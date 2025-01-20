"use client";

import React from "react";
import { ListFarmApplicationsDataProps } from "@/utils/Types/interfaces";

function ListFarmApplicationsData({
  data,
  columns,
}: ListFarmApplicationsDataProps) {
  return (
    <>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border border-gray-300 px-4 py-2">
                  {column.key === "date"
                    ? item[column.key] &&
                      new Date(item[column.key]).toISOString().split("T")[0]
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ListFarmApplicationsData;
