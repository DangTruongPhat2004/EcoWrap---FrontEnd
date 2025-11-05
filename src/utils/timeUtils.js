// Utility functions for Hanoi timezone (UTC+7)
// Hanoi is in ICT (Indochina Time) timezone which is UTC+7

/**
 * Convert any timestamp to Hanoi timezone and format it
 * @param {string|Date} timestamp - The timestamp (can be UTC or any timezone)
 * @returns {string} Formatted time string in Hanoi timezone
 */
export const formatTimeHanoi = (timestamp) => {
  // Parse the timestamp (handles both ISO strings and Date objects)
  const date = new Date(timestamp);

  // Use Intl.DateTimeFormat to convert to Hanoi timezone
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", // Hanoi uses same timezone as Ho Chi Minh
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
};

/**
 * Format date to Hanoi timezone with date
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTimeHanoi = (timestamp) => {
  const date = new Date(timestamp);

  // Get current time in Hanoi
  const now = new Date();
  const nowHanoi = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const dateHanoi = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  // Calculate difference in hours
  const diffInHours = (nowHanoi - dateHanoi) / (1000 * 60 * 60);

  const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // If less than 24 hours, show only time
  if (diffInHours < 24) {
    return timeFormatter.format(date);
  }

  // If less than 7 days, show day of week + time
  if (diffInHours < 168) {
    // 7 days = 168 hours
    const dayFormatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return dayFormatter.format(date);
  }

  // Otherwise show full date
  const dateStr = dateFormatter.format(date);
  const timeStr = timeFormatter.format(date);
  return `${dateStr} ${timeStr}`;
};

/**
 * Get relative time in Vietnamese (e.g., "5 phút trước", "2 giờ trước")
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Relative time string in Vietnamese
 */
export const getRelativeTimeHanoi = (timestamp) => {
  const date = new Date(timestamp);

  // Get current time in Hanoi timezone
  const now = new Date();
  const nowHanoi = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const dateHanoi = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  const diffInSeconds = Math.floor((nowHanoi - dateHanoi) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    // Show actual date for older messages
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatter.format(date);
  }
};

/**
 * Get current time in Hanoi timezone
 * @returns {Date} Current date in Hanoi timezone
 */
export const getCurrentTimeHanoi = () => {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
};

/**
 * Check if timestamp is today in Hanoi timezone
 * @param {string|Date} timestamp - The timestamp to check
 * @returns {boolean} True if the date is today
 */
export const isTodayHanoi = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const dateStr = dateFormatter.format(date);
  const nowStr = dateFormatter.format(now);

  return dateStr === nowStr;
};

/**
 * Format time for chat message display
 * Shows time for today, date for older messages
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted string for display
 */
export const formatChatTimeHanoi = (timestamp) => {
  const date = new Date(timestamp);

  if (isTodayHanoi(date)) {
    // Today: show only time in Hanoi timezone
    return formatTimeHanoi(date);
  } else {
    // Other days: show date in Hanoi timezone
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
    });
    return formatter.format(date);
  }
};

/**
 * Debug function to check timezone conversion
 * @param {string|Date} timestamp - The timestamp to debug
 */
export const debugTimezone = (timestamp) => {
  const date = new Date(timestamp);

  console.log("=== TIMEZONE DEBUG ===");
  console.log("Original timestamp:", timestamp);
  console.log("Date object:", date);
  console.log("UTC time:", date.toUTCString());
  console.log("ISO time:", date.toISOString());

  // Show in different timezones for comparison
  console.log("Local (browser) time:", date.toLocaleString("vi-VN"));
  console.log(
    "Hanoi time:",
    date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  console.log(
    "UTC time string:",
    date.toLocaleString("vi-VN", { timeZone: "UTC" })
  );

  console.log("Formatted for chat:", formatChatTimeHanoi(timestamp));
  console.log("===================");
};
