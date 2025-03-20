"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/common/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import { ADMIN_USER_MANAGEMENT } from "@/utils/Apis/api";
import Message from "@/app/components/common/Message";
import Table_List from "@/app/components/admin/Table_List";
import Banner from "@/app/components/common/Banner";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [whichUser, setWhichUser] = useState("All");
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 5;

  const fetchUsers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_USER_MANAGEMENT}?page=${currentPage}&limit=${limit}&user=${whichUser}`,
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

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, whichUser]);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      {/* <Banner
        img_src="/assets/manager_image.jpeg"
        img_alt="Manager"
        heading="Manager Management"
        description=""
      /> */}

      <div className="my-5">
        <div className="max-w-[90%] m-auto space-y-5">
          <div className="text-center font-bold text-black text-heading-size">
            Users
          </div>
          {users.length > 0 ? (
            <>
              <div className="space-x-3 text-black">
                <label htmlFor="role">Select role:</label>
                <select
                  name="role"
                  id="role"
                  className="w-[300px] px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-200"
                  onChange={(e) => setWhichUser(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <Table_List
                users={users}
                idxCalc={(currentPage - 1) * limit}
              />

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
    </div>
  );
}

export default page;
