"use client";

import React, { useState } from "react";
import { PendingUserTableProps } from "@/utils/Types/interfaces";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function PendingUserTable({ user, authenticateReq }: PendingUserTableProps) {
  const [selectedButton, setSelectedButton] = useState("");

  const [selectRole, setSelectRole] = useState("");

  const handleOnClick = async (
    id: string,
    role: string,
    status: boolean,
    buttonText: string
  ) => {
    try {
      setSelectedButton(buttonText);
      await authenticateReq(id, role, status);
      setSelectedButton("");
      setSelectRole("");
    } catch (error) {
      setSelectedButton("");
      setSelectRole("");
    }
  };

  return (
    <tr className="text-black bg-secondaryColor odd:bg-opacity-30 border-b-[1px] border-black last:border-b-0">
      <td className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {user.name}
      </td>
      <td className="px-4 py-3 align-middle w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {user.email}
      </td>
      <td className="px-4 py-3 align-middle w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {user.phone}
      </td>
      <td className="px-4 py-3 align-middle w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {new Date(user.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </td>
      <td className="px-4 py-3 align-middle">
        <select className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200">
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="Farmer">Farmer</option>
        </select>
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center justify-evenly">
          <CheckCircleOutlineOutlinedIcon
            style={{ color: "green", cursor: "pointer", fontSize: "30px" }}
            onClick={() => handleOnClick(user._id, selectRole, true, "Accept")}
          />
          <CloseOutlinedIcon
            style={{ color: "red", cursor: "pointer", fontSize: "30px" }}
            onClick={() => handleOnClick(user._id, selectRole, false, "Reject")}
          />
        </div>
      </td>
    </tr>
  );
}

export default PendingUserTable;
