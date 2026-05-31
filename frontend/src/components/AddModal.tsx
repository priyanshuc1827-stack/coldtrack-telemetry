import React from 'react';
import type { NewShipmentForm, ThemeClasses } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddModalProps {
  newShipment: NewShipmentForm;
  setNewShipment: (v: NewShipmentForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  theme: ThemeClasses;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddModal: React.FC<AddModalProps> = ({
  newShipment,
  setNewShipment,
  onSubmit,
  onClose,
  theme,
}) => {
  const update = (field: keyof NewShipmentForm, value: string) =>
    setNewShipment({ ...newShipment, [field]: value });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`border w-full max-w-lg p-6 rounded-3xl shadow-2xl space-y-4 ${theme.cardThemeBg}`}>

        {/* ── Modal Header ──────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center border-b border-gray-300/10 pb-2">
          <h3 className="text-sm font-bold font-mono uppercase">Register Fresh Fleet Consignment</h3>
          <button
            onClick={onClose}
            className="text-xs opacity-60 hover:opacity-100"
            aria-label="Close modal"
          >
            ✕ Close
          </button>
        </div>

        {/* ── Shipment Form ─────────────────────────────────────────────────── */}
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4 text-xs font-mono">

          {/* Batch Label */}
          <div className="col-span-2 space-y-1">
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Batch Material Asset Label Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vaccine Batch Alpha"
              value={newShipment.item}
              onChange={(e) => update('item', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl focus:outline-none ${theme.inputThemeBg}`}
            />
          </div>

          {/* Carrier Partner */}
          <div className="space-y-1">
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Carrier Operator Partner
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Logistics Corp"
              value={newShipment.partner}
              onChange={(e) => update('partner', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Cargo Volume */}
          <div className="space-y-1">
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Cargo Volume Size
            </label>
            <input
              type="text"
              placeholder="e.g. 10,000 Units"
              value={newShipment.volume}
              onChange={(e) => update('volume', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Origin */}
          <div className="space-y-1">
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Origin Depot Node
            </label>
            <input
              type="text"
              placeholder="e.g. Anand Vault"
              value={newShipment.origin}
              onChange={(e) => update('origin', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Destination Node Point
            </label>
            <input
              type="text"
              placeholder="e.g. Gandhinagar Depot"
              value={newShipment.destination}
              onChange={(e) => update('destination', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Min Temp */}
          <div>
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Min Boundary Temp (°C)
            </label>
            <input
              type="number"
              value={newShipment.minTemp}
              onChange={(e) => update('minTemp', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Max Temp */}
          <div>
            <label className="font-bold opacity-60 text-[10px] uppercase">
              Max Boundary Temp (°C)
            </label>
            <input
              type="number"
              value={newShipment.maxTemp}
              onChange={(e) => update('maxTemp', e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${theme.inputThemeBg}`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="btn-commit-shipment"
            className="col-span-2 bg-[#107C41] text-white font-bold uppercase py-3 rounded-xl shadow-md tracking-wider transition-colors hover:bg-[#149B52]"
          >
            Commit Entry Ledger Line
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
