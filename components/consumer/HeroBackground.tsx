export default function HeroBackground() {
  return (
    <>
      {/* Geometric tile pattern — very subtle */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%238B1E3F' stroke-width='1'><path d='M30 0 L60 30 L30 60 L0 30 Z'/><path d='M30 15 L45 30 L30 45 L15 30 Z'/></g></svg>")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-accent-blush to-saffron-light blur-3xl opacity-60 animate-blob-1" />
        <div className="absolute top-20 -right-40 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-saffron-light to-accent-blush blur-3xl opacity-50 animate-blob-2" />
        <div className="absolute top-[400px] left-1/3 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-accent-blush via-warm-white to-saffron-light blur-3xl opacity-40 animate-blob-3" />
      </div>
    </>
  );
}
