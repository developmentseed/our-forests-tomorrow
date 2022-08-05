import SPECIES from './species_detail.json'
import './SpeciesChoice.css'
const SPECIES_IDS = Object.keys(SPECIES)
const COLORS = SPECIES_IDS.map(
  () =>
    `rgb(${Math.floor(150 * Math.random())}, ${
      200 + Math.floor(50 * Math.random())
    }, ${Math.floor(150 * Math.random())})`
)
function SpeciesChoice() {
  console.log('lalla')
  return (
    <div className="speciesChoice">
      {SPECIES_IDS.map((speciesId, i) => (
        <div
          key={speciesId}
          className="speciesSection"
          style={{
            backgroundColor: COLORS[i],
          }}
        ></div>
      ))}
    </div>
  )
}

export default SpeciesChoice
