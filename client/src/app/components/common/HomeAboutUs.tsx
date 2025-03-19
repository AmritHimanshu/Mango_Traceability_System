"use client";

import Image from "next/image";
import React from "react";

function HomeAboutUs() {
  return (
    <div className="w-[100%] space-y-5 xl:space-y-0 xl:flex justify-between">
      <div className="xl:w-[40%] h-[400px] xl:h-[500px] relative rounded-md overflow-hidden">
        <Image
          src="/assets/man-in-farm.webp"
          alt="man"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="xl:w-[55%] space-y-5 xl:space-y-0 xl:flex flex-col justify-between">
        <div className="space-y-3">
          <div className="font-bold text-xs text-customGreen">ABOUT US</div>

          <div className="font-bold text-[20px] xl:text-[50px] leading-tight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </div>

          <div className="text-sm">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium minus ratione commodi eveniet ea modi exercitationem at
            eligendi mollitia voluptatum.
          </div>
        </div>

        <div className="space-y-5 md:space-y-0 md:flex justify-between">
          <div className="md:w-[45%] space-y-5 text-black">
            <div className="p-3 border-[1px] border-black rounded-md flex flex-col items-center justify-center">
              <div className="text-[20px] lg:text-[30px] font-bold">30+</div>
              <div className="text-xs">YEARS OF EXPERIENCE</div>
            </div>
            <div className="p-3 border-[1px] border-black rounded-md flex flex-col items-center justify-center">
              <div className="text-[20px] lg:text-[30px] font-bold">50+</div>
              <div className="text-xs">FARMERS</div>
            </div>
          </div>

          <div className="md:w-[45%] space-y-5 md:space-y-0 md:flex flex-col justify-between">
            <div className="text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab natus
              quaerat tempora enim ut beatae ratione ad veritatis temporibus
              repellendus.
            </div>
            <div className="text-center">
              <button className="outline-btn text-customGreen border-customGreen hover:text-white hover:bg-customGreen">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAboutUs;
