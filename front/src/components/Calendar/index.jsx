import React, { Component } from "react";
import styles from "./index.less";

const d3 = require("../../common/lib/d3.min");

class Calendar extends Component {
  componentDidMount() {
    const width = 960;

    const height = 750;

    const cellSize = 80; // cell size

    const day = d3.timeFormat("%u");

    const week = d3.timeFormat("%V"); // week number of the year
    const month = d3.timeFormat("%m"); // month number
    const year = d3.timeFormat("%Y");
    const date = d3.timeFormat("%e");

    const svg = d3
      .select("#chart")
      .selectAll("svg")
      .data(d3.range(7, 8)) // years included in the viz
      .enter()
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "RdYlGn")
      .append("g");

    svg
      .selectAll(".dayText")
      .data(["一", "二", "三", "四", "五", "六", "日"])
      .enter()
      .append("text")
      .attr("x", (d, i) => {
        return i * cellSize + cellSize / 2;
      })
      .attr("y", 16)
      .text(d => {
        return d;
      });

    const rect = svg
      .selectAll(`.${styles.day}`)
      .data(d => {
        return d3.timeDays(new Date(2018, d, 1), new Date(2018, d + 1, 1));
      })
      .enter()
      .append("g")
      .attr("class", styles.day)
      .attr("transform", d => {
        const x = (day(d) - 1) * cellSize;
        const weekDiff = week(d) - week(new Date(year(d), month(d) - 1, 1));
        const y = weekDiff * cellSize + 25;
        return `translate(${x} ${y})`;
      });

    rect
      .append("rect")
      .attr("width", cellSize)
      .attr("height", cellSize);

    rect
      .append("text")
      .attr("x", cellSize / 2)
      .attr("y", cellSize / 2)
      .text(d => {
        return date(d);
      });
  }

  render() {
    return <div id="chart" className="clearfix" />;
  }
}

export default Calendar;
