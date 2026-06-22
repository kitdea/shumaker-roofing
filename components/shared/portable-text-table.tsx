type TableRow = {
  _key: string;
  cells?: string[];
};

export function PortableTextTable({ rows }: { rows?: TableRow[] }) {
  if (!rows || rows.length === 0) return null;
  const [headerRow, ...bodyRows] = rows;

  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60">
            {headerRow.cells?.map((cell, i) => (
              <th key={i} className="border-b border-border px-4 py-3 text-left font-bold text-foreground">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row) => (
            <tr key={row._key} className="even:bg-muted/30">
              {row.cells?.map((cell, i) => (
                <td key={i} className="border-b border-border px-4 py-3 align-top text-foreground/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
