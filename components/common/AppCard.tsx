type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AppCard({
  title,
  children,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">

        {title}

      </h3>

      {children}

    </div>
  );
}