import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { GeoPath, GeoProjection } from 'd3-geo';

interface GeoJsonSvgProps {
  geojson: GeoJSON.FeatureCollection;
  width: number;
  height: number;
}

export const GeoJsonSVG: React.FC<GeoJsonSvgProps> = ({ geojson, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!geojson) return;

    const projection: GeoProjection = d3.geoMercator().fitSize([width, height], geojson);
    const pathGenerator: GeoPath = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    svg
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'black');
  }, [geojson, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default GeoJsonSVG;