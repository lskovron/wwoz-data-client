// ts-ignore
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

type BarChartDatum = {
  name: string;
  count: number;
};

type BarChartProps = { data: BarChartDatum[] };

// https://kamibrumi.medium.com/getting-started-with-react-d3-js-d86ccea05f08
const Barchart = ({ data }: BarChartProps) => {
  const [isBuilt, setIsBuild] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const buildChart = (
    ref: React.RefObject<HTMLDivElement>,
    data: BarChartDatum[]
  ): void => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.name))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => {
        return x(d.name) as number;
      })
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "#5f0f40");
  };

  useEffect(() => {
    if (data.length > 0 && ref.current && !isBuilt) {
      // @TODO: figure out how tf d3 works
      buildChart(ref, data);
      setIsBuild(true);
    }
  }, [data, ref.current]);

  if (!data) return <>loading...</>;

  return <div id="barchart" ref={ref} />;
};

export default Barchart;
