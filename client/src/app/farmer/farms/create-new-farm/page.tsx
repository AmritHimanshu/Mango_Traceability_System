"use client";

import React from "react";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="px-3 py-3 min-h-[calc(100vh-56px)] relative">
      <div className="bg-cardBackground bg-opacity-90 rounded-md shadow-md p-5 space-y-3">
        <div className="text-center font-medium">Enter data of farm</div>
        <form action="" className="space-y-10">
          <div className="flex items-start flex-col">
            <label htmlFor="farmName">
              Name of the farm <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              //   value="{email}"
              className="input-tag"
              required
              //   onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="cropName">
              Name of the crop <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              //   value="{email}"
              className="input-tag"
              required
              //   onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default page;
