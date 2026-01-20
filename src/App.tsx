import { useEffect, useRef, useState } from 'react'
import { Box, Button } from '@mui/material'
import * as d3 from 'd3'
// @ts-ignore
import { geoGinzburg9 } from 'd3-geo-projection'
import Legend from './Legend'

interface CountryProperties {
  NAME: string
  NAME_FR: string
  [key: string]: any
}

interface GeoFeature {
  type: string
  properties: CountryProperties
  geometry: any
}

interface GeoJSON {
  type: string
  features: GeoFeature[]
}

function App() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const showStartPromptRef = useRef(true)

  const [geojsonData, setGeojsonData] = useState<GeoJSON | null>(null)
  const [world2025Data, setWorld2025Data] = useState<GeoJSON | null>(null)
  const [frontiere1939Data, setFrontiere1939Data] = useState<GeoJSON | null>(null)
  const [frontiereActuelleData, setFrontiereActuelleData] = useState<GeoJSON | null>(null)
  const [frontiereTechnatData, setFrontiereTechnatData] = useState<GeoJSON | null>(null)
  const [reseauBaseData, setReseauBaseData] = useState<GeoJSON | null>(null)
  const [basesMilitaireTechnatData, setBasesMilitaireTechnatData] = useState<GeoJSON | null>(null)
  const [technatData, setTechnatData] = useState<GeoJSON | null>(null)
  const [trumpData, setTrumpData] = useState<GeoJSON | null>(null)
  const [golfMexiqueData, setGolfMexiqueData] = useState<GeoJSON | null>(null)
  const [venezuelaData, setVenezuelaData] = useState<GeoJSON | null>(null)
  const [aireEcoData, setAireEcoData] = useState<GeoJSON | null>(null)
  const [aireEcoCatData, setAireEcoCatData] = useState<GeoJSON | null>(null)
  const [basesUsa2025Data, setBasesUsa2025Data] = useState<GeoJSON | null>(null)

  const [showTechnat, setShowTechnat] = useState(false)
  const [showTrumpGolf, setShowTrumpGolf] = useState(false)
  const [technatAnimated, setTechnatAnimated] = useState(false)
  const [trumpGolfAnimated, setTrumpGolfAnimated] = useState(false)
  const [showStartPrompt, setShowStartPrompt] = useState(true)

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetch('/world.geojson').then(r => r.json()).then(setGeojsonData)
    fetch('/world_2025.geojson').then(r => r.json()).then(setWorld2025Data)
    fetch('/frontiere_1939.geojson').then(r => r.json()).then(setFrontiere1939Data)
    fetch('/frontiere_actuelle.geojson').then(r => r.json()).then(setFrontiereActuelleData)
    fetch('/frontiere_technat.geojson').then(r => r.json()).then(setFrontiereTechnatData)
    fetch('/reseau_base.geojson').then(r => r.json()).then(setReseauBaseData)
    fetch('/bases_militaire_technat.geojson').then(r => r.json()).then(setBasesMilitaireTechnatData)
    fetch('/technat.geojson').then(r => r.json()).then(setTechnatData)
    fetch('/aire_eco.geojson').then(r => r.json()).then(setAireEcoData)
    fetch('/aire_eco_cat.geojson').then(r => r.json()).then(setAireEcoCatData)

    Promise.all([
      fetch('/trump.geojson').then(r => r.json()),
      fetch('/golf_mexique.geojson').then(r => r.json()),
      fetch('/venezuela.geojson').then(r => r.json()),
      fetch('/bases_USA_2025.geojson').then(r => r.json())
    ]).then(([t, g, v, b]) => {
      setTrumpData(t)
      setGolfMexiqueData(g)
      setVenezuelaData(v)
      setBasesUsa2025Data(b)
    })
  }, [])

  // ======================
  // MAP RENDER
  // ======================
  useEffect(() => {
    if (!geojsonData || !svgRef.current || !containerRef.current) return

    const container = containerRef.current

    const renderMap = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return

      d3.select(svgRef.current).selectAll('*').remove()

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)

      // Choix du fond selon l'étape
      let baseGeojson = geojsonData
      if (showTechnat && showTrumpGolf && world2025Data) {
        // Étape 3 : fond = world_2025.geojson
        baseGeojson = world2025Data
      }
      const filteredFeatures = baseGeojson.features.filter(
        f => f.properties.NAME !== 'Antarctica'
      )
      const filteredGeoJSON = {
        type: 'FeatureCollection',
        features: filteredFeatures
      }

      const projection = geoGinzburg9()
        .fitSize(
          [width, height],
          showTechnat && technatData ? technatData as any : filteredGeoJSON as any
        )

      const path = d3.geoPath().projection(projection)

      // ======================
      // DÉFINIR LE PATTERN DE HACHURES ROUGES FIXE
      // ======================
      const defs = svg.append('defs')
      const pattern = defs.append('pattern')
        .attr('id', 'red-hatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 5) // réduit l'écart horizontal
        .attr('height', 5) // réduit l'écart vertical
        .attr('patternTransform', 'rotate(45)')
      
      pattern.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 7)
        .attr('stroke', '#DD203C')
        .attr('stroke-width', 3)

      // ======================
      // BASE MAP
      // ======================
      const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
      const tooltipCountry = d3.select(container)
        .selectAll('.country-tooltip')
        .data([null])
        .join('div')
        .attr('class', 'country-tooltip')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('background', 'rgba(255,255,255,0.97)')
        .style('color', '#222')
        .style('border', '1.5px solid #999')
        .style('border-radius', '2px')
        .style('padding', '2px 6px')
        .style('font-family', '"Publico Text Web Regular", serif')
        .style('font-size', tooltipFontSize + 'px')
        .style('box-shadow', '0 2px 8px rgba(0,0,0,0.10)')
        .style('z-index', 3000)
        .style('opacity', 0)

      svg.append('g')
        .attr('class', 'base-countries')
        .selectAll('path')
        .data(filteredFeatures)
        .join('path')
        .attr('d', path as any)
        .attr('fill', '#e0dcdc')
        .attr('stroke', 'none')
      
      // Note: Le label Canal du Panama est maintenant rendu après les groupes Trump/Venezuela (voir plus bas)
      
      // Gestionnaire global de tooltip pour les étapes 2 et 3
      if (showTechnat) {
        svg.on('mousemove.country-tooltip', function(event) {
          const [mx, my] = d3.pointer(event, this)
          const coords = projection.invert ? projection.invert([mx, my]) : null
          
          if (coords) {
            // Trouver le pays sous la souris
            const country = filteredFeatures.find(f => {
              if (f.geometry.type === 'Polygon') {
                return d3.geoContains(f as any, coords)
              } else if (f.geometry.type === 'MultiPolygon') {
                return d3.geoContains(f as any, coords)
              }
              return false
            })
            
            if (country) {
              const tooltipNode = tooltipCountry.node() as HTMLDivElement
              if (!tooltipNode) return
              tooltipCountry.text(country.properties.NAME_FR || country.properties.NAME || '')
              const margin = 10
              const tooltipWidth = tooltipNode.offsetWidth
              const tooltipHeight = tooltipNode.offsetHeight
              let left = event.clientX + margin
              let top = event.clientY + margin
              if (left + tooltipWidth > window.innerWidth - margin)
                left = event.clientX - tooltipWidth - margin
              if (top + tooltipHeight > window.innerHeight - margin)
                top = event.clientY - tooltipHeight - margin
              tooltipCountry
                .style('left', `${left}px`)
                .style('top', `${top}px`)
                .style('opacity', 1)
            } else {
              tooltipCountry.style('opacity', 0)
            }
          }
        })
        
        svg.on('mouseleave.country-tooltip', function() {
          tooltipCountry.style('opacity', 0)
        })
      } else {
        svg.on('mousemove.country-tooltip', null)
        svg.on('mouseleave.country-tooltip', null)
        tooltipCountry.style('opacity', 0)
      }

      // ======================
      // RÉSEAU BASE (couche la plus basse pour étapes 2 et 3)
      // ======================
      if (showTechnat && reseauBaseData) {
        svg.append('g')
          .attr('class', 'reseau-base')
          .selectAll('path')
          .data(reseauBaseData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', showTrumpGolf ? '#bfbfbf' : '#bfbfbf')
          .attr('stroke-opacity', showTrumpGolf ? 0.4 : 1)
          .attr('stroke-width', 2)
          .attr('pointer-events', 'none')
      }

      // ======================
      // FRONTIÈRES TECHNAT (couche la plus basse pour étapes 2 et 3)
      // ======================
      if (showTechnat && frontiereTechnatData) {
        svg.append('g')
          .attr('class', 'frontieres-technat')
          .selectAll('path')
          .data(frontiereTechnatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', showTrumpGolf ? '#DD203C' : '#DD203C')
          .attr('stroke-opacity', showTrumpGolf ? 0.2 : 1)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '5,4')
          .attr('pointer-events', 'none')
      }

      // ======================
      // TECHNAT
      // ======================
      if (showTechnat && technatData) {
        const g = svg.append('g')
          .style('opacity', technatAnimated ? 1 : 0)

        g.selectAll('path')
          .data(technatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', showTrumpGolf ? '#DD203C' : '#DD203C')
          .attr('opacity', showTrumpGolf ? 0.2 : 0.8)

        if (!technatAnimated) {
          g.transition()
            .delay(400)
            .duration(600)
            .style('opacity', 1)
            .on('end', () => setTechnatAnimated(true))
        }
      }

      // ======================
      // TRUMP + VENEZUELA (ÉTAPE 3)
      // ======================
      if (showTrumpGolf && trumpData && venezuelaData) {
        const trump = svg.append('g').style('opacity', trumpGolfAnimated ? 1 : 0)
        trump.selectAll('path')
          .data(trumpData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', '#DD203C')
          .attr('fill-opacity', 0.8)
          .attr('stroke', d => 
            d.properties.NAME === 'Canal de Panama' ? '#DD203C' : 'none'
          )
          .attr('stroke-width', d => 
            d.properties.NAME === 'Canal de Panama' ? 15 : 0
          )

        const venezuela = svg.append('g').style('opacity', trumpGolfAnimated ? 1 : 0)
        venezuela.selectAll('path')
          .data(venezuelaData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'url(#red-hatch)')
          .attr('stroke', 'none')

        // Affichage des bases USA 2025
        if (basesUsa2025Data) {
          const baseRadius = width < 500 ? 4 : width < 900 ? 5 : 7
          svg.append('g')
            .attr('class', 'bases-usa-2025')
            .selectAll('circle')
            .data(basesUsa2025Data.features)
            .join('circle')
            .attr('cx', d => {
              const coords = projection(d.geometry.coordinates as [number, number])
              return coords ? coords[0] : 0
            })
            .attr('cy', d => {
              const coords = projection(d.geometry.coordinates as [number, number])
              return coords ? coords[1] : 0
            })
            .attr('r', baseRadius)
            .attr('fill', '#0052cc')
            .attr('fill-opacity', 0.85)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
        }
        if (!trumpGolfAnimated) {
          trump.transition().delay(0).duration(500).style('opacity', 1)
          venezuela.transition().delay(100).duration(500).style('opacity', 1)
            .on('end', () => setTrumpGolfAnimated(true))
        }
      }

      // ======================
      // CANAL DE PANAMA LINE AND LABEL (ÉTAPE 3)
      // Placé après les groupes Trump/Venezuela pour être au-dessus dans l'ordre de rendu
      // ======================
      // Note: Le code du label Canal du Panama a été déplacé plus bas, après les frontières et bases

      // ======================
      // FRONTIÈRES (1939 ou actuelles avec transition)
      // Affichées au-dessus de toutes les autres couches
      // ======================
      // AIRE ECO CAT (uniquement étape 1) - EN DESSOUS DES FRONTIÈRES
      if (!showTechnat && aireEcoCatData) {
        const aireEcoCatGroup = svg.append('g')
          .attr('class', 'aire-eco-cat')
          .style('opacity', 0)
        aireEcoCatGroup
          .selectAll('path')
          .data(aireEcoCatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', d => d.properties.cat === 1 ? '#6d000d' : '#DD203C') // cat 2 = #DD203C
          .attr('fill-opacity', 0.8)
          .attr('stroke', 'None')
          .attr('stroke-width', 1.5)
          .attr('pointer-events', 'none')
        aireEcoCatGroup.transition()
          .duration(700)
          .style('opacity', 1)
      }

      // Frontières 1939 (visibles étapes 1 et 2)
      const borderStrokeWidth = width < 600 ? 0.8 : width < 900 ? 1 : 1.2
      if (frontiere1939Data) {
        const g1939 = svg.append('g')
          .attr('class', 'frontieres-1939')
          .style('opacity', showTrumpGolf ? 0 : 1)

        g1939.selectAll('path')
          .data(frontiere1939Data.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', borderStrokeWidth)
          .attr('pointer-events', 'none')
      }

      // ======================
      // AIRE ECO (uniquement étape 1) - AU-DESSUS DES FRONTIÈRES
      // ======================
      if (!showTechnat && aireEcoData) {
        const aireEcoGroup = svg.append('g')
          .attr('class', 'aire-eco')
          .style('opacity', 0)
        aireEcoGroup
          .selectAll('path')
          .data(aireEcoData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'None')
          .attr('fill-opacity', 0.6)
          .attr('stroke', '#ba0000')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '8 4')
          .attr('stroke-dashoffset', 0)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('pointer-events', 'none')
          .style('shape-rendering', 'geometricPrecision')
        aireEcoGroup.transition()
          .duration(700)
          .style('opacity', 1)
      }

      // Frontières actuelles (visibles étape 3)
      if (showTrumpGolf && frontiereActuelleData) {
        const gActuelle = svg.append('g')
          .attr('class', 'frontieres-actuelles')
          .style('opacity', trumpGolfAnimated ? 1 : 0)

        gActuelle.selectAll('path')
          .data(frontiereActuelleData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', borderStrokeWidth)
          .attr('pointer-events', 'none')

        // Transition fluide des frontières
        if (!trumpGolfAnimated) {
          // Faire disparaître les frontières 1939
          svg.select('.frontieres-1939')
            .transition()
            .duration(600)
            .style('opacity', 0)

          // Faire apparaître les frontières actuelles
          gActuelle.transition()
            .delay(0)
            .duration(600)
            .style('opacity', 1)
        }
      }

      // ======================
      // BASES MILITAIRES TECHNAT (couche ponctuelle au-dessus de tout)
      // ======================
      if (showTechnat && basesMilitaireTechnatData) {
        // Rayon responsive selon la largeur de la fenêtre
        const baseRadius = width < 500 ? 4 : width < 900 ? 5 : 7
        // Font size responsive pour le tooltip
        const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
        const tooltip = d3.select(container)
          .selectAll('.military-tooltip')
          .data([null])
          .join('div')
          .attr('class', 'military-tooltip')
          .style('position', 'fixed')
          .style('pointer-events', 'none')
          .style('background', 'rgba(255,255,255,0.97)')
          .style('color', '#222')
          .style('border', '1.5px solid #DD203C')
          .style('border-radius', '2px')
          .style('padding', '2px 6px')
          .style('font-family', '"Publico Text Web Regular", serif')
          .style('font-size', tooltipFontSize + 'px')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.10)')
          .style('z-index', 3000)
          .style('opacity', 0)

        svg.append('g')
          .attr('class', 'bases-militaires-technat')
          .selectAll('circle')
          .data(basesMilitaireTechnatData.features)
          .join('circle')
          .attr('cx', d => {
            const coords = projection(d.geometry.coordinates as [number, number])
            return coords ? coords[0] : 0
          })
          .attr('cy', d => {
            const coords = projection(d.geometry.coordinates as [number, number])
            return coords ? coords[1] : 0
          })
          .attr('r', baseRadius)
          .attr('fill', '#DD203C')
          .attr('fill-opacity', showTrumpGolf ? 0.25 : 1)
          .attr('stroke', '#ffffff')
          .attr('stroke-opacity', showTrumpGolf ? 0.25 : 1)
          .attr('stroke-width', 2)
          .on('mousemove', function(event, d) {
            const tooltipNode = tooltip.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltip.text(`Base ${d.properties.NAME_CITY || 'militaire'}`)
            const margin = 10
            const tooltipWidth = tooltipNode.offsetWidth
            const tooltipHeight = tooltipNode.offsetHeight
            let left = event.clientX + margin
            let top = event.clientY + margin
            if (left + tooltipWidth > window.innerWidth - margin)
              left = event.clientX - tooltipWidth - margin
            if (top + tooltipHeight > window.innerHeight - margin)
              top = event.clientY - tooltipHeight - margin
            tooltip
              .style('left', `${left}px`)
              .style('top', `${top}px`)
              .style('opacity', 1)
          })
          .on('mouseleave', function() {
            tooltip.style('opacity', 0)
          })
          .on('mouseenter', function(event, d) {
            const tooltipNode = tooltip.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltip.text(`Base ${d.properties.NAME_CITY || 'militaire'}`)
            const margin = 10
            const tooltipWidth = tooltipNode.offsetWidth
            const tooltipHeight = tooltipNode.offsetHeight
            let left = event.clientX + margin
            let top = event.clientY + margin
            if (left + tooltipWidth > window.innerWidth - margin)
              left = event.clientX - tooltipWidth - margin
            if (top + tooltipHeight > window.innerHeight - margin)
              top = event.clientY - tooltipHeight - margin
            tooltip
              .style('left', `${left}px`)
              .style('top', `${top}px`)
              .style('opacity', 1)
          })

        // Affichage du tooltip à proximité (zone de tolérance)
        svg.on('mousemove.bases-tooltip', function(event) {
          const [mx, my] = d3.pointer(event, this)
          const tooltipNode = tooltip.node() as HTMLDivElement
          if (!tooltipNode) return
          let found = false
          basesMilitaireTechnatData.features.forEach(d => {
            const coords = projection(d.geometry.coordinates as [number, number])
            if (coords) {
              const dx = coords[0] - mx
              const dy = coords[1] - my
              const dist = Math.sqrt(dx*dx + dy*dy)
              if (dist < baseRadius + 16) {
                tooltip.text(`Base ${d.properties.NAME_CITY || 'militaire'}`)
                const margin = 10
                const tooltipWidth = tooltipNode.offsetWidth
                const tooltipHeight = tooltipNode.offsetHeight
                let left = event.clientX + margin
                let top = event.clientY + margin
                if (left + tooltipWidth > window.innerWidth - margin)
                  left = event.clientX - tooltipWidth - margin
                if (top + tooltipHeight > window.innerHeight - margin)
                  top = event.clientY - tooltipHeight - margin
                tooltip
                  .style('left', `${left}px`)
                  .style('top', `${top}px`)
                  .style('opacity', 1)
                found = true
              }
            }
          })
          if (!found) {
            tooltip.style('opacity', 0)
          }
        })
        svg.on('mouseleave.bases-tooltip', function() {
          tooltip.style('opacity', 0)
        })
      }

      // ======================
      // BASES USA 2025 (au-dessus des bases militaires technat)
      // ======================
      if (showTrumpGolf && basesUsa2025Data) {
        const baseRadius = width < 500 ? 4 : width < 900 ? 5 : 7
        const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
        const tooltipUsa = d3.select(container)
          .selectAll('.usa-tooltip')
          .data([null])
          .join('div')
          .attr('class', 'usa-tooltip')
          .style('position', 'fixed')
          .style('pointer-events', 'none')
          .style('background', 'rgba(255,255,255,0.97)')
          .style('color', '#222')
          .style('border', '1.5px solid #4991d9')
          .style('border-radius', '2px')
          .style('padding', '2px 6px')
          .style('font-family', '"Publico Text Web Regular", serif')
          .style('font-size', tooltipFontSize + 'px')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.10)')
          .style('z-index', 3000)
          .style('opacity', 0)

        svg.append('g')
          .attr('class', 'bases-usa-2025')
          .selectAll('circle')
          .data(basesUsa2025Data.features)
          .join('circle')
          .attr('cx', d => {
            const coords = projection(d.geometry.coordinates as [number, number])
            return coords ? coords[0] : 0
          })
          .attr('cy', d => {
            const coords = projection(d.geometry.coordinates as [number, number])
            return coords ? coords[1] : 0
          })
          .attr('r', baseRadius)
          .attr('fill', '#4991d9')
          .attr('fill-opacity', 0.85)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .on('mousemove', function(event, d) {
            const tooltipNode = tooltipUsa.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltipUsa.text(`Base ${d.properties.NAME_CITY || 'USA'}`)
            const margin = 10
            const tooltipWidth = tooltipNode.offsetWidth
            const tooltipHeight = tooltipNode.offsetHeight
            let left = event.clientX + margin
            let top = event.clientY + margin
            if (left + tooltipWidth > window.innerWidth - margin)
              left = event.clientX - tooltipWidth - margin
            if (top + tooltipHeight > window.innerHeight - margin)
              top = event.clientY - tooltipHeight - margin
            tooltipUsa
              .style('left', `${left}px`)
              .style('top', `${top}px`)
              .style('opacity', 1)
          })
          .on('mouseleave', function() {
            tooltipUsa.style('opacity', 0)
          })
          .on('mouseenter', function(event, d) {
            const tooltipNode = tooltipUsa.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltipUsa.text(`Base ${d.properties.NAME_CITY || 'USA'}`)
            const margin = 10
            const tooltipWidth = tooltipNode.offsetWidth
            const tooltipHeight = tooltipNode.offsetHeight
            let left = event.clientX + margin
            let top = event.clientY + margin
            if (left + tooltipWidth > window.innerWidth - margin)
              left = event.clientX - tooltipWidth - margin
            if (top + tooltipHeight > window.innerHeight - margin)
              top = event.clientY - tooltipHeight - margin
            tooltipUsa
              .style('left', `${left}px`)
              .style('top', `${top}px`)
              .style('opacity', 1)
          })
      }

      // ======================
      // CANAL DE PANAMA LABEL - AU-DESSUS DE TOUT
      // ======================
      if (showTrumpGolf && trumpData && venezuelaData) {
        const canalFeature = trumpData.features.find(f => f.properties.NAME === 'Canal de Panama')
        if (canalFeature) {
          const canalCentroid = d3.geoCentroid(canalFeature as any)
          const canalCoords = projection(canalCentroid)
          if (canalCoords) {
            // Décaler le label en bas du canal
            const labelOffsetY = 45; // valeur positive pour aller vers le bas
            // Dessiner le trait du canal vers le label en bas
            svg.append('g')
              .attr('class', 'canal-panama-line')
              .append('line')
              .attr('x1', canalCoords[0])
              .attr('y1', canalCoords[1])
              .attr('x2', canalCoords[0])
              .attr('y2', canalCoords[1] + labelOffsetY - 10)
              .attr('stroke', '#DD203C')
              .attr('stroke-width', 2.5)
            // Label avec double contour blanc positionné en bas du canal
            const labelFontSize = width < 600 ? 10 : width < 900 ? 11 : 16
            const labelGroup = svg.append('g')
              .attr('class', 'canal-panama-label')
            // Contour blanc externe
            labelGroup.append('text')
              .attr('x', canalCoords[0])
              .attr('y', canalCoords[1] + labelOffsetY)
              .text('Canal du Panama')
              .attr('font-family', '"Publico Text Web Regular", serif')
              .attr('font-size', labelFontSize)
              .attr('fill', 'none')
              .attr('font-weight', 'bold')
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
              .attr('stroke', 'white')
              .attr('stroke-width', 4)
            
            // Texte rouge au-dessus
            labelGroup.append('text')
              .attr('x', canalCoords[0])
              .attr('y', canalCoords[1] + labelOffsetY)
              .text('Canal du Panama')
              .attr('font-family', '"Publico Text Web Regular", serif')
              .attr('font-size', labelFontSize)
              .attr('fill', '#DD203C')
              .attr('font-weight', 'bold')
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
          }
        }
      }

      // ======================
      // NOMS DES OCÉANS
      // ======================
      const oceans = [
        { name: 'Océan\nPacifique', coords: [-140, 10] },
        { name: 'Océan\nAtlantique', coords: [-60, 25] },
        { name: 'Océan\nIndien', coords: [75, -20] },
        { name: 'Océan\nArctique', coords: [-5, 80] }
      ]

      const oceanFontSize = width < 600 ? 10 : width < 900 ? 12 : 16

      const oceanGroup = svg.append('g')
        .attr('class', 'ocean-labels')
        .style('opacity', 1)

      oceans.forEach(ocean => {
        const coords = projection(ocean.coords as [number, number])
        if (coords) {
          const lines = ocean.name.split('\n')
          // Contour blanc (double stroke)
          lines.forEach((line, i) => {
            oceanGroup.append('text')
              .attr('class', `ocean-${ocean.coords[0]}-${ocean.coords[1]}-${i}`)
              .attr('x', coords[0])
              .attr('y', coords[1] + i * (oceanFontSize + 2))
              .attr('text-anchor', 'start')
              .attr('font-family', '"Publico Text Web Regular", serif')
              .attr('font-size', oceanFontSize)
              .attr('font-style', 'italic')
              .attr('fill', 'none')
              .attr('stroke', '#ffffff')
              .attr('stroke-width', 7)
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('opacity', 0.9)
              .text(line)
          })
          // Texte gris principal
          lines.forEach((line, i) => {
            oceanGroup.append('text')
              .attr('class', `ocean-${ocean.coords[0]}-${ocean.coords[1]}-${i}`)
              .attr('x', coords[0])
              .attr('y', coords[1] + i * (oceanFontSize + 2))
              .attr('text-anchor', 'start')
              .attr('font-family', '"Publico Text Web Regular", serif')
              .attr('font-size', oceanFontSize)
              .attr('font-style', 'italic')
              .attr('fill', '#999999')
              .attr('opacity', 0.7)
              .text(line)
          })
        }
      })

      // ======================
      // CLICK LOGIC
      // ======================
      svg.on('click', () => {
        // Ne pas déclencher de transition si le prompt est encore visible
        if (showStartPromptRef.current) {
          return
        }
        
        if (!showTechnat && technatData) {
          setShowTechnat(true)

          const start = geoGinzburg9().fitSize([width, height], filteredGeoJSON as any)
          const end = geoGinzburg9().fitSize([width, height], technatData as any)

          const scaleI = d3.interpolate(start.scale(), end.scale())
          const translateI = d3.interpolate(start.translate(), end.translate())

          svg.transition()
            .duration(1800)
            .ease(d3.easeCubicOut)
            .tween('zoom', () => (t: number) => {
              // Appliquer un easing personnalisé pour un effet plus cinématique
              const smoothT = t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2
              
              const p = geoGinzburg9()
                .scale(scaleI(smoothT))
                .translate(translateI(smoothT))

              const tempPath = d3.geoPath().projection(p)
              svg.selectAll<SVGPathElement, any>('path')
                .attr('d', tempPath as any)
              
              // Mettre à jour les positions des cercles (bases militaires) pendant le zoom
              svg.selectAll<SVGCircleElement, GeoFeature>('circle')
                .attr('cx', d => {
                  const coords = p(d.geometry.coordinates as [number, number])
                  return coords ? coords[0] : 0
                })
                .attr('cy', d => {
                  const coords = p(d.geometry.coordinates as [number, number])
                  return coords ? coords[1] : 0
                })
              
              // Mettre à jour les positions des textes des océans pendant le zoom
              oceans.forEach(ocean => {
                const coords = p(ocean.coords as [number, number])
                if (coords) {
                  const lines = ocean.name.split('\n')
                  lines.forEach((_, i) => {
                    svg.selectAll(`.ocean-${ocean.coords[0]}-${ocean.coords[1]}-${i}`)
                      .attr('x', coords[0])
                      .attr('y', coords[1] + i * (oceanFontSize + 2))
                  })
                }
              })
            })

        } else if (showTechnat && !showTrumpGolf) {
          setShowTrumpGolf(true)
        }
      })
    }

    renderMap()
    window.addEventListener('resize', renderMap)
    return () => window.removeEventListener('resize', renderMap)

  }, [
    geojsonData,
    frontiere1939Data,
    frontiereActuelleData,
    frontiereTechnatData,
    reseauBaseData,
    basesMilitaireTechnatData,
    technatData,
    trumpData,
    golfMexiqueData,
    aireEcoData,
    aireEcoCatData,
    showTechnat,
    showTrumpGolf,
    technatAnimated,
    trumpGolfAnimated
  ])

  // Réinitialiser l'invite à chaque chargement ou rechargement de la page
  useEffect(() => {
    setShowStartPrompt(true)
  }, [])

  // Fonction pour revenir à l'étape précédente
  const handleBack = () => {
    if (showTrumpGolf) {
      setShowTrumpGolf(false)
      setTrumpGolfAnimated(false)
    } else if (showTechnat) {
      setShowTechnat(false)
      setTechnatAnimated(false)
    }
  }

  return (
    <Box 
      onClick={() => {
        if (showStartPrompt) {
          setShowStartPrompt(false)
          showStartPromptRef.current = false
        }
      }}
      sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        cursor: showStartPrompt ? 'pointer' : 'default'
      }}
    >
      {/* Prompt de démarrage avec effet respirant */}
      {showStartPrompt && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '50%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            bgcolor: 'rgba(255,255,255,0.95)',
            px: 3,
            py: 1.5,
            borderRadius: 10,
            boxShadow: 3,
            fontSize: '13px',
            color: '#1b1b1b !important',
            fontFamily: '"Publico Text Web Regular", serif',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.8 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.8 },
            },
            zIndex: 2000,
            textAlign: 'center',
          }}
        >
          Tapez sur l'écran pour commencer l'exploration
        </Box>
      )}
      
      <Box sx={{ 
        width: '100%', 
        minHeight: '7%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        px: 1.2,
        pb: 1,
        pt: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        color: 'black',
        gap: 0.5,
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ 
            fontFamily: '"Sanomat Web Medium Regular"',
            fontSize: { xs: '14px', md: '23px' },
            fontWeight: 'bold'
          }}>
            {!showTechnat 
              ? 'Economies de grands espaces (Großraumwirtschaften)' 
              : !showTrumpGolf 
              ? 'Le Technat' 
              : 'Les revendications des États-Unis'
            }
          </Box>

          <Box sx={{ 
            fontFamily: '"Publico Text Web Regular"',
            fontSize: { xs: '12px', md: '19px' }
          }}>
            {!showTechnat 
              ? 'Ferdinand Fried, 1940' 
              : !showTrumpGolf 
              ? 'Howard Scott, 1940' 
              : 'Donald Trump, 2025-2026'
            }
          </Box>
        </Box>
      </Box>
      <Box ref={containerRef} sx={{ width: '100%', flexGrow: 1, minHeight: 0, position: 'relative' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        
        {/* Source en bas au centre */}
        {!showStartPrompt && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#666',
              fontFamily: '"Publico Text Web Regular", serif',
              fontSize: { xs: '9px', md: '11px' },
              zIndex: 1000,
              fontStyle: 'italic',
            }}
          >
            Source: {!showTechnat 
              ? 'Ferdinand Fried, Das XX. Jahrhundert, 1940' 
              : !showTrumpGolf 
              ? 'Scott Howard, 1940' 
              : 'Donald Trump, X, 2025-2026'
            }
          </Box>
        )}
        
        {/* Bouton retour en bas à droite */}
        {!showStartPrompt && (showTechnat || showTrumpGolf) && (
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation()
              handleBack()
            }}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: '#ffffff',
              color: 'black',
              fontFamily: '"Publico Text Web Regular", serif',
              fontSize: { xs: '10px', md: '14px' },
              textTransform: 'none',
              borderRadius: 5,
              px: 2,
              py: 1,
              boxShadow: 3,
              zIndex: 1000,
              '&:hover': {
                backgroundColor: '#DD203C',
                color: 'white',
              },
            }}
          >
            ← Retour
          </Button>
        )}
      </Box>
      
      {/* Barre de progression des étapes */}
      <Box sx={{ 
        width: '100%', 
        height: { xs: '4px', sm: '6px', md: '8px' }, 
        backgroundColor: 'rgba(200, 200, 200, 0.4)',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          height: '100%',
          width: showStartPrompt ? '0%' : !showTechnat ? '33.33%' : !showTrumpGolf ? '66.66%' : '100%',
          backgroundColor: '#DD203C',
          transition: 'width 0.8s ease-in-out',
          boxShadow: '0 0 8px rgba(221, 32, 60, 0.5)'
        }} />
      </Box>
      
      <Box sx={{ width: '100%', minHeight: { xs: '135px', md: '80px' }, flexShrink: 0 }}>
        <Legend showTechnat={showTechnat} showTrumpGolf={showTrumpGolf} />
      </Box>
    </Box>
  )
}

export default App
