import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TheWebxite — the tools exist, they're just not connected into one system";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: 72, background: "#0325A8", color: "#FFFFFF",
      }}>
        <div style={{ fontSize: 68, lineHeight: 1.04, letterSpacing: -2, maxWidth: 980, display: "flex" }}>
          The tools exist. They&rsquo;re just not connected into one system.
        </div>
        <div style={{ fontSize: 26, color: "#BCC7F5", display: "flex" }}>
          TheWebxite — Petaling Jaya digital architect
        </div>
      </div>
    ),
    size,
  );
}
