import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

function Heading({ text }: { text: string }) {
  const router = useRouter();

  return (
    <>
      <div className="pb-3 md:pb-4 lg:pb-3 font-bold md:text-[16px] lg:text-[18px] text-black space-x-2">
        <ArrowBackIcon
          style={{ cursor: "pointer" }}
          onClick={() => router.back()}
        />{" "}
        <span>{text}</span>
      </div>

      <hr className="border-[1px] border-gray-500" />
    </>
  );
}

export default Heading;
