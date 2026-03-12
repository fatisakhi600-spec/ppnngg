interface QualitySliderProps {
  quality: number;
  onChange: (quality: number) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

export function QualitySlider({ quality, onChange, bgColor, onBgColorChange }: QualitySliderProps) {
  const getQualityLabel = () => {
    if (quality >= 90) return { text: 'Highest', color: 'text-green-600' };
    if (quality >= 75) return { text: 'High', color: 'text-emerald-600' };
    if (quality >= 50) return { text: 'Medium', color: 'text-yellow-600' };
    if (quality >= 25) return { text: 'Low', color: 'text-orange-600' };
    return { text: 'Lowest', color: 'text-red-600' };
  };

  const label = getQualityLabel();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
        {/* Quality Control */}
        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">JPG Quality</label>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${label.color}`}>{label.text}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800">
                {quality}%
              </span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-red-300 via-yellow-300 to-green-300
              [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>

        {/* Background Color */}
        <div className="sm:w-48">
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Background Color
          </label>
          <p className="mb-2 text-[11px] text-slate-400">Replaces PNG transparency</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5"
              />
            </div>
            <div className="flex gap-1">
              {['#ffffff', '#000000', '#f0f0f0', '#eeeeee'].map((color) => (
                <button
                  key={color}
                  onClick={() => onBgColorChange(color)}
                  className={`h-8 w-8 rounded-lg border-2 transition-all ${
                    bgColor === color ? 'border-blue-500 scale-110' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
