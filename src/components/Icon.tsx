type IconName =
  | "external"
  | "arrow"
  | "plus"
  | "check"
  | "close"
  | "download"
  | "copy"
  | "print";

const paths: Record<IconName, string> = {
  external: "M6 18 18 6M6 6h12v12",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  download: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5",
  copy: "M8 8h12v13H8zM16 8V3H3v13h5",
  print: "M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6z",
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
