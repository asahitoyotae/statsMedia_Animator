"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./style.css";

const Options = () => {
  return (
    <div className="w-full mt-6 mb-10">
      <div className="w-full flex items-center justify-center">
        <Link
          href={"/radial-chart"}
          className="chart_info border rounded-xl flex flex-row "
        >
          <Image
            src="/radial.png"
            width={200}
            height={200}
            alt="radial-chart"
          />
          <div className="flex items-center flex-col justify-center">
            <h4 className="text-black w-full text-left font-bold text-xl">
              Radial Area/Line Chart
            </h4>
            <p className="text-black">
              A radial line chart displays data points on spokes radiating from
              a central point, illustrating relationships and patterns in
              circular visualizations.
            </p>
          </div>
        </Link>
      </div>
      <div className="my-8">
        <h1 className="text-black text-2xl  md:text-4xl font-bold text-center">
          More are Coming Soon
        </h1>
      </div>
      <div className="py-16 px-1 md:px-40 lg:px-72">
        <h1 className=" text-2xl md:text-4xl my-8 font-bold text-black">
          Quickly Create a Bar Chart Race without Coding
        </h1>
        <p className="text-black text-xl tracking-wide leading-[1.8]">
          Make a dynamic visualization of your data with Datalytics bar chart
          race generator. Best for storytelling with data.
        </p>
        <h2 className="text-black text-xl md:text-2xl font-bold my-8">
          Quick Introduction about Bar chart
        </h2>
        <p className="text-black text-xl tracking-wide py-4 leading-[1.8]">
          Bar chart race is becoming more and more popular on YouTube and
          everywhere online. It provides a fun and easy-to-understand
          visualization of data, representing sets of participants as bars,
          ranked from highest to lowest. Each country, person, or brand is
          represented by a bar that extends or retracts based on the data,
          creating a fun bar chart race between participants.
        </p>

        <p className="text-black text-xl tracking-wide py-4 leading-[1.8]">
          Because of its animation, this type of chart has become popular in
          recent years, as seen on YouTube channels like Stas Media, Datalytics,
          Data Dynamics, Data is Beautiful, and more. Racing charts are
          successful in capturing audiences' attention, making complex data more
          understandable and digestible.
        </p>

        <h2 className="text-black text-xl md:text-2xl font-bold my-8">
          The parts of Our Bar Chart Race
        </h2>
        <p className="text-black text-xl tracking-wide py-4 leading-[1.8]">
          Bar chart races are extremely useful to visualize data that changes
          over time. Similar to static bar charts, dynamic bar charts consist of
          multiple static bar charts that run over time, creating an animation
          effect. Each row or bar represents individual participants. The chart
          includes dynamic years to represent the current time in tune with the
          data. Additionally, there are dynamic scales that change over time
          based on the highest data presented at the current time during the
          race. You can also provide a title and additional information, such as
          data sources or explanations.
        </p>

        <p className="text-black text-xl tracking-wide py-4 leading-[1.8]">
          Each bar consists of a name representing what it represents (country,
          name, object, brand, etc.) and a value that represents the data/info
          for that particular year or time.
        </p>

        <h2 className="text-black text-xl md:text-2xl font-bold my-8">
          How to Use Datalytics Bar Chart Race
        </h2>

        <div className="flex flex-col gap-8 md:grid md:grid-cols-4 text-black text-xl tracking-wide py-4 leading-[1.8]">
          <div className="col-span-2 sample_options  rounded-xl p-4 col-span-2 bg-transparent border-2 border-gray-300 flex flex-col gap-3 items-center ">
            <div className="change_details">
              <label>Title</label>
              <input type="string" placeholder="chart title..." />
            </div>
            <div className="change_details flex">
              <label>subtitle</label>
              <input placeholder="additional chart info..." type="string" />
            </div>
            <div className="w-full flex">
              <div className="change_details px-4">
                <label>n - bars</label>
                <input type="number" placeholder="max - 15" min={3} max={15} />
              </div>

              <div className="w-2/3 flex items-center justify-center">
                <button className="mt-7 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full h-1/2 duration-500">
                  apply
                </button>
              </div>
            </div>
            <div className="change_details">
              <label>bar colors</label>
              <div className="flex gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full duration-500">
                  by bars
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full  duration-500">
                  by category
                </button>
              </div>
            </div>
            <div className="get_file w-full mt-3 ">
              <input type="file" name="file" accept=".xls, .xlsx" />
              <div>
                <button className="border hover:bg-orange-600 rounded-xl bg-orange-500 font-bold text-white w-1/2 duration-500">
                  process data
                </button>
              </div>
            </div>
            <div className="change_details">
              <label>sample data</label>
              <p>sample.xlsx</p>
              <button className="border hover:bg-blue-600 rounded-xl bg-blue-500 font-bold text-white w-1/2 duration-500">
                downlaod
              </button>
            </div>
          </div>
          <div className="col-span-2">
            Simply upload your data and click on the{" "}
            <span className="px-4 py-1 text-sm rounded-xl text-white font-bold bg-orange-500">
              process data
            </span>
            button. The bar chart race generator accepts .xlsx files (Excel
            files). You can change the number of bars in the chart and customize
            the colors of individual bars. The maximum number of bars supported
            is 15. Bars can be colored individually by providing colors in the
            Excel file, or by category if your data includes categories.
          </div>
        </div>

        <h2 className="text-black text-xl md:text-2xl font-bold my-8">
          Why Choose Our Bar Chart Race Generator?
        </h2>
        <p className="text-black text-xl tracking-wide py-4 leading-[1.8]">
          Our bar chart race generator offers fullscreen capability for screen
          recording the generated animation. It's free and easy to use. The
          generated bar chart race is unique and not commonly found online.
        </p>
      </div>
    </div>
  );
};

export default Options;
