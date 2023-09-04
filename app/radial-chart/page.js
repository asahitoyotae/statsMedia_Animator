"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import readXlsxFile from "read-excel-file";
import { toPng } from "html-to-image";

import Navbar from "../components/nav";
import Footer from "../components/footer";
import { datum } from "./data";
import "./style.css";
import Radial from "./radial";
import Article from "./article";
import ScriptLoader from "./scriptLoader";

const RadialAreaChart = () => {
  const [data, setData] = useState(datum);
  const [file, setFile] = useState(null);
  const [change, setChange] = useState(false);
  const [color, setColor] = useState("green");

  const [details, setDetails] = useState({
    title: "Radial Area Chart of New York State Daily temparature °F",
    sub: "some information about the chart and data sources",
  });

  const getTheFile = (e) => {
    setFile(e.target.files[0]);
  };
  const handleDataprocessing = () => {
    if (!file) return;

    readXlsxFile(file).then((rows) => {
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        data.push({
          date: rows[i][0],
          avg: rows[i][1],
          min: rows[i][2],
          max: rows[i][3],
          minmin: rows[i][4],
          maxmax: rows[i][5],
        });
      }
      setChange(true);
      setData(data);
      console.log(data, "data");
    });
  };
  const handleDownloadSampleData = () => {
    const fileUrl = "/radial-chart sample.xlsx";

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = "radial-chart sample.xlsx";

    anchor.click();
  };

  const handleChartDownload = () => {
    const chart = document.getElementById("chart_container");

    toPng(chart, { cacheBust: true })
      .then((dataURL) => {
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "radia-chart.png";
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <ScriptLoader />
      <Navbar />
      <main className="radial_chart my-3">
        <div className=" flex flex-col gap-4 md:grid md:grid-cols-9">
          <Radial data={data} color={color} change={change} details={details} />
          <div className="col-span-2 border rounded-xl p-3 ">
            <div className="flex flex-col">
              <label className="font-bold ">Title</label>
              <input
                className="border-2 rounded-lg px-4 py-2"
                type="string"
                placeholder="chart title"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col mt-2">
              <label className="font-bold ">Sub titles</label>
              <input
                className="border-2 rounded-lg px-4 py-2"
                type="string"
                placeholder="additional chart info."
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, sub: e.target.value }))
                }
              />
            </div>
            <div className="colorify grid grid-cols-9 gap-2 my-3">
              <div className="col-span-6 flex gap-2 items-center">
                <label className="font-bold ">color</label>
                <input
                  placeholder={color}
                  className="border-2 rounded-lg px-1 py-2 w-full"
                  type="string"
                  onChange={(e) =>
                    localStorage.setItem("radialChartColor", e.target.value)
                  }
                />
              </div>
              <div className="col-span-3 flex items-center ">
                <button
                  onClick={() => {
                    if (!localStorage.getItem("radialChartColor")) return;
                    setChange(true);
                    setColor(localStorage.getItem("radialChartColor"));
                  }}
                  className="bg-blue-500 rounded-xl text-center text-white font-bold px-4 py-1 hover:bg-blue-700 duration-300"
                >
                  apply
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-left font-bold w-full">
                upload data{" "}
                <span className="font-normal">
                  {"("}only accept .xlsx file{")"}
                </span>
              </label>
              <input
                className="overflow-hidden"
                type="file"
                accept=".xlsx"
                onChange={getTheFile}
              />
              <div className="w-full flex justify-center">
                <button
                  className="bg-orange-500 py-1 px-4 text-white font-bold text-center rounded-xl hover:bg-orange-600 duration-300"
                  onClick={handleDataprocessing}
                >
                  process data
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 my-2">
              <label className="text-black font-bold">
                downlaod sample data
              </label>
              <button
                className="w-1/2 px-4 py-1 rounded-xl font-bold text-center bg-blue-500 hover:bg-blue-700 duration-300 text-white"
                onClick={handleDownloadSampleData}
              >
                download
              </button>
            </div>
            <div className="flex gap-2 flex-col">
              <label className="text-black font-bold">
                save chart as image
              </label>
              <div className="w-full flex justify-center">
                <button
                  onClick={handleChartDownload}
                  className="px-4 py-1 bg-green-500 text-white rounded-xl font-bold hover:bg-green-700 duration-300"
                >
                  download chart
                </button>
              </div>
            </div>
          </div>
        </div>
        <Article />
      </main>
      <Footer />
    </>
  );
};

export default RadialAreaChart;
