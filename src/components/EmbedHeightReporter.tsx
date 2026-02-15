"use client";

import { useEffect } from "react";

const RESIZE_MESSAGE_TYPE = "leadformhub-resize";

function sendHeight() {
  const height = Math.max(200, document.documentElement.scrollHeight);
  if (typeof window !== "undefined" && window.parent !== window) {
    window.parent.postMessage({ type: RESIZE_MESSAGE_TYPE, height }, "*");
  }
}

/**
 * When the form is shown inside an iframe (?embed=1), report the document
 * height to the parent so it can resize the iframe to fit content (no scrollbar).
 */
export function EmbedHeightReporter() {
  useEffect(() => {
    sendHeight();
    const t1 = setTimeout(sendHeight, 100);
    const t2 = setTimeout(sendHeight, 500);
    const t3 = setTimeout(sendHeight, 1500);

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return null;
}
