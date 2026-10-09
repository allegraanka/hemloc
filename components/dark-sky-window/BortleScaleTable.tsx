import { bortleGuideRows } from "@/lib/dark-sky-window/light-pollution";

export function BortleScaleTable() {
  const rows = bortleGuideRows();

  return (
    <div className="overflow-x-auto rounded-3xl border border-ink/8 bg-white/70">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">
          Bortle classes 1 through 9 and the population rule Hemloc uses for each
        </caption>
        <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
              Class
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Typical sky
            </th>
            <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
              Hemloc uses this when
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.bortle} className="border-b border-ink/5 last:border-0">
              <th
                scope="row"
                className="whitespace-nowrap px-4 py-3 font-medium text-ink sm:px-5"
              >
                {row.bortle}
              </th>
              <td className="px-4 py-3 text-muted">{row.sky}</td>
              <td className="px-4 py-3 text-ink sm:px-5">{row.populationRule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
