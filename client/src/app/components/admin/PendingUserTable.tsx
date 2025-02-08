"use client";

import React, { useState } from "react";
import { PendingUserTableProps } from "@/utils/Types/interfaces";

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
    <tr className="text-start even:bg-gray-50">
      <td
        className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={user.name}
      >
        {user.name}
      </td>
      <td
        className="px-2 py-4 border-y-2 w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={user.email}
      >
        {user.email}
      </td>
      <td
        className="px-2 py-4 border-y-2 w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={String(user.phone)}
      >
        {user.phone}
      </td>
      <td className="px-2 py-4 border-y-2 w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {new Date(user.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </td>
      <td className="px-2 border-y-2 w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        <select
          name="role"
          id="role"
          value={selectRole}
          className="w-full px-2 py-2 border-[1px] border-black outline-0"
          onChange={(e) => setSelectRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="Farmer">Farmer</option>
        </select>
      </td>
      <td className="px-2 border-y-2 text-end space-x-2">
        <button
          className="w-[30px] md:w-[50px] lg:w-[100px] bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white py-2 rounded-sm duration-200"
          onClick={() => handleOnClick(user._id, selectRole, true, "Accept")}
          disabled={selectedButton === "Reject"}
        >
          {selectedButton === "Accept" ? "Accepting" : "Accept"}
        </button>
        <button
          className="w-[30px] md:w-[50px] lg:w-[100px] bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white py-2 rounded-sm duration-200"
          onClick={() => handleOnClick(user._id, selectRole, false, "Reject")}
          disabled={selectedButton === "Accept"}
        >
          {selectedButton === "Reject" ? "Rejecting" : "Reject"}
        </button>
      </td>
    </tr>
  );
}

export default PendingUserTable;
