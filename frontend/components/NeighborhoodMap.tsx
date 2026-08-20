import type { Ref } from "react";

export type PlacePin = {
  id: string;
  label: string;
  walk: string;
  note: string;
  x: number;
  y: number;
  home?: boolean;
};

export function NeighborhoodMap({
  pins,
  selectedId,
  onSelect,
  pinsRef,
}: {
  pins: readonly PlacePin[];
  selectedId: string;
  onSelect: (id: string) => void;
  pinsRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="absolute inset-0" role="group" aria-label="Cercanía en Roma Sur">
      <svg
        className="h-full w-full"
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <rect width="800" height="1000" fill="#c1c4b1" />

        <rect x="-40" y="-20" width="168" height="1080" fill="#b3b7a2" />
        <rect x="8" y="-20" width="10" height="1080" fill="#d4d8c6" opacity="0.55" />
        <text
          x="48"
          y="520"
          fill="#2f3a28"
          opacity="0.38"
          fontSize="13"
          letterSpacing="4"
          fontFamily="ui-monospace, monospace"
          transform="rotate(-90 48 520)"
        >
          INSURGENTES
        </text>

        <g opacity="0.92">
          <rect x="190" y="80" width="150" height="118" fill="#b8bca4" />
          <rect x="360" y="70" width="128" height="96" fill="#aeb29a" />
          <rect x="508" y="90" width="164" height="140" fill="#b4b89f" />
          <rect x="200" y="220" width="118" height="156" fill="#a8ad94" />
          <rect x="338" y="210" width="176" height="132" fill="#b7bba6" />
          <rect x="534" y="250" width="132" height="110" fill="#a6ab92" />
          <rect x="188" y="400" width="142" height="124" fill="#b0b49c" />
          <rect x="348" y="368" width="120" height="168" fill="#d4d8c6" />
          <rect x="488" y="390" width="188" height="146" fill="#aeb397" />
          <rect x="196" y="548" width="160" height="136" fill="#a4a98e" />
          <rect x="376" y="560" width="148" height="122" fill="#b6baa3" />
          <rect x="544" y="558" width="126" height="154" fill="#acb194" />
          <rect x="210" y="708" width="134" height="118" fill="#b3b79f" />
          <rect x="364" y="702" width="190" height="108" fill="#a9ae95" />
          <rect x="574" y="730" width="112" height="96" fill="#b8bca4" />
        </g>

        <path
          d="M620 40 C710 70 780 160 750 250 C720 330 640 340 580 280 C530 230 540 90 620 40Z"
          fill="#8e966e"
          opacity="0.72"
        />
        <circle cx="660" cy="140" r="18" fill="#7d8660" opacity="0.8" />
        <circle cx="700" cy="188" r="14" fill="#7d8660" opacity="0.7" />
        <circle cx="638" cy="200" r="11" fill="#7d8660" opacity="0.65" />

        <line x1="170" y1="0" x2="170" y2="1000" stroke="#d4d8c6" strokeWidth="2" opacity="0.35" />
        <line x1="170" y1="360" x2="800" y2="360" stroke="#d4d8c6" strokeWidth="2" opacity="0.28" />
        <line x1="170" y1="540" x2="800" y2="540" stroke="#d4d8c6" strokeWidth="2" opacity="0.28" />

        <text
          x="228"
          y="640"
          fill="#2f3a28"
          opacity="0.32"
          fontSize="12"
          letterSpacing="3"
          fontFamily="ui-monospace, monospace"
        >
          MEDELLÍN
        </text>
      </svg>

      <div ref={pinsRef} className="absolute inset-0">
        {pins.map((pin) => {
          const selected = pin.id === selectedId;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelect(pin.id)}
              aria-pressed={selected}
              aria-label={
                pin.walk ? `${pin.label}, ${pin.walk} a pie` : pin.label
              }
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <span
                className={
                  selected
                    ? "absolute bottom-[calc(100%+0.45rem)] left-1/2 -translate-x-1/2 whitespace-nowrap bg-intro-surface px-2 py-1 text-[0.62rem] font-medium tracking-[0.14em] text-place-ink uppercase md:text-[0.68rem]"
                    : "absolute bottom-[calc(100%+0.45rem)] left-1/2 -translate-x-1/2 whitespace-nowrap bg-intro-surface/90 px-2 py-1 text-[0.62rem] font-medium tracking-[0.14em] text-place-ink/80 uppercase max-md:sr-only md:text-[0.62rem]"
                }
              >
                {pin.label}
                {pin.walk ? ` · ${pin.walk}` : ""}
              </span>
              <span className="flex h-11 w-11 items-center justify-center md:h-10 md:w-10">
                <span
                  className={
                    pin.home
                      ? "block h-3 w-3 bg-place-ink"
                      : selected
                        ? "block h-2.5 w-2.5 bg-place-ink"
                        : "block h-2 w-2 bg-place-ink/70"
                  }
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
