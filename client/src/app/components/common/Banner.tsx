import React from "react";
import Image from "next/image";
import { bannerProps } from "@/utils/Types/interfaces";

function Banner({ img_src, img_alt, heading, description }: bannerProps) {
  return (
    <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
      <Image
        src={img_src}
        alt={img_alt}
        fill
        priority
        style={{ objectPosition: "center", objectFit: "cover" }}
      />
      <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-60 flex items-center justify-center">
        <div className="w-[80%] m-auto">
          <div className="text-[30px] md:text-[50px] font-bold text-white">
            {heading}
          </div>
          <div className="text-customOrange text-[20px] md:text-[30px]">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
