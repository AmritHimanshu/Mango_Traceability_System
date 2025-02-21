"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import Message from "@/app/components/common/Message";
import Heading from "@/app/components/common/Heading";
import PendingUserTable from "@/app/components/admin/PendingUserTable";
import "../../../styles/style.css";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 20;
  let skip = 0;

  const fetchPendingRequests = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_PENDING_REQUESTS}?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setPendingRequests((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      skip = skip + limit;
      fetchPendingRequests();
    }
  };

  useEffect(() => {
    fetchPendingRequests();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const authenticateReq = async (id: string, role: string, status: boolean) => {
    if (!role && status === true) {
      setMessage({ text: "Please assign role to the user!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_AUTHENTICATE_USER}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: role, isAuthenticated: status }),
      });

      const data = await res.json();
      if (res.status === 400) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });

      setPendingRequests((prev) => {
        return prev.filter((request) => request._id !== id);
      });
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <Heading text="PENDING REQUESTS" />

      <div className="mt-5">
        {pendingRequests.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
            <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
              <thead>
                <tr className="font-bold bg-primarycColor bg-opacity-80 text-white">
                  <td className="px-4 py-3 text-left">Name</td>
                  <td className="px-4 py-3 text-left">Email</td>
                  <td className="px-4 py-3 text-left">Phone</td>
                  <td className="px-4 py-3 text-left">Date</td>
                  <td className="px-4 py-3 text-left">Assign role</td>
                  <td className="px-4 py-3 text-center">Accept/Reject</td>
                </tr>
              </thead>

              <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
                {pendingRequests.map((user, index) => (
                  <PendingUserTable
                    key={index}
                    user={user}
                    authenticateReq={authenticateReq}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">No records found!</div>
        )}
      </div>
    </div>
  );
}

export default page;
