import "./trackergraph.style.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Scatter } from "@ant-design/charts";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const TrackerGraph = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/tracker");

      setData(data);
    } catch (error) {
      console.error("Error fetching Data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  function isWheelDown(event) {
    event.gEvent.preventDefault();

    return event.gEvent.originalEvent.deltaY > 0;
  }

  const config = {
    appendPadding: 50,
    data: data,
    xField: "totalTestResults",
    yField: "positive",
    colorField: "state",
    shape: "circle",
    sizeField: "positive",
    size: [5, 30],
    meta: {
      totalTestResults: {
        alias: "Total Test Results",
        formatter: (value) => {
          return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        },
      },
      positive: {
        alias: "Positive",
        formatter: (value) => {
          return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        },
      },
      state: {
        alias: "State",
      },
      covid19Site: {
        alias: "Covid19 Test Site",
      },
      notes: {
        alias: "Notes",
      },
    },
    yAxis: {
      nice: false,
      position: "left",
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
      title: {
        text: "Positive Results",
        style: { fontSize: 16, stroke: "#aaa" },
      },
    },
    legend: { position: "bottom" },
    xAxis: {
      nice: false,
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
      title: {
        text: "Total Test Results",
        style: { fontSize: 16, stroke: "#aaa" },
      },
    },
    tooltip: {
      fields: ["totalTestResults", "positive", "state", "notes"],
      enterable: true,
    },
    interactions: [
      {
        type: "view-zoom",
        start: [
          {
            trigger: "plot:mousewheel",
            isEnable(context) {
              return isWheelDown(context.event);
            },
            action: "scale-zoom:zoomOut",
            throttle: { wait: 100, leading: true, trailing: false },
          },
          {
            trigger: "plot:mousewheel",
            isEnable(context) {
              return !isWheelDown(context.event);
            },
            action: "scale-zoom:zoomIn",
            throttle: { wait: 100, leading: true, trailing: false },
          },
        ],
      },
    ],
  };

  return (
    <div className={`tracker-container ${loading ? "loading" : ""}`}>
      {(() => {
        if (loading) {
          return <div className="loader" />;
        }

        return <Scatter {...config} />;
      })()}
    </div>
  );
};

export default TrackerGraph;
