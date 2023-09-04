"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { datas } from "./dataObjects";
import { createBarChartRace } from "./createbars";

const BarChartRace = () => {
  const svgRef = useRef();
  const data = datas;
  useEffect(() => {
    console.log(svgRef.current);
    createBarChartRace(svgRef.current, data, 10, 215);
  });

  useEffect;
  return (
    <div className="w-full grid grid-cols-9">
      <div className="col-span-7">
        <div ref={svgRef}></div>;
      </div>
      <div className="h-full bg-transparent border-4 rounded-xl col-span-2">
        hello world
      </div>
    </div>
  );
};

export default BarChartRace;
