"use client";

import React from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function BlurImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loading = "lazy",
  ...props
}: BlurImageProps) {
  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        {...props}
      />
    </div>
  );
}
