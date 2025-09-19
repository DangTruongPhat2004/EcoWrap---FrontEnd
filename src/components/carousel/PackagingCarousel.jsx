import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function PackagingCarousel({
  title = "Sản phẩm bao bì",
  slides = [],
}) {
  const trackRef = useRef(null);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  // --- kéo bằng chuột/touch ---
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    el.setPointerCapture?.(e.pointerId);
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
  };

  const onPointerMove = (e) => {
    if (!isDown.current) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startScroll.current - dx; // kéo trái/phải
  };

  const onPointerUpOrLeave = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = false;
    el.releasePointerCapture?.(e.pointerId);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
      <div className="max-w-8xl mx-auto px-2">
        {/* <div className="max-w-7xl mx-auto px-4 mb-6">
          <h2 className="text-4xl font-semibold text-gray-800">{title}</h2>
        </div> */}

        {/* Wrapper để đặt nút absolute */}
        <div className="relative">
          {/* Track trượt */}
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrLeave}
            onPointerLeave={onPointerUpOrLeave}
            className="
    relative flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory
    [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
    select-none cursor-grab active:cursor-grabbing
  "
          >
            {slides.map((s) => (
              <article
                key={s.id}
                className="relative flex-none w-full md:w-1/2 snap-start overflow-hidden aspect-[25/20] bg-gray-200 "
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  draggable="false"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                  <h3 className="text-4xl sm:text-5xl font-semibold drop-shadow">
                    {s.title}
                  </h3>

                  {Array.isArray(s.categories) && s.categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg">
                      {s.categories.map((c, i) => (
                        <a
                          key={i}
                          href={s.href || "#"}
                          className="underline decoration-white/60 underline-offset-4 hover:decoration-white"
                        >
                          {c}
                        </a>
                      ))}
                    </div>
                  )}

                  {s.ctaLabel && (
                    <a
                      href={s.href || "#"}
                      className="mt-6 inline-flex items-center text-white text-xl font-medium"
                    >
                      {s.ctaLabel}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Nút trái/phải – canh giữa theo chiều dọc, đè trên 2 tấm ảnh */}
          <button
            onClick={() => scrollByPage("left")}
            aria-label="Xem trước"
            className="
              absolute left-2 top-1/2 -translate-y-1/2 z-10
              h-12 w-12 grid place-items-center rounded-full
              bg-white/80 hover:bg-white shadow border border-gray-200
              backdrop-blur supports-[backdrop-filter]:backdrop-blur
            "
          >
            ←
          </button>
          <button
            onClick={() => scrollByPage("right")}
            aria-label="Xem tiếp"
            className="
              absolute right-2 top-1/2 -translate-y-1/2 z-10
              h-12 w-12 grid place-items-center rounded-full
              bg-white/80 hover:bg-white shadow border border-gray-200
              backdrop-blur supports-[backdrop-filter]:backdrop-blur
            "
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

PackagingCarousel.propTypes = {
  title: PropTypes.string,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string),
      ctaLabel: PropTypes.string,
      href: PropTypes.string,
    })
  ),
};
