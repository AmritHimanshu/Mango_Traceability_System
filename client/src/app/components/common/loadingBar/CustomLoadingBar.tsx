"use client";

import React, { forwardRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

const CustomLoadingBar = forwardRef<LoadingBarRef>((props, ref) => {
  return (
    <LoadingBar
      color="#FF9933"
      height={8}     
      ref={ref}      
      {...props}      
    />
  );
});

CustomLoadingBar.displayName = "CustomLoadingBar";

export default CustomLoadingBar;
