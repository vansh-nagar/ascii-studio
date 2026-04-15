"use client";

import { ImagesBadge } from "./images-badge";

export default function ImagesBadgeDemoFour() {
  return (
    <div className="flex w-full items-center justify-center">
      <ImagesBadge
        text="Gallery View"
        images={["/bento/card1.png", "/bento/card2.png", "/bento/card3.png"]}
        hoverSpread={35}
        hoverRotation={20}
        teaserImageWidths={[100, 100, 100]}
        hoverImageWidths={[160, 210, 150]}
      />
    </div>
  );
}
