/** Roadmap layer section grouping technologies by layer */
export default function LayerSection({ layer, title, description, children }) {
  const layerColors = {
    1: 'border-neon-cyan/30 text-neon-cyan',
    2: 'border-neon-purple/30 text-neon-purple',
    3: 'border-neon-gold/30 text-neon-gold',
  };

  return (
    <div className="mb-8">
      <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${layerColors[layer] || ''}`}>
        <span className={`text-sm font-accent font-bold ${layerColors[layer]?.split(' ')[1] || ''}`}>
          LAYER {layer}
        </span>
        <h2 className="text-lg font-heading font-semibold text-gray-200">{title}</h2>
      </div>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}
