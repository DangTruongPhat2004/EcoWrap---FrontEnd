import { CloseOutlined } from "@ant-design/icons";
import React from "react";

/**
 * Enhanced message helper that adds close button to Ant Design messages
 * Usage: messageHelper.success(messageApi, "Your message here")
 */
export const messageHelper = {
  success: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    messageApi.open({
      type: "success",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span>{content}</span>
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "12px" }}
            onClick={() => messageApi.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },

  error: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    messageApi.open({
      type: "error",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span>{content}</span>
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "12px" }}
            onClick={() => messageApi.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },

  warning: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    messageApi.open({
      type: "warning",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span>{content}</span>
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "12px" }}
            onClick={() => messageApi.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },

  info: (messageApi, content, duration = 4) => {
    const key = `message-${Date.now()}`;
    messageApi.open({
      type: "info",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span>{content}</span>
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "12px" }}
            onClick={() => messageApi.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },
};
