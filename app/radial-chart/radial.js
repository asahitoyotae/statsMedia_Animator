"use client";

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

const Radial = ({ data, color, change, details }) => {
  const chartRef = useRef();
  const svgRef = useRef();
  const lineRef = useRef();
  const maxRef = useRef();
  const minRef = useRef();
  const xRef = useRef();
  const yRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = chartRef.current.clientWidth;
    const height = width;
    const margin = 10;
    const innerRadius = width / 5;
    const outerRadius = width / 2 - margin;

    const xScale = d3
      .scaleUtc()
      .domain([new Date("2000-01-01"), new Date("2001-01-01") - 1])
      .range([0, 2 * Math.PI]);

    const yScale = d3
      .scaleRadial()
      .domain([
        d3.min(data.map((d) => d.minmin)),
        d3.max(data.map((d) => d.maxmax)),
      ])
      .range([innerRadius, outerRadius]);

    const line = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .angle((d) => xScale(new Date(d.date)));

    const area = d3
      .areaRadial()
      .curve(d3.curveLinearClosed)
      .angle((d) => xScale(new Date(d.date)));

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr(
        "style",
        "width: 100%; height: auto; font: 10px; font-family: sans-serif"
      )
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    const average = d3.select(lineRef.current);
    average
      .data([data])
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr(
        "d",
        line.radius((d) => yScale(d.avg))
      );

    const minArea = d3.select(minRef.current);

    minArea
      .attr("fill", color)
      .data([data])
      .attr("fill-opacity", 0.5)
      .attr(
        "d",
        area.innerRadius((d) => yScale(d.min)).outerRadius((d) => yScale(d.max))
      );

    const maxArea = d3.select(maxRef.current);

    maxArea
      .data([data])
      .attr("fill", color)
      .attr("fill-opacity", 0.2)
      .attr(
        "d",
        area
          .innerRadius((d) => yScale(d.minmin))
          .outerRadius((d) => yScale(d.maxmax))
      );

    const xAxis = d3.select(xRef.current);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    xAxis
      .selectAll("g")
      .data(xScale.ticks())
      .enter()
      .append("g")
      .each((d, i, nodes) => {
        const id = d3.create("g").attr("id", "month").node().id;

        const angle = xScale(d);
        const date = new Date(d);
        const im = date.getMonth();

        d3.select(nodes[i])
          .append("path")
          .attr("stroke", "black")
          .attr("stroke-opacity", 0.2)
          .attr(
            "d",
            `M${d3.pointRadial(xScale(d), innerRadius)} L${d3.pointRadial(
              xScale(d),
              outerRadius
            )}`
          )
          .on("mouseover", function () {
            d3.select(this).transition().attr("stroke-opacity", 1);
          })
          .on("mouseleave", function () {
            d3.select(this).transition().attr("stroke-opacity", 0.2);
          });

        d3.select(nodes[i])
          .append("path")
          .attr("id", `path-${id}`)
          .datum([d, d3.utcMonth.offset(d, 1)])
          .attr("fill", "none")
          .attr(
            "d",
            ([a, b]) => `
          M${d3.pointRadial(xScale(a), innerRadius - 10)}
          A${innerRadius - 10},${innerRadius - 10} 0,0,1 ${d3.pointRadial(
              xScale(b),
              innerRadius - 10
            )}
        `
          );

        d3.select(nodes[i])
          .append("text")
          .attr("transform", `rotate(${angle * (180 / Math.PI)})`) // Rotate the text
          .append("textPath")
          .style("font-size", "0.8rem")
          .attr("startOffset", 6)
          .attr("xlink:href", `#path-${id}`)
          .text(monthNames[im]);
      });

    const yAxis = d3.select(yRef.current);
    yAxis
      .attr("text-anchor", "middle")
      .selectAll("g")
      .data(yScale.ticks().reverse())
      .join("g")
      .call((g) => {
        if (change) return;
        g.append("circle")
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-opacity", 0.2)
          .attr("r", yScale);
      })
      .call(
        (g) => {
          if (change) return;
          g.append("text")
            .attr("y", (d) => yScale(d))
            .style("font-size", ".6rem")
            .attr("dy", "0.35rem")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .attr("fill", "black")
            .attr("paint-order", "stroke")
            .text((d, i, arr) => {
              return `${d.toFixed(0)} `;
            })

            .clone(true)
            .attr("y", (d) => -yScale(d));
        }
        // .clone(true)
        // .attr("x", xScale(0))
      );
  }, [data, color]);
  return (
    <div
      id="chart_container"
      ref={chartRef}
      className="col-span-7 bg-white p-5"
    >
      <h1 className="w-full text-center text-xl md:text-2xl font-bold ">
        {details.title}
      </h1>
      <p className="text-center w-ful">{details.sub}</p>
      <svg ref={svgRef}>
        <path ref={maxRef}></path>
        <path ref={minRef}></path>
        <path ref={lineRef}></path>
        <g ref={xRef}></g>
        <g ref={yRef}></g>
      </svg>
    </div>
  );
};

export default Radial;
