"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#0020c2",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        boxShadow: "0 4px 16px rgba(0,32,194,0.35)",
        zIndex: 100,
        transition: "background 0.18s ease, transform 0.18s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "#ad0000";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "#0020c2";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
      }}
    >
      ↑
    </button>
  );
}
