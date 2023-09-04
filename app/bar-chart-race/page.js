"use client";

import React, { useEffect, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import { datas } from "../components/newData";
import * as d3 from "d3";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompress,
  faExpand,
  faReplyAll,
} from "@fortawesome/free-solid-svg-icons";
import ScriptLoader from "../radial-chart/scriptLoader";

const Bars = () => {
  const svgRef = useRef();
  const [dataChange, setDataChange] = useState(false);
  const [file, setFile] = useState({ file: null });
  const [replay, setReplay] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  const contRef = useRef();
  const barsRef = useRef();
  const labelsRef = useRef();
  const axisRef = useRef();
  const yearRef = useRef();
  const flagRef = useRef();

  const [heights, setHeight] = useState(null);

  useEffect(() => {
    const data = datas;
    const colorArray = [];

    const flags = [];

    if (!data || data.length <= 0) return;

    const duration = 250;
    const n = JSON.parse(localStorage.getItem("numberOfBars")) || 10;
    const barcorners = JSON.parse(localStorage.getItem("cornerRadius")) || 0;

    const marginTop = 16;
    const marginRight = 6;
    const marginBottom = 50;
    const marginLeft = 0;
    const width = contRef.current.clientWidth;
    const height = heights || contRef.current.clientHeight;
    const barSize = height / (n + n * 0.1 + 0.2);
    //const height = marginTop + barSize * n + marginBottom;

    const names = new Set(data.map((d) => d.name));

    const datevalues = Array.from(
      d3.rollup(
        data,
        ([d]) => d.value,
        (d) => d.date,
        (d) => d.name
      )
    )
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => d3.ascending(a, b));

    function rank(value) {
      const data = Array.from(names, (name) => ({
        name,
        value: value(name),
        flag: getFlag(name),
        color: getColor(name),
      }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }

    function getColor(name) {
      const colored = datas.find((e) => e.name == name);
      if (!colored) return null;
      return colored.color;
    }

    function getFlag(name) {
      const bar = datas.find((e) => e.name == name);
      if (!bar) return "N/A";
      return bar.flag;
    }

    const k = 10;

    const keyframesd = () => {
      const keyframes = [];
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(
              (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t
            ),
          ]);
        }
      }
      keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);
      return keyframes;
    };

    const keyframes = keyframesd();

    const nameframes = d3.groups(
      keyframes.flatMap(([, data]) => data),
      (d) => d.name
    );

    const prev = new Map(
      nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
    );
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

    let cat = JSON.parse(localStorage.getItem("cat"));

    function bars(svg) {
      let bar = d3
        .select(barsRef.current)
        .attr("fill-opacity", 0.7)
        .selectAll("rect");

      return ([date, data], transition) =>
        (bar = bar
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("rect")
                .attr("height", y.bandwidth())
                .style("fill", cat ? (d) => d.color : colors())
                .attr("fill-opacity", 0)
                .attr("x", x(0))
                .attr("rx", barcorners)
                .attr("ry", barcorners)
                .attr("y", (d) => y((prev.get(d) || d).rank))
                .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),

            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .attr("width", (d) => x((next.get(d) || d).value) - x(0))
                .attr("fill-opacity", "0")
                .attr("y", (d) => y((prev.get(d) || d).rank + 1))
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr("height", y.bandwidth())
              .style("fill", cat ? (d) => d.color : colors())
              .attr("y", (d) => y(d.rank))
              .attr("fill-opacity", 0.7)
              .attr("width", (d) => x(d.value) - x(0))
          ));
    }

    function putFlags(svg) {
      let flags = d3
        .select(flagRef.current)
        .selectAll("circle")
        .style("overflow", "hidden");

      return ([date, data], transition) => {
        flags
          .data(data.slice(0, n), (d) => d.name)
          .enter()
          .append("defs")
          .append("pattern")
          .attr("id", (d) => `pattern-${d.flag}`) // Unique pattern ID based on data.flag
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", y.bandwidth()) // Set the width of your image
          .attr("height", y.bandwidth()) // Set the height of your image
          .attr("xlink:href", (d) => `/${d.flag}`); // Use data.flag as the image source

        flags = flags
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("circle")
                .attr("r", y.bandwidth() / 2)
                .attr("fill", (d) => `url(#pattern-${d.flag})`)
                .attr("fill-opacity", 0)
                .attr("stroke", "black")
                .attr("stroke-opacity", 0)
                .attr(
                  "cx",
                  (d) =>
                    x((prev.get(d) || d).value) - x(0) + y.bandwidth() / 1.5
                )
                .attr(
                  "cy",
                  (d) => y((prev.get(d) || d).rank) + y.bandwidth() / 2
                ),

            (update) => update,

            (exit) =>
              exit
                .transition(transition)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .attr("cy", (d) => y((prev.get(d) || d).rank + 1))
          )
          .call((flag) =>
            flag
              .transition(transition)
              .attr("r", y.bandwidth() / 2)
              .attr("cx", (d) => x(d.value) - x(0) + y.bandwidth() / 1.5)
              .attr("fill-opacity", 1)
              .attr("stroke-opacity", 1)
              .attr("cy", (d) => y(d.rank) + y.bandwidth() / 2)
          )
          .attr("width", y.bandwidth()) // Set the updated width of your image
          .attr("height", y.bandwidth());
      };
    }

    function labels(svg) {
      let label = d3
        .select(labelsRef.current)
        .attr("fill", "black")
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .selectAll("text");

      return ([date, data], transition, max) =>
        (label = label
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("text")
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((prev.get(d) || d).value)},${y(
                      (prev.get(d) || d).rank
                    )})`
                )
                .attr("y", y.bandwidth() / 2)
                .attr("x", -6)
                .attr("dy", "0.25em")
                .attr("font-size", 30)
                .attr("opacity", 0)
                .text((d) => d.name)
                .call((text) =>
                  text
                    .append("tspan")
                    .attr("fill-opacity", 1)
                    .attr("fill", "black")
                    .attr("font-weight", "bold")
                    .attr("x", -6)
                    .attr("dy", "1.15em")
                ),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .attr("opacity", 0)
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((next.get(d) || d).value)},${y(
                      (next.get(d) || d).rank
                    )})`
                )
                .call((g) =>
                  g
                    .select("tspan")
                    .tween("text", (d) =>
                      textTween(d.value, (next.get(d) || d).value)
                    )
                )
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr("y", y.bandwidth() / 2)
              .attr("x", -6)
              .attr("dy", "-0.25em")
              .attr("transform", (d) => {
                const maxb = x(d3.max(data, (d) => d.value));
                const thisBar = x(d.value);

                const res = (thisBar / maxb) * 100;

                if (res < 14) {
                  return `translate(${x(d.value) + y.bandwidth() * 1.5},${y(
                    d.rank
                  )})`;
                } else {
                  return `translate(${x(d.value)},${y(d.rank)})`;
                }
              })
              .attr("opacity", 1)
              .style("font-size", "30")
              .style("text-anchor", (d) => {
                const maxb = x(d3.max(data, (d) => d.value));
                const thisBar = x(d.value);

                const res = (thisBar / maxb) * 100;

                if (res < 14) {
                  return "start"; // Align to the left
                } else {
                  return "end"; // Default alignment
                }
              })
              .call((g) =>
                g
                  .select("tspan")
                  .tween("text", (d) =>
                    textTween((prev.get(d) || d).value, d.value)
                  )
              )
          ));
    }

    function textTween(a, b) {
      const i = d3.interpolateNumber(a, b);
      return function (t) {
        this.textContent = formatNumber(i(t));
      };
    }

    const formatNumber = d3.format(",d");
    const tickFormat = undefined;

    function axis(svg) {
      const g = d3
        .select(axisRef.current)
        .attr("transform", `translate(0,${height - marginBottom + 10})`);

      const axis = d3
        .axisBottom(x)
        .ticks(width / 160, tickFormat)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line")
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "4,6");
        g.select(".domain").remove();
      };
    }

    const formatDate = d3.utcFormat("%Y");

    function ticker(date, transition) {
      return d3
        .select(yearRef.current)
        .style("font-variant-numeric", "tabular-nums")
        .style("font-weight", "bold")
        .style("font-size", "3rem")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", marginTop + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(date));
    }

    const colors = () => {
      const scale = d3.scaleOrdinal(d3.schemeTableau10);
      if (data.some((d) => d.category !== undefined)) {
        const categoryByName = new Map(data.map((d) => [d.name, d.category]));
        scale.domain(categoryByName.values());
        return (d) => scale(categoryByName.get(d.name));
      }
      return (d) => scale(d.name);
    };

    const y = d3
      .scaleBand()
      .domain(d3.range(n + 1))
      .range([marginTop, height])
      //.rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
      .padding(0.1);
    const x = d3.scaleLinear(
      [0, 1],
      [0, width - marginRight - y.bandwidth() * 1.3]
    );

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
    //.style("overflow", "visible");

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateFlags = putFlags(svg);
    const updateLabels = labels(svg);
    //const updateTicker = ticker();

    let currentKeyframeIndex = replay;

    const animate = () => {
      if (currentKeyframeIndex >= keyframes.length) {
        return clearInterval(animationInterval);
      }

      const keyframe = keyframes[currentKeyframeIndex];
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      const topBarValue = x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateFlags(keyframe, transition);
      updateLabels(keyframe, transition, topBarValue);
      ticker(keyframe[0], transition);

      //transition.end().then(() => svg.interrupt());
      currentKeyframeIndex += 1;
      //setCurrentKeyframeIndex((prevIndex) => prevIndex + 1);
    };

    const animationInterval = setInterval(animate, duration);

    return () => {
      clearInterval(animationInterval);
    };
  }, [dataChange, replay, heights, fullScreen]);

  const getDatafromLocal = (e) => {
    localStorage.removeItem("barChartRaceData");
    setFile((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const convertData = () => {
    if (!file.file) return;

    readXlsxFile(file.file).then((rows) => {
      const data = [];

      for (let i = 4; i < rows[0].length; i++) {
        for (let j = 1; j < rows.length; j++) {
          data.push({
            date: `${rows[0][i]}-01-01T00:00:00.000Z`,
            name: rows[j][0],
            category: rows[j][1],
            color: rows[j][2],
            flag: rows[j][3],
            value: rows[j][i],
          });
        }
      }
      const color = [];
      for (let i = 1; i < rows.length; i++) {
        color.push({ name: rows[i][0], color: rows[i][2] });
      }

      const flags = [];
      for (let i = 1; i < rows.length; i++) {
        flags.push({ name: rows[i][0], flag: rows[i][3] });
      }

      //setFile((prev) => ({ ...prev, data: data, color: color }));
      localStorage.setItem("barChartRaceData", JSON.stringify(data));
      localStorage.setItem("barChartRaceColors", JSON.stringify(color));
      localStorage.setItem("flags", JSON.stringify(flags));
      setDataChange((prev) => !prev);
    });
  };
  const [details, setDetails] = useState({
    title: "Bar Chart Race Largest Companies in the World",
    subtitle: "some details about the data and probably data sources",
  });
  useEffect(() => {
    if (localStorage.getItem("barTitle")) {
      setDetails((prev) => ({
        ...prev,
        title: localStorage.getItem("barTitle"),
      }));
    }

    if (localStorage.getItem("barSubtitle")) {
      setDetails((prev) => ({
        ...prev,
        subtitle: localStorage.getItem("barSubtitle"),
      }));
    }
  }, []);

  const downloadSampleData = () => {
    const fileURl = "/sample.xlsx";

    const anchor = document.createElement("a");
    anchor.href = fileURl;
    anchor.download = "sample.xlsx";

    anchor.click();
  };

  const handleFullScreenRequest = () => {
    setFullScreen(true);
    const fullScreenElement = document.getElementById("bar_chart");
    if (fullScreenElement.requestFullscreen) {
      fullScreenElement.requestFullscreen();
    } else if (fullScreenElement.mozRequestFullScreen) {
      fullScreenElement.mozRequestFullScreen();
    } else if (fullScreenElement.webkitRequestFullscreen) {
      fullScreenElement.webkitRequestFullscreen();
    } else if (fullScreenElement.msRequestFullscreen) {
      fullScreenElement.msRequestFullscreen();
    }
    setTimeout(() => {
      setHeight(contRef.current.clientHeight);
      //setReplay((prev) => (prev == 0 ? 1 : 0));
    }, 500);
  };

  const handleExitfullScrenn = () => {
    // Check if the document is currently in fullscreen mode
    setFullScreen(false);
    location.reload();
  };

  const [indictor, setIndicator] = useState(0);

  return (
    <div className="w-full flex flex-col gap-10">
      <ScriptLoader />
      <div
        id="bar_chart"
        //id="chartcontainer"
        className="h-screen bg-white flex flex-col bar_chart_container col-span-7 border-2 border-gray-300 rounded-xl relative"
      >
        <h3 className="text-black font-bold text-xl md:text-2xl text-center w-full">
          {details.title}
        </h3>
        <p className=" text-black w-full text-center">{details.subtitle}</p>
        <div ref={contRef} className="w-full h-full flex-1">
          <svg ref={svgRef}>
            <g ref={axisRef}></g>
            <g ref={barsRef}></g>
            <g ref={labelsRef}></g>
            <g className="flags" ref={flagRef}></g>
            <text ref={yearRef}></text>
          </svg>
        </div>
        <div className="absolute top-0 left-0 ml-5 mt-3f flex gap-4">
          <button
            onMouseEnter={() => setIndicator(1)}
            onMouseLeave={() => setIndicator(0)}
            className=""
            onClick={() => setReplay((prev) => (prev == 0 ? 1 : 0))}
          >
            <FontAwesomeIcon icon={faReplyAll} style={{ color: "black" }} />
          </button>
          {fullScreen ? (
            <button
              onMouseEnter={() => setIndicator(2)}
              onMouseLeave={() => setIndicator(0)}
              onClick={handleExitfullScrenn}
            >
              <FontAwesomeIcon icon={faCompress} style={{ color: "black" }} />
            </button>
          ) : (
            <button
              onMouseEnter={() => setIndicator(2)}
              onMouseLeave={() => setIndicator(0)}
              onClick={handleFullScreenRequest}
            >
              <FontAwesomeIcon icon={faExpand} />
            </button>
          )}
        </div>
        {/* <div
          className={`indicator1 ${
            indictor == 1 ? "active_indicator" : "inactive_indicator"
          }`}
        >
          replay
        </div>
        <div
          className={`indicator2 ${
            indictor == 2 ? "active_indicator" : "inactive_indicator"
          } `}
        >
          toggle fullscreen{" "}
          <span className="notes">
            note: please use this button to exit fullscreen to maintain aspect
            ratio
          </span>
        </div> */}
      </div>

      <div className="rounded-xl p-4 col-span-2 bg-transparent border-2 border-gray-300 flex flex-col gap-3 items-center ">
        <div className="change_details">
          <label>Title</label>
          <input
            type="string"
            placeholder="chart title..."
            onChange={(e) => {
              localStorage.setItem("barTitle", e.target.value);
              setDetails((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>
        <div className="change_details flex">
          <label>subtitle</label>
          <input
            placeholder="additional chart info..."
            type="string"
            onChange={(e) => {
              localStorage.setItem("barSubtitle", e.target.value);
              setDetails((prev) => ({ ...prev, subtitle: e.target.value }));
            }}
          />
        </div>
        <div className="w-full flex">
          <div className="change_details px-4">
            <label>n - bars</label>
            <input
              type="number"
              placeholder="max - 15"
              // defaultValue={
              //   JSON.parse(localStorage.getItem("numberOfBars")) || 10
              // }
              min={3}
              max={15}
              onChange={(e) => {
                if (e.target.value > 15 || e.target.value < 3) return;
                localStorage.setItem("numberOfBars", e.target.value);
              }}
            />
          </div>

          <div className="w-2/3 flex items-center justify-center">
            <button
              className="mt-7 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full h-1/2 duration-500"
              onClick={() => {
                if (
                  JSON.parse(localStorage.getItem("numberOfBars")) > 15 ||
                  JSON.parse(localStorage.getItem("numberOfBars")) < 3
                ) {
                  return;
                }
                location.reload();
              }}
            >
              apply
            </button>
          </div>
        </div>
        <div className="change_details">
          <label>bar colors</label>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full duration-500"
              onClick={() => {
                if (localStorage.getItem("cat")) return;
                localStorage.setItem("cat", "true");
                location.reload();
              }}
            >
              by bars
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold w-full  duration-500"
              onClick={() => {
                if (!localStorage.getItem("cat")) return;
                localStorage.removeItem("cat");
                location.reload();
              }}
            >
              by category
            </button>
          </div>
        </div>
        <div className="get_file w-full mt-1 ">
          <label className="font-bold mb-2">
            updload data{" "}
            <span className="font-normal">
              {"("}only accept .xlsx file{")"}
            </span>
          </label>
          <input
            type="file"
            name="file"
            accept=".xlsx"
            onChange={getDatafromLocal}
          />
          <div>
            <button
              onClick={convertData}
              className="border hover:bg-orange-600 rounded-xl bg-orange-500 font-bold text-white w-1/2 duration-500"
            >
              process data
            </button>
          </div>
        </div>
        <div className="change_details">
          <label>sample data</label>
          <p>sample.xlsx</p>
          <button
            onClick={downloadSampleData}
            className="border hover:bg-blue-600 rounded-xl bg-blue-500 font-bold text-white w-1/2 duration-500"
          >
            downlaod
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bars;
