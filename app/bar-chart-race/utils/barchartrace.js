import * as d3 from "d3";

export const barchartrace = (
  data,
  colorArray,
  svgRef,
  contRef,
  barsRef,
  labelsRef,
  axisRef,
  yearRef
) => {
  const duration = 250;
  const n = 10;

  const marginTop = 16;
  const marginRight = 6;
  const marginBottom = 50;
  const marginLeft = 0;
  const barSize = 56;
  const width = contRef.current.clientWidth;
  const height = marginTop + barSize * n + marginBottom;

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
      color: getColor(name),
    }));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
    return data;
  }

  function getColor(name) {
    const colored = colorArray.find((e) => e.name == name);
    return colored.color;
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
          rank((name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t),
        ]);
      }
    }
    keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);
    return keyframes;
  };

  const keyframes = keyframesd();
  console.log(data, "data", keyframes, "keyframes", colorArray, "colors");

  const nameframes = d3.groups(
    keyframes.flatMap(([, data]) => data),
    (d) => d.name
  );

  const prev = new Map(
    nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
  );
  const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

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
              .attr("fill", (d) => d.color)
              .attr("fill-opacity", 0)
              .attr("x", x(0))
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
            .attr("y", (d) => y(d.rank))
            .attr("fill-opacity", 0.7)
            .attr("width", (d) => x(d.value) - x(0))
        ));
  }

  function labels(svg) {
    let label = d3
      .select(labelsRef.current)
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-weight", "bold")
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
              .attr("dy", "-0.25em")
              .attr("opacity", 0)
              .text((d) => d.name)
              .call((text) =>
                text
                  .append("tspan")
                  .attr("fill-opacity", 0.7)
                  .attr("font-weight", "normal")
                  .attr("fill", "black")
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
            .attr("transform", (d) => {
              const maxb = x(d3.max(data, (d) => d.value));
              const thisBar = x(d.value);

              const res = (thisBar / maxb) * 100;

              if (res < 8) {
                return `translate(${x(d.value) + 15},${y(d.rank)})`;
              } else {
                return `translate(${x(d.value)},${y(d.rank)})`;
              }
            })
            .attr("opacity", 1)
            .style("text-anchor", (d) => {
              const maxb = x(d3.max(data, (d) => d.value));
              const thisBar = x(d.value);

              const res = (thisBar / maxb) * 100;

              if (res < 8) {
                return "start"; // Align to the left
              } else {
                return "end"; // Default alignment
              }
            })
            .call(
              (g) =>
                g
                  .select("tspan")
                  .tween("text", (d) =>
                    textTween((prev.get(d) || d).value, d.value)
                  )
              // .attr("fill", (d) => {
              //   const maxb = x(d3.max(data, (d) => d.value));
              //   const thisBar = x(d.value);

              //   const res = (thisBar / maxb) * 100;

              //   if (res < 8) {
              //     return "black"; // Align to the left
              //   } else {
              //     return "white"; // Default alignment
              //   }
              // })
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

  const x = d3.scaleLinear([0, 1], [marginLeft, width - marginRight]);
  const y = d3
    .scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
    .padding(0.1);

  const svg = d3
    .select(svgRef.current)
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");
  //.style("overflow", "visible");

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  //const updateTicker = ticker();

  let currentKeyframeIndex = 0;

  const animate = () => {
    if (currentKeyframeIndex >= keyframes.length) {
      return clearInterval(animationInterval);
    }

    const keyframe = keyframes[currentKeyframeIndex];
    const transition = svg.transition().duration(duration).ease(d3.easeLinear);

    const topBarValue = x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
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
};
