type ProductImageProps = {
  image?: string;
  alt: string;
  fallbackClassName?: string;
};

const emojiFallback: Record<string, string> = {
  "🍚": "🍚",
  "🫘": "🥜",
  "🫙": "🛢️",
  "🛢️": "🛢️",
  "🥔": "🥔",
  "🧅": "🧅",
  "🌶️": "🌶️",
  "🍆": "🍆",
  "🟢": "🥬",
  "🐟": "🐟",
  "🐠": "🐟",
  "🦐": "🍤",
  "🍗": "🍗",
  "🥩": "🥩",
  "🍖": "🍖",
  "🦆": "🍗",
  "🥚": "🥚",
  "🥛": "🥛",
  "🥣": "🥣",
  "🧈": "🧈",
  "🫚": "🌱",
  "🧄": "🧄",
  "🍃": "🌿",
};

export default function ProductImage({
  image,
  alt,
  fallbackClassName = "product-placeholder product-emoji",
}: ProductImageProps) {
  const emoji = image?.trim() || "🛒";
  const displayEmoji = emojiFallback[emoji] || "🛒";

  return (
    <span
      className={fallbackClassName}
      role="img"
      aria-label={alt}
    >
      {displayEmoji}
    </span>
  );
}