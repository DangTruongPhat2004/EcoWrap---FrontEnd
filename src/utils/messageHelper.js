import { CloseOutlined } from "@ant-design/icons";
import React from "react";

/**
 * Enhanced message helper that adds close button to Ant Design messages
 * Usage: messageHelper.success(messageApi, "Your message here")
 *
 * This file uses React.createElement instead of JSX to remain valid as a
 * plain .js module in build systems that don't transform JSX in .js files.
 */
export const messageHelper = {
  success: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    const node = React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        },
      },
      React.createElement("span", null, content),
      React.createElement(CloseOutlined, {
        style: { cursor: "pointer", fontSize: "12px" },
        onClick: () => messageApi.destroy(key),
      })
    );

    messageApi.open({ type: "success", content: node, duration, key });
  },

  error: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    const node = React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        },
      },
      React.createElement("span", null, content),
      React.createElement(CloseOutlined, {
        style: { cursor: "pointer", fontSize: "12px" },
        onClick: () => messageApi.destroy(key),
      })
    );

    messageApi.open({ type: "error", content: node, duration, key });
  },

  warning: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    const node = React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        },
      },
      React.createElement("span", null, content),
      React.createElement(CloseOutlined, {
        style: { cursor: "pointer", fontSize: "12px" },
        onClick: () => messageApi.destroy(key),
      })
    );

    messageApi.open({ type: "warning", content: node, duration, key });
  },

  info: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    const node = React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        },
      },
      React.createElement("span", null, content),
      React.createElement(CloseOutlined, {
        style: { cursor: "pointer", fontSize: "12px" },
        onClick: () => messageApi.destroy(key),
      })
    );

    messageApi.open({ type: "info", content: node, duration, key });
  },
};
