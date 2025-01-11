"use client";

import Image from "next/image";
import React, { useState } from "react";
import Mango_tree from "../../../../public/assets/Mango_tree.png";

function Home() {
  const [noOfFarmers, setNoOfFarmers] = useState(12);
  const [noOfManagers, setNoOfManagers] = useState(2);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(5);
  const [noOfPendingFarmers, setNoOfPendingFarmers] = useState(7);

  return (
    <div className="px-3 py-5">
      <Image src={Mango_tree} alt="Mango Tree" height={300} width={300} priority={true} className="m-auto" />
      
      <div className="space-y-5">
        <div className="p-5 text-xl text-blue-800 text-center font-bold bg-cardBackground rounded-md">
          Total number of farmers: {noOfFarmers}
        </div>

        <div className="p-5 text-xl text-orange-600 text-center font-bold bg-cardBackground rounded-md">
          Total number of managers: {noOfManagers}
        </div>

        <div className="p-5 text-xl text-green-600 text-center font-bold bg-cardBackground rounded-md">
          Total number of verified farmers: {noOfVerifiedFarmers}
        </div>

        <div className="p-5 text-xl text-red-600 text-center font-bold bg-cardBackground rounded-md">
          Total number of pending farmers: {noOfPendingFarmers}
        </div>
      </div>
    </div>
  );
}

export default Home;
