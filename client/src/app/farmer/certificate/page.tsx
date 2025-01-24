"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");
  console.log(farm_id);

  return (
    <div>
      <div>This is certificate page</div>
    </div>
  );
}

export default page;
