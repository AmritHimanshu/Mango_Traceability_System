"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pendingRequests } from "@/utils/Types/interfaces";
import Mango_tree from "../../../../public/assets/Mango_tree.png";
import HomeCard from "./components/HomeCard";
import "../../../styles/style.css";

function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [noOfFarmers, setNoOfFarmers] = useState(0);
  const [noOfManagers, setNoOfManagers] = useState(0);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(0);
  const [noOfPendingRequests, setNoOfPendingRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<pendingRequests[]>([]);

  const fetchNoOfFarmers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/api/fetch-no-of-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      setNoOfFarmers(data.noOfFarmers);
      setNoOfManagers(data.noOfManagers);
      setNoOfVerifiedFarmers(data.noOfVerifiedFarmers);
      setNoOfPendingRequests(data.noOfPendingRequests);
    } catch (error) {
      console.log(error);
      alert("Error fetchFarmers");
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/api/few-pending-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setPendingRequests(data);
    } catch (error) {
      console.log(error);
      alert("Error fetchFarmers");
    }
  };

  useEffect(() => {
    fetchNoOfFarmers();
    fetchPendingRequests();
  }, []);

  return (
    <div className="py-5">
      <Image
        src={Mango_tree}
        alt="Mango Tree"
        height={300}
        width={300}
        priority={true}
        className="m-auto"
      />

      <div className="space-y-5 px-3">
        <HomeCard
          title="Total number of managers"
          description={noOfManagers}
          textColor="orange"
        />
        <HomeCard
          title="Total number of farmers"
          description={noOfFarmers}
          textColor="blue"
        />
        <HomeCard
          title="Total number of verified farmers"
          description={noOfVerifiedFarmers}
          textColor="green"
        />
        <HomeCard
          title="Total number of pending requests"
          description={noOfPendingRequests}
          textColor="red"
        />
      </div>

      {pendingRequests && (
        <div className="bg-gray-50 p-3 mt-10">
          <div className="pb-2 text-lg font-bold">Recent Requests:</div>
          <div className="space-y-7">
          {pendingRequests.map((request, index) => (
            <div key={index} className="space-y-2">
              <div className="flex space-x-2 text-[16px]">
                <div>{index + 1}.</div>
                <div className="font-medium text-gray-600">
                  <div>Name: {request.name}</div>
                  <div>Email: {request.email}</div>
                  <div>Ph no.: {request.phone}</div>
                  <div>Role: {request.role}</div>
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
              <div className="flex space-x-3"><button className="btn bg-green-400">Accept</button><button className="btn bg-red-500 text-white">Reject</button></div>
            </div>
          ))}
          </div>

          <div className="mt-5 underline text-end">view all</div>
        </div>
      )}
    </div>
  );
}

export default Home;
