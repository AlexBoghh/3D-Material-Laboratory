import { getAllMaterials } from '../config/materialPresets'

function MaterialPanel({ onMaterialChange, currentMaterial }) {
  const materials = getAllMaterials()
  
  return (
    <div className="material-panel-minimal">
      <h3 className="material-panel-title">Materials</h3>
      
      {/* Material Grid */}
      <div className="materials-grid-minimal">
        {materials.map((material) => {
          const isSelected = currentMaterial?.name === material.name
          
          return (
            <button
              key={material.key}
              className={`material-card-minimal ${isSelected ? 'selected' : ''}`}
              onClick={() => onMaterialChange(material)}
              title={material.name}
            >
              <div 
                className="material-preview-minimal"
                style={{
                  backgroundColor: material.color,
                }}
              />
              <span className="material-name-minimal">{material.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MaterialPanel