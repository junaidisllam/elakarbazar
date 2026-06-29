"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

export default function ProductLikeButton() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => setIsLiked(!isLiked)} 
        className={`p-2 rounded-full border border-zinc-200 bg-white shadow-sm transition-colors cursor-pointer ${isLiked ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'}`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary' : ''}`} />
      </button>
      <button className="p-2 rounded-full border border-zinc-200 bg-white shadow-sm text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
