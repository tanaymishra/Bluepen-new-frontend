"use client";
import React from "react";
import Image from "next/image";

interface SliderItem {
  id: any;
  img: string;
}

interface InfiniteSliderProps {
  items: SliderItem[];
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({ items }) => {
  // Duplicate items to ensure seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <div className="flex animate-infinite-scroll w-max">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="mx-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          >
            <Image
              src={item.img}
              alt={`Slider image ${index}`}
              width={50}
              height={35}
              className="object-contain h-8 w-auto"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InfiniteSlider;
