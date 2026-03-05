import React from 'react';

interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  emptyMessage?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  emptyMessage = 'Нет данных',
}) => {
  if (data.length === 0) {
    return <div style={{ padding: '12px', color: '#64748b', fontStyle: 'italic' }}>{emptyMessage}</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={col.width ? { width: col.width } : undefined}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key}>
                {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
