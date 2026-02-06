"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #fdf2f8, #fff1f2, #fef2f2)",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>💔</div>

            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                background: "linear-gradient(to right, #ec4899, #f43f5e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "1rem",
              }}
            >
              Oops! Something broke
            </h1>

            <p
              style={{
                color: "#78716c",
                marginBottom: "2rem",
                fontSize: "1.1rem",
              }}
            >
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            <button
              onClick={reset}
              style={{
                background: "linear-gradient(to right, #ec4899, #f43f5e)",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                marginRight: "0.5rem",
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "white",
                color: "#ec4899",
                border: "2px solid #fbcfe8",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
