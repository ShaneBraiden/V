/** @fileoverview Static SVG keyboard for Finger Guide tab with hover tooltips */
import LiveKeyboard from './LiveKeyboard';

export default function FingerDiagram() {
  return (
    <div>
      <h3 className="text-lg font-heading text-white mb-2">Finger Assignment Guide</h3>
      <p className="text-sm text-gray-500 mb-4">Each key is color-coded by the finger that should press it. Hover for details.</p>
      <LiveKeyboard nextKey="" mode="finger" />
    </div>
  );
}
