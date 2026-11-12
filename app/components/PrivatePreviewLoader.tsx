"use client";

import { useEffect } from "react";

export default function PrivatePreviewLoader({ src }: { src: string }) {
  useEffect(() => {
    if (window.psyncJournal || document.querySelector("script[data-psync-private-preview]")) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.psyncPrivatePreview = "true";
    document.head.appendChild(script);
  }, [src]);

  return null;
}
