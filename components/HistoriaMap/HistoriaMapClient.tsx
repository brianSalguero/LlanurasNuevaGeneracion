'use client';

import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/HistoriaMap/HistoriaMap"),
  { ssr: false }
);

export default function HistoriaMapClient() {
  return <Map />;
}