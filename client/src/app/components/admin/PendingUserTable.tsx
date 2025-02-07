"use client";

import React, { useState } from "react";
import { PendingUserCardProps } from "@/utils/Types/interfaces";

function PendingUserTable({
  index,
  request,
  authenticateReq,
}: PendingUserCardProps) {
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
    <>
      <div className="flex space-x-2 text-[13px] md:text-[16px]">
        <div>{index + 1}.</div>
        <div className="font-medium">
          <div>Name: {request.name}</div>
          <div>Email: {request.email}</div>
          <div>Ph no.: {request.phone}</div>
          <div>
            Date:{" "}
            {new Date(request.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
          <div className="flex items-center my-2 space-x-5">
            <div>Assign role: </div>
            <select
              name="role"
              id="role"
              value={selectRole}
              className="p-[2px] border-[1px] border-black outline-0"
              onChange={(e) => setSelectRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="Manager">Manager</option>
              <option value="Farmer">Farmer</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          className="btn bg-green-400 bg-opacity-90 hover:bg-opacity-100 duration-200"
          onClick={() => handleOnClick(request._id, selectRole, true, "Accept")}
          disabled={selectedButton === "Reject"}
        >
          {selectedButton === "Accept" ? "Accepting" : "Accept"}
        </button>
        <button
          className="btn bg-red-500 text-white bg-opacity-90 hover:bg-opacity-100 duration-200"
          onClick={() =>
            handleOnClick(request._id, selectRole, false, "Reject")
          }
          disabled={selectedButton === "Accept"}
        >
          {selectedButton === "Reject" ? "Rejecting" : "Reject"}
        </button>
      </div>
    </>
  );
}

export default PendingUserTable;
