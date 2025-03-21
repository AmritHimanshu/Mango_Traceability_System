"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/common/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_PENDING_REQUESTS,
  ADMIN_SEARCH_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import Message from "@/app/components/common/Message";
import PendingUserTable from "@/app/components/admin/PendingUserTable";
import Banner from "@/app/components/common/Banner";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isConfirm, setIsConfirm] = useState(false);
  const [parameter, setParameter] = useState({
    id: "",
    role: "",
    status: false,
  });

  const limit = 5;

  const fetchPendingRequests = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_PENDING_REQUESTS}?page=${currentPage}&limit=${limit}`,
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

      setPendingRequests(data.pendingRequests);
      setTotalPages(data.totalPages);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const fetchSearchedPendingRequests = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_SEARCH_PENDING_REQUESTS}?page=${currentPage}&limit=${limit}&search=${searchQuery}`,
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

      setPendingRequests(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  useEffect(() => {
      const delayDebounce = setTimeout(() => {
        if (!searchQuery) {
          fetchPendingRequests();
        } else {
          fetchSearchedPendingRequests();
        }
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

  const authenticateReq = async (id: string, role: string, status: boolean) => {
    if (!role && status === true) {
      setMessage({ text: "Please assign role to the user!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);

      setIsConfirm(false);
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

    setIsConfirm(false);
    setParameter({
      id: "",
      role: "",
      status: false,
    });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const confirmReq = (id: string, role: string, status: boolean) => {
    setIsConfirm(true);
    setParameter({
      id: id,
      role: role,
      status: status,
    });
  };

  const handleOnCancel = () => {
    setIsConfirm(false);
    setParameter({
      id: "",
      role: "",
      status: false,
    });
  };

  return (
    <div className="page-main-div relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      {/* <Banner
        img_src="/assets/pending_requests.jpg"
        img_alt="Pending Requests"
        heading="Pending Requests"
        description=""
      /> */}

      <div className="my-5">
        <div className="max-w-[80%] m-auto space-y-5">
          <div className="text-center font-bold text-black text-heading-size">
            Pending Requests
          </div>
          <div className="md:space-x-11 lg:space-x-3 text-black md:flex items-center">
            <div>
              <label htmlFor="search">Search</label>
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={searchQuery}
              required
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-tag !w-[300px]"
            />
          </div>
          {pendingRequests.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[1000px] w-full table-fixed">
                    <thead>
                      <tr className="font-bold bg-customGreen text-white text-table-head-size">
                        <td className="px-4 py-3 text-left w-[100px]">
                          S. No.
                        </td>
                        <td className="px-4 py-3 text-left">Name</td>
                        <td className="px-4 py-3 text-left">Email</td>
                        <td className="px-4 py-3 text-left">Phone</td>
                        <td className="px-4 py-3 text-left">Date</td>
                        <td className="px-4 py-3 text-left">Assign role</td>
                        <td className="px-4 py-3 text-center">
                          <span className="">Accept</span>/
                          <span className="">Reject</span>
                        </td>
                      </tr>
                    </thead>

                    <tbody className="text-table-body-size">
                      {pendingRequests.map((user, index) => (
                        <PendingUserTable
                          key={index}
                          idx={(currentPage - 1) * limit + index}
                          user={user}
                          confirmReq={confirmReq}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-x-5 text-center text-black">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${currentPage == i + 1 && "text-customGreen"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">No records found!</div>
          )}
        </div>
      </div>

      {isConfirm && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <div className="bg-white p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5 rounded-md">
            <div>
              <div className="text-sm md:text-xl">
                Are you sure, you want to save?
              </div>
              <div className="text-[10px] md:text-[13px]">
                You will not be able to edit/change after saving!
              </div>
            </div>
            <div className="text-end text-[11px] md:text-lg space-x-2">
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => handleOnCancel()}
              >
                Cancel
              </button>
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() =>
                  authenticateReq(
                    parameter.id,
                    parameter.role,
                    parameter.status
                  )
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
