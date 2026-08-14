import React from 'react'

function Loading() {
  return (
    <div className="category-loading">
  <div className="loader-ring" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <h2>Loading products<span className="dots"><i>.</i><i>.</i><i>.</i></span></h2>

  <style>{`
    .category-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 22px;
      padding: 90px 20px;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .loader-ring {
      position: relative;
      width: 56px;
      height: 56px;
    }

    .loader-ring span {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: #23989a;
      animation: spin 1.1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
    }

    .loader-ring span:nth-child(2) {
      inset: 8px;
      border-top-color: #4fc3c5;
      animation-duration: 1.5s;
      animation-direction: reverse;
    }

    .loader-ring span:nth-child(3) {
      inset: 16px;
      border-top-color: #a9d9d9;
      animation-duration: 1.9s;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .category-loading h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: #656564;
      display: flex;
      align-items: baseline;
    }

    .dots i {
      font-style: normal;
      opacity: 0;
      animation: blink 1.4s infinite;
    }

    .dots i:nth-child(1) { animation-delay: 0s; }
    .dots i:nth-child(2) { animation-delay: 0.2s; }
    .dots i:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .loader-ring span, .dots i {
        animation: none !important;
      }
      .loader-ring span { border-top-color: #23989a; opacity: 0.4; }
      .dots i { opacity: 1; }
    }
  `}</style>
</div>
  )
}

export default Loading