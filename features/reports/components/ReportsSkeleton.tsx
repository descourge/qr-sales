"use client";

export default function ReportsSkeleton() {

  return (

    <div className="space-y-6">

      {/* KPIs */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-3
        "
      >

        {[...Array(3)].map((_, index) => (

          <div

            key={index}

            className="
              h-32
              animate-pulse
              rounded-2xl
              bg-slate-100
            "

          />

        ))}

      </div>

      {/* Tabla */}

      <div
        className="
          h-96
          animate-pulse
          rounded-2xl
          bg-slate-100
        "
      />

      {/* Tabla */}

      <div
        className="
          h-96
          animate-pulse
          rounded-2xl
          bg-slate-100
        "
      />

      {/* Productos */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {[...Array(6)].map((_, index) => (

          <div

            key={index}

            className="
              h-56
              animate-pulse
              rounded-2xl
              bg-slate-100
            "

          />

        ))}

      </div>

    </div>

  );

}