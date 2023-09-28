import * as d3 from "d3";
import { useEffect, useState } from "react";
import styles from "./Map.module.scss";
import clsx from "clsx";

const Map = ({ children }) => {
  let mapHeight = 600;
  let mapWidth = 600;


  useEffect(() => {
    d3.json("/departements.geojson").then(function (json) {
      let projection = d3.geoMercator().fitSize([mapWidth, mapHeight], json);
      let geoGenerator = d3.geoPath().projection(projection);

      d3.select(".map")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
        .selectAll("path")
        .data(json.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("stroke", "#000")
        .attr("fill", "#fff")

      let u = d3.select(".content g.map").selectAll("path").data(json.features);

      u.enter()
        .append("path")
        .attr("d", geoGenerator)
        .on("mouseover", handleMouseover)

		function handleMouseover(e, d) {
			let pixelArea = geoGenerator.area(d);
			let bounds = geoGenerator.bounds(d);
			let centroid = geoGenerator.centroid(d);
			let measure = geoGenerator.measure(d);
		
			d3.select(".content .info").text(
			  d.properties.name +
				" (path.area = " +
				pixelArea.toFixed(1) +
				" path.measure = " +
				measure.toFixed(1) +
				")"
			);
		
			d3.select(".content .boundingbox rect")
			.attr("x", bounds[0][0])
			.attr("y", bounds[0][1])
			.attr("width", bounds[1][0] - bounds[0][0])
			.attr("height", bounds[1][1] - bounds[0][1]);
		
		  d3.select(".content .centroid")
			.style("display", "inline")
			.attr("transform", "translate(" + centroid + ")");
		  }

		
    });
  });

  return (
    <div className={styles.content}>
      {children}
      <svg width="620px" height="600px">
        <g className={clsx("map", styles.map)}></g>
        <g className={clsx("boundingbox", styles.boudingbox)}>
          <rect></rect>
        </g>
        <g className={clsx("centroid", styles.centroid)}>
          <circle r="4"></circle>
        </g>
      </svg>
      <p className={styles.red}>yo c squieezie</p>
    </div>
  );
};

export default Map;
