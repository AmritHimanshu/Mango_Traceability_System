"use client";

import React from "react";
import { ListFarmApplicationsDataProps } from "@/utils/Types/interfaces";

function ListFarmApplicationsData({
  data,
  columns,
}: ListFarmApplicationsDataProps) {
  return (
    <>
      <table className="table">
        <thead>
          <tr className="table-head-tr">
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
        <tbody className="table-body">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="table-body-tr"
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-body-tr-td">
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
