"use client";

import Cd from "../ascii/cd";
import Pitstop from "../ascii/pitstop";
import RainbowFire from "../ascii/rainbow-fire";
import RedFire from "../ascii/red-fire";
import Star from "../ascii/star";
import CopyDropdown from "./copy-drop-down";
import { useSearch } from "./search-context";

const asciiAnimations = [
  {
    name: "Star",
    description: "ASCII animation of a star.",
    component: <Star />,
    registryName: "star-animation",
    landscape: false,
  },
  {
    name: "Rainbow Fire",
    description: "ASCII rainbow fire animation.",
    component: <RainbowFire />,
    registryName: "rainbow-fire",
    landscape: false,
  },
  {
    name: "Red Fire",
    description: "ASCII flame animation in a red terminal style.",
    component: <Pitstop />,
    registryName: "red-fire",
    landscape: true,
  },
  {
    name: "Red Fire",
    description: "ASCII flame animation in a red terminal style.",
    component: <RedFire />,
    registryName: "red-fire",
    landscape: false, // Example: this one will span two columns
  },
  {
    name: "CD Animation",
    description: "ASCII animation of a CD spinning.",
    component: <Cd />,
    registryName: "cd",
    landscape: false,
  },
];

const AsciiAnimationsGrid = () => {
  const { query } = useSearch();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAnimations = asciiAnimations.filter((item) => {
    if (!normalizedQuery) return true;

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.registryName.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-[95vw] sm:w-[70vw] mx-auto">
      {filteredAnimations.map((item, index) => (
        <div
          key={index}
          className={`relative border rounded-3xl aspect-square flex items-center justify-center overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${item.landscape ? "sm:col-span-2" : ""}`}
        >
          <div className="z-30">{item.component}</div>

          <div className="leading-1 absolute left-4 bottom-4">
            <p className="text-xs font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>

          <div className=" absolute top-2 right-2">
            <CopyDropdown registryName={item.registryName} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AsciiAnimationsGrid;
