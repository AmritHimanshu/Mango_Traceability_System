"use client";

import React, { useState } from "react";
import { UserCardProps } from "@/utils/Types/interfaces";

function ListUserCard({ index, request, authenticateReq }: UserCardProps) {
  const [selectedButton, setSelectedButton] = useState("");

  const handleOnClick = (id: string, status: boolean, buttonText: string) => {
    setSelectedButton(buttonText);
    authenticateReq(id, status);
  };

  return (
    <>
      <div className="flex space-x-2 text-[16px] text-">
        <div>{index + 1}.</div>
        <div className="font-medium text-gray-600">
          <div>Name: {request.name}</div>
          <div>Email: {request.email}</div>
          <div>Ph no.: {request.phone}</div>
          <div className="font-semibold">Role: {request.role}</div>
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
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          className="btn bg-green-400"
          onClick={() => handleOnClick(request._id, true, "Accept")}
          disabled={selectedButton === "Reject"}
        >
          {selectedButton === "Accept" ? "Accepting" : "Accept"}
        </button>
        <button
          className="btn bg-red-500 text-white"
          onClick={() => handleOnClick(request._id, false, "Reject")}
          disabled={selectedButton === "Accept"}
        >
          {selectedButton === "Reject" ? "Rejecting" : "Reject"}
        </button>
      </div>
    </>
  );
}

export default ListUserCard;
