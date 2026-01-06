"use client";

import React from 'react';

interface Props {
  series: {
    months: string[];
    billTotals: number[];
    dormTotals: number[];
  };
}

function formatLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

export default function ChartComparison({ series }: Props) {
  const { months, billTotals, dormTotals } = series;

  const width = 760;
  const height = 220;
  const padding = 40;

  const maxValue = Math.max(...billTotals, ...dormTotals, 1);

  const x = (i: number) => padding + (i * (width - padding * 2)) / Math.max(1, months.length - 1);
  const y = (v: number) => height - padding - (v / maxValue) * (height - padding * 2);

  const linePath = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = padding + t * (height - padding * 2);
        return <line key={t} x1={padding} x2={width - padding} y1={yy} y2={yy} stroke="#e6e6e6" />;
      })}

      {/* axes labels */}
      {months.map((m, i) => (
        <text key={m} x={x(i)} y={height - 8} fontSize={11} textAnchor="middle">
          {formatLabel(m)}
        </text>
      ))}

      {/* lines */}
      <path d={linePath(billTotals)} fill="none" stroke="#1f8ef1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={linePath(dormTotals)} fill="none" stroke="#e76f51" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* points */}
      {billTotals.map((v, i) => (
        <circle key={`b-${i}`} cx={x(i)} cy={y(v)} r={3.5} fill="#1f8ef1" />
      ))}
      {dormTotals.map((v, i) => (
        <circle key={`d-${i}`} cx={x(i)} cy={y(v)} r={3.5} fill="#e76f51" />
      ))}

      {/* legend */}
      <rect x={width - padding - 180} y={padding - 28} width={8} height={8} fill="#1f8ef1" />
      <text x={width - padding - 170} y={padding - 20} fontSize={12}>Tagihan Listrik</text>
      <rect x={width - padding - 70} y={padding - 28} width={8} height={8} fill="#e76f51" />
      <text x={width - padding - 58} y={padding - 20} fontSize={12}>Student Housing</text>
    </svg>
  );
}
