"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListUserCardProps } from "@/utils/Types/interfaces";
import { FARMER } from "@/utils/Paths/paths";

function ListUserCard({ index, user }: ListUserCardProps) {
  const router = useRouter();

  const handleOnView = async () => {
    router.push(`${FARMER}/${user._id}`);
  };

  return (
    <div className="text-[13px] md:text-[16px] space-y-3">
      <div className="flex items-start space-x-2">
        <div>{index + 1}.</div>
        <div>
          <div className="truncate overflow-hidden whitespace-nowrap">
            Name: {user.name}
          </div>
          <div className="truncate overflow-hidden whitespace-nowrap">
            Email: {user.email}
          </div>
          <div className="truncate overflow-hidden whitespace-nowrap">
            Phone: {user.phone}
          </div>
          <div className="truncate overflow-hidden whitespace-nowrap">
            Joined on:{" "}
            {new Date(user.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
          <div className="w-[50%] my-2">
            <button
              className="w-full bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white py-2 rounded-sm duration-200"
              onClick={handleOnView}
            >
              view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUserCard;
