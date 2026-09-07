"use client";

import { useState } from "react";
import { createOdemeBildirimi } from "@/app/actions/odeme";

const DEFAULT_LINES = [
  { tur: "KDV", tutar: "" },
  { tur: "Muhtasar + SGK", tutar: "" },
  { tur: "SGK", tutar: "" },
  { tur: "Muhasebe ücreti", tutar: "" },
  { tur: "Bağ-Kur", tutar: "" },
];

export function OdemeForm({
  firmalar,
}: {
  firmalar: { id: string; unvan: string }[];
}) {
  const [lines, setLines] = useState(DEFAULT_LINES);

  return (
    <form action={createOdemeBildirimi} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Firma</label>
          <select name="firmaId" required className="input">
            <option value="">Seçin</option>
            {firmalar.map((f) => (
              <option key={f.id} value={f.id}>
                {f.unvan}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Dönem</label>
          <input name="donem" required placeholder="2026/08" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Not</label>
        <input name="not" className="input" placeholder="Opsiyonel not" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Ödeme kalemleri</p>
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input
              name="tur"
              value={line.tur}
              onChange={(e) => {
                const next = [...lines];
                next[i] = { ...next[i], tur: e.target.value };
                setLines(next);
              }}
              className="input"
              placeholder="Tür"
              required
            />
            <input
              name="tutar"
              type="number"
              step="0.01"
              min="0"
              value={line.tutar}
              onChange={(e) => {
                const next = [...lines];
                next[i] = { ...next[i], tutar: e.target.value };
                setLines(next);
              }}
              className="input"
              placeholder="Tutar"
            />
            <input name="kalemSonTarih" type="date" className="input" />
            <input name="kalemNot" className="input" placeholder="Kalem notu" />
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary !py-1.5 !text-xs"
          onClick={() => setLines([...lines, { tur: "", tutar: "" }])}
        >
          + Satır ekle
        </button>
      </div>

      <button type="submit" className="btn-primary">
        Bildirim oluştur
      </button>
    </form>
  );
}
