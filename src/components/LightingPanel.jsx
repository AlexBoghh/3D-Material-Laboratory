import { useState } from 'react'
import { getLightingPresets } from '../config/lightingPresets'

function LightingPanel({ onLightingChange, currentLighting, lightingPreviewMode, onLightingPreviewModeChange, useHDRI, onHDRIToggle }) {
  const presets = getLightingPresets()
  const [customSettings, setCustomSettings] = useState({
    intensity: currentLighting?.intensity || 1.0,
    rotationY: currentLighting?.rotationY || 45,
    shadows: currentLighting?.shadows !== false
  })

  const handlePresetChange = (preset) => {
    setCustomSettings({
      intensity: preset.intensity,
      rotationY: preset.rotationY,
      shadows: preset.shadows
    })
    onLightingChange(preset)
  }

  const handleCustomChange = (key, value) => {
    const newSettings = { ...customSettings, [key]: value }
    setCustomSettings(newSettings)
    
    const customLighting = {
      ...currentLighting,
      ...newSettings,
      name: 'Custom',
      key: 'custom'
    }
    onLightingChange(customLighting)
  }

  return (
    <div className="lighting-panel-minimal">
      <h3 className="lighting-panel-title">Lighting</h3>
      
      {/* Lighting Presets */}
      <div className="lighting-presets">
        <h4 className="lighting-section-title">Presets</h4>
        <div className="presets-grid-minimal">
          {presets.map((preset) => {
            const isSelected = currentLighting?.key === preset.key
            
            return (
              <button
                key={preset.key}
                className={`preset-card-minimal ${isSelected ? 'selected' : ''}`}
                onClick={() => handlePresetChange(preset)}
                title={preset.description}
              >
                <div 
                  className="preset-icon-minimal"
                  style={{ background: preset.gradient }}
                />
                <span className="preset-name-minimal">{preset.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Controls */}
      <div className="lighting-controls">
        <h4 className="lighting-section-title">Controls</h4>
        
        {/* Intensity Slider */}
        <div className="control-group-minimal">
          <label className="control-label-minimal">
            Intensity: {customSettings.intensity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={customSettings.intensity}
            onChange={(e) => handleCustomChange('intensity', parseFloat(e.target.value))}
            className="slider-minimal"
          />
        </div>

        {/* Rotation Angle */}
        <div className="control-group-minimal">
          <label className="control-label-minimal">
            Rotation: {customSettings.rotationY}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={customSettings.rotationY}
            onChange={(e) => handleCustomChange('rotationY', parseInt(e.target.value))}
            className="slider-minimal"
          />
        </div>

        {/* Environment Info Display */}
        <div className="control-group-minimal">
          <label className="control-label-minimal">Environment</label>
          <div className="environment-info" style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'rgba(0, 0, 0, 0.7)',
            fontStyle: 'italic'
          }}>
            {useHDRI ? 'Studio HDRI - Professional lighting' : 'No HDRI environment'}
          </div>
        </div>

        {/* Shadow Toggle */}
        <div className="control-group-minimal">
          <label className="toggle-label-minimal">
            <input
              type="checkbox"
              checked={customSettings.shadows}
              onChange={(e) => handleCustomChange('shadows', e.target.checked)}
              className="toggle-minimal"
            />
            <span className="toggle-text-minimal">Shadows</span>
          </label>
        </div>

        {/* HDRI Environment Toggle */}
        <div className="control-group-minimal">
          <label className="toggle-label-minimal">
            <input
              type="checkbox"
              checked={useHDRI}
              onChange={(e) => onHDRIToggle(e.target.checked)}
              className="toggle-minimal"
            />
            <span className="toggle-text-minimal">HDRI Environment</span>
          </label>
          <p className="control-helper-minimal">Realistic reflections & lighting</p>
        </div>

        {/* Lighting Preview Mode Toggle */}
        <div className="control-group-minimal">
          <label className="toggle-label-minimal">
            <input
              type="checkbox"
              checked={lightingPreviewMode}
              onChange={(e) => onLightingPreviewModeChange(e.target.checked)}
              className="toggle-minimal"
            />
            <span className="toggle-text-minimal">Dark Background Mode</span>
          </label>
          <small style={{ 
            fontSize: '10px', 
            color: 'rgba(0, 0, 0, 0.5)', 
            marginTop: '4px', 
            display: 'block',
            fontStyle: 'italic'
          }}>
            Darkens background for better lighting visibility
          </small>
        </div>
      </div>
    </div>
  )
}

export default LightingPanel