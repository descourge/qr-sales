interface Props {
  text: string;
  color?: "green" | "yellow" | "red";
}

export default function StatusBadge({
  text,
  color = "green",
}: Props) {
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <div
        className={`h-2 w-2 rounded-full ${colors[color]}`}
      />

      {text}
    </div>
  );
}