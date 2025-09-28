import React from "react";
import { Card, CardBody } from "@nextui-org/react";

// Ví dụ card (bạn có thể dùng ProductCard của bạn thay thế)
const ProductCard = ({
  img,
  title,
  topMeta,
  priceLine,
  provider,
  tags = [],
  description,
  isNew,
}) => (
  <Card
    className="
      cursor-pointer overflow-hidden rounded-[28px] border border-gray-200
      shadow-sm transition-all duration-300 ease-out
      w-[300px] md:w-[360px] lg:w-[420px] snap-start shrink-0
      transform-gpu will-change-transform
      hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]
      focus-visible:shadow-xl focus-visible:scale-[1.02]
    "
    tabIndex={0} // để focus bằng bàn phím vẫn có hiệu ứng
  >
    <CardBody className="p-0">
      <div className="relative m-3 rounded-[24px] overflow-hidden">
        <div className="aspect-[16/11] w-full">
          <img
            src={img}
            alt={title}
            className="
              w-full h-full object-cover
              transition-transform duration-500 ease-out transform-gpu
              group-hover:scale-[1.06]   /* zoom ảnh nhẹ hơn */
            "
            draggable="false"
          />
        </div>
        {isNew && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow">
            New
          </span>
        )}
      </div>

      <div className="px-5 pb-5">
        <p className="text-sm text-gray-500">{topMeta}</p>
        <h3 className="mt-2 text-[20px] leading-6 font-semibold text-[#2A1F6F]">
          {title}
        </h3>
        <p className="mt-1 text-sm">{priceLine}</p>
        <p className="mt-1 text-sm">
          Nhà cung cấp: <strong className="text-[#2A1F6F]">{provider}</strong>
        </p>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <div
              key={t}
              className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </CardBody>
  </Card>
);

export const ProductCarousel = ({ items = [] }) => {
  const trackRef = React.useRef(null);

  // cuộn bằng nút
  const scrollByAmount = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amt = Math.min(600, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir * amt, behavior: "smooth" });
  };

  // --- KÉO BẰNG CHUỘT / BÚT (Pointer Events) ---
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const startScroll = React.useRef(0);

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
    el.scrollLeft = startScroll.current - dx;
  };

  const onPointerUpOrLeave = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = false;
    el.releasePointerCapture?.(e.pointerId);
  };

  // Ẩn thanh cuộn (giữ vẫn cuộn được)
  const hideScrollbar =
    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']";

  return (
    <div className="relative">
      {/* Nút trái */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByAmount(-1)}
        className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10
                   h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow
                   hover:bg-white transition"
      >
        ‹
      </button>

      {/* Nút phải */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByAmount(1)}
        className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10
                   h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow
                   hover:bg-white transition"
      >
        ›
      </button>

      {/* Track cuộn ngang */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrLeave}
        onPointerLeave={onPointerUpOrLeave}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth ${hideScrollbar}
              px-1 md:px-2 select-none md:cursor-grab md:active:cursor-grabbing`} /* ✅ */
      >
        {/* Spacer để nội dung không dính sát mép khi snap */}
        <div className="shrink-0 w-1 md:w-2" aria-hidden />
        {items.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
        <div className="shrink-0 w-1 md:w-2" aria-hidden />
      </div>
    </div>
  );
};
