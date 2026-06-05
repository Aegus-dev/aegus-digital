import { ImageResponse } from "next/og";

export const alt = "Aegus Digital — AI systems that run your business while you sleep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#08090a",
          color: "#f7f8f8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#f97316",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#08090a",
            }}
          >
            ◆
          </div>
          <div style={{ fontSize: 22, fontWeight: 510, letterSpacing: "0.05em" }}>
            AEGUS DIGITAL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 510,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
              gap: "0 0.3em",
            }}
          >
            <span>AI systems that run your business</span>
            <span style={{ color: "#f97316" }}>while you sleep.</span>
          </div>
          <div style={{ fontSize: 26, color: "#8a8f98", maxWidth: 900, lineHeight: 1.4 }}>
            20 products. One system. 24/7 from Toronto.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#8a8f98",
          }}
        >
          <div>aegus-digital-v2-aegus.vercel.app</div>
          <div style={{ color: "#f97316", fontWeight: 510 }}>Toronto · systems engineering</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
