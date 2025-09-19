import React from "react";

/**
 * logos: [{ src, alt, width?, height? }]
 * speed: "slow" | "normal" | "fast"
 * reverse: boolean (chạy ngược chiều)
 */
export default function ClientLogoMarquee({
  title = "Được tin dùng bởi",
  logos = [],
  speed = "normal",
  reverse = false,
  className = "",
}) {
  const durations = {
    slow: "60s",
    normal: "40s",
    fast: "24s",
  };
  const duration = durations[speed] || durations.normal;

  // nhân đôi danh sách để lặp vô hạn mượt
  const doubled = [...logos, ...logos];

  return (
    <section className={`py-10 sm:py-14 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
          {title}
        </h3> */}

        <div
          className="
            group relative w-full overflow-hidden 
            bg-white
            h-24 sm:h-20
          "
        >
          {/* Track: dùng width max-content + translateX animate */}
          <div
            className={`
              flex items-center gap-10 sm:gap-16 w-[max-content]
              will-change-transform
              hover:[animation-play-state:paused]
            `}
            style={{
              animation: `${
                reverse ? "marquee-right" : "marquee-left"
              } ${duration} linear infinite`,
            }}
          >
            {doubled.map((logo, i) => (
              <div
                key={i}
                className="
                  flex items-center justify-center
                  h-24 sm:h-40
                  px-2 sm:px-3
                "
                style={{ width: 150, height: 100 }} // giống kích thước mẫu; có thể chỉnh
              >
                {/* Nếu dùng Next.js có thể đổi sang <Image> */}
                <img
                  src={logo.src}
                  alt={logo.alt || "Client Logo"}
                  width={logo.width || 150}
                  height={logo.height || 100}
                  loading="lazy"
                  decoding="async"
                  className="object-contain max-h-[60%] sm:max-h-[70%] opacity-90 hover:opacity-100 transition-opacity"
                  style={{ color: "transparent" }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
