import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import * as d3 from 'd3'
// @ts-ignore
import { geoGinzburg9 } from 'd3-geo-projection'
import Legend from './Legend'

// Textes pour chaque étape
const stepTexts = {
  intro: `Depuis son retour à la Maison-Blanche, Donald Trump joue avec les limites du pouvoir exécutif pour changer les frontières des États-Unis, qui n’avaient plus guère bougé depuis plus d’un siècle.

L’accroissement territorial du pays est désormais une doctrine officielle.`,
  step1: `À plusieurs reprises, Donald Trump a fait part de son souhait de voir le Canada, le Groenland et le canal de Panama passer sous souveraineté étatsunienne.

Dans une forme d’impérialisme toponymique, il a par ailleurs insisté pour que le golfe du Mexique soit désormais appelé golfe d’Amérique.

Après l’enlèvement du président Maduro, il a laissé entendre qu’il envisageait également d’annexer le Venezuela.`,
  step2: `Les revendications territoriales de Donald Trump présentent de troublantes analogies avec des projets expansionnistes étatsuniens des années 1930.

L’un d’eux était porté par le mouvement technocratique d’Howard Scott, qui plaidait pour la réunion en un seul État de l’ensemble de l’Amérique du Nord, des Caraïbes, ainsi que le nord de l’Amérique du sud et le bassin oriental du Pacifique.

Ce redécoupage devait permettre de mieux exploiter les ressources naturelles de l’Amérique du Nord et de la préserver de toute interférence exogène.`,
  step3: `Comme celui de Trump, le projet géopolitique d’Howard Scott repose sur une corrélation entre la taille d’un territoire et la puissance de l’État qui le contrôle.

Cette obsession pour la grandeur territoriale associée à la prospérité et à la puissance est très présente chez certains théoriciens nationalistes allemands de l’entre-deux-guerres : l’économiste Ferdinand Fried, qui théorise la division du monde en quatre « économies de grands espaces », le géopoliticien Karl Haushofer ou encore le juriste Carl Schmitt.`
}

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
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const [currentStep, setCurrentStep] = useState(0) // 0 = intro, 1, 2, 3
  const [activeSection, setActiveSection] = useState(0) // Section actuellement visible
  const [showScrollPrompt, setShowScrollPrompt] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0) // Pas de flou par défaut
  const prevStepRef = useRef(0)
  
  // Refs pour les sections de scrollytelling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Fonction pour mettre à jour l'état en fonction de la section active
  const updateSectionState = (index: number) => {
    setActiveSection(index)
    // Mettre à jour l'étape de la carte en fonction de la section
    if (index === 0) {
      setCurrentStep(0) // Intro
    } else if (index === 1) {
      setCurrentStep(1) // Étape 1 - Trump
    } else if (index === 2) {
      setCurrentStep(1) // Exploration carte 1
    } else if (index === 3) {
      setCurrentStep(2) // Étape 2 - Technat
    } else if (index === 4) {
      setCurrentStep(2) // Exploration carte 2
    } else if (index === 5) {
      setCurrentStep(3) // Étape 3 - Économies
    } else if (index === 6) {
      setCurrentStep(3) // Exploration carte 3
    }
    
    // Gérer le flou selon la section
    if (index === 0) {
      setBlurAmount(3) // Intro floute
    } else if (index % 2 === 0) {
      setBlurAmount(0) // Exploration
    } else {
      setBlurAmount(3) // Texte
    }
    
    // Masquer le prompt après le premier scroll
    if (index > 0) {
      setShowScrollPrompt(false)
    }
  }

  // Intersection Observer pour le scrollytelling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    // Fonction pour trouver la section active basée sur la position de scroll
    const findActiveSection = () => {
      const scrollTop = scrollContainer.scrollTop
      const viewportHeight = window.innerHeight
      const viewportCenter = scrollTop + viewportHeight / 2
      
      let activeIndex = 0
      let minDistance = Infinity
      
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const sectionTop = ref.offsetTop
          const sectionHeight = ref.offsetHeight
          const sectionCenter = sectionTop + sectionHeight / 2
          const distance = Math.abs(viewportCenter - sectionCenter)
          
          if (distance < minDistance) {
            minDistance = distance
            activeIndex = index
          }
        }
      })
      
      return activeIndex
    }

    const handleScroll = () => {
      const newSection = findActiveSection()
      updateSectionState(newSection)
    }

    // Écouter le scroll sur le conteneur
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    
    // Appel initial
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Gestionnaire pour propager le scroll quand la carte est au-dessus
  useEffect(() => {
    const mapContainer = mapContainerRef.current
    const scrollContainer = scrollContainerRef.current
    if (!mapContainer || !scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      // Propager le scroll au conteneur parent
      scrollContainer.scrollBy({
        top: e.deltaY,
        behavior: 'auto'
      })
    }

    // Ajouter le listener sur tout le conteneur de la carte fixe
    const fixedContainer = mapContainer.parentElement
    if (fixedContainer) {
      fixedContainer.addEventListener('wheel', handleWheel, { passive: true })
      return () => {
        fixedContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [activeSection])

  // Dériver showTechnat et showTrumpGolf depuis currentStep
  const showTechnat = currentStep >= 2
  const showTrumpGolf = currentStep >= 3

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

  // Masquer tous les tooltips lors des changements d'étape
  useEffect(() => {
    d3.selectAll('.country-tooltip').style('opacity', 0)
    d3.selectAll('.military-tooltip').style('opacity', 0)
    d3.selectAll('.usa-tooltip').style('opacity', 0)
  }, [currentStep])

  // ======================
  // MAP RENDER
  // ======================
  useEffect(() => {
    // Ne pas rendre tant que technatData n'est pas chargé (nécessaire pour le zoom initial)
    if (!geojsonData || !svgRef.current || !mapContainerRef.current || !technatData) return

    const container = mapContainerRef.current

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
      if (currentStep <= 1 && world2025Data) {
        // Étapes 0 et 1 (intro et Trump) : fond = world_2025.geojson
        baseGeojson = world2025Data
      }
      const filteredFeatures = baseGeojson.features.filter(
        f => f.properties.NAME !== 'Antarctica'
      )
      const filteredGeoJSON = {
        type: 'FeatureCollection',
        features: filteredFeatures
      }

      // Étapes 0, 1, 2 : zoom sur technatData (région Technat)
      // Étape 3 : dézoom sur le monde entier
      const shouldZoomOnTechnat = currentStep < 3
      const projection = geoGinzburg9()
        .fitSize(
          [width, height],
          shouldZoomOnTechnat ? technatData as any : filteredGeoJSON as any
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

      // Pattern de hachures rouges foncées pour Trump à l'étape 2
      const patternBlack = defs.append('pattern')
        .attr('id', 'black-hatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 11)
        .attr('height', 11)
        .attr('patternTransform', 'rotate(45)')
      
      patternBlack.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 11)
        .attr('stroke', '#ba0202')
        .attr('stroke-width', 3)

      // ======================
      // BASE MAP
      // ======================
      const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
      const tooltipCountry = d3.select(document.body)
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
        .style('z-index', 10000)
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
      
      // Gestionnaire global de tooltip pour toutes les étapes
      svg.on('mousemove.country-tooltip', function(event) {
        // Ne pas afficher le tooltip des pays si un autre tooltip est visible
        if (d3.selectAll('.military-tooltip').filter(function() { 
          return d3.select(this).style('opacity') !== '0' 
        }).size() > 0) {
          return
        }
        if (d3.selectAll('.usa-tooltip').filter(function() { 
          return d3.select(this).style('opacity') !== '0' 
        }).size() > 0) {
          return
        }
        
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

      // ======================
      // RÉSEAU BASE (couche visible à l'étape 2 uniquement)
      // ======================
      if (showTechnat && !showTrumpGolf && reseauBaseData) {
        const reseauGroup = svg.append('g')
          .attr('class', 'reseau-base')
          .style('opacity', 0)
        reseauGroup.selectAll('path')
          .data(reseauBaseData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#bfbfbf')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2)
          .attr('pointer-events', 'none')
        // Animation d'apparition
        reseauGroup.transition()
          .duration(600)
          .style('opacity', 1)
      }

      // ======================
      // FRONTIÈRES TECHNAT (couche visible à l'étape 2 uniquement)
      // ======================
      if (showTechnat && !showTrumpGolf && frontiereTechnatData) {
        const frontiereGroup = svg.append('g')
          .attr('class', 'frontieres-technat')
          .style('opacity', 0)
        frontiereGroup.selectAll('path')
          .data(frontiereTechnatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#DD203C')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '5,4')
          .attr('pointer-events', 'none')
        // Animation d'apparition
        frontiereGroup.transition()
          .delay(200)
          .duration(600)
          .style('opacity', 1)
      }

      // ======================
      // TECHNAT (étape 2 uniquement)
      // ======================
      if (showTechnat && !showTrumpGolf && technatData) {
        const technatGroup = svg.append('g')
          .attr('class', 'technat')
          .style('opacity', 0)
        technatGroup.selectAll('path')
          .data(technatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', '#DD203C')
          .attr('fill-opacity', 0.8)
        // Animation d'apparition
        technatGroup.transition()
          .delay(400)
          .duration(600)
          .style('opacity', 1)
      }

      // ======================
      // TRUMP + VENEZUELA (ÉTAPE 1)
      // ======================
      if (!showTechnat && trumpData && venezuelaData) {
        const trump = svg.append('g')
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
            d.properties.NAME === 'Canal de Panama' ? 10 : 0)
           .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')

        const venezuela = svg.append('g')
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
      // AIRE ECO CAT (uniquement étape 3) - EN DESSOUS DES FRONTIÈRES
      if (showTechnat && showTrumpGolf && aireEcoCatData) {
        const aireEcoCatGroup = svg.append('g')
          .attr('class', 'aire-eco-cat')
        aireEcoCatGroup
          .selectAll('path')
          .data(aireEcoCatData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', d => d.properties.cat === 1 ? '#6d000d' : '#DD203C')
          .attr('fill-opacity', 0.8)
          .attr('stroke', 'none')
          .attr('stroke-width', 0)
          .attr('pointer-events', 'none')
      }

      // Frontières 1939 (visibles étape 3 uniquement)
      const borderStrokeWidth = width < 600 ? 0.8 : width < 900 ? 1 : 1.2
      if (frontiere1939Data && showTechnat && showTrumpGolf) {
        const g1939 = svg.append('g')
          .attr('class', 'frontieres-1939')

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
      // AIRE ECO (uniquement étape 3) - AU-DESSUS DES FRONTIÈRES
      // ======================
      if (showTechnat && showTrumpGolf && aireEcoData) {
        const aireEcoGroup = svg.append('g')
          .attr('class', 'aire-eco')
        aireEcoGroup
          .selectAll('path')
          .data(aireEcoData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#df5757')
          .attr('stroke-width', 1.5)
          .attr('pointer-events', 'none')
      }

      
      // Frontières actuelles (visibles étapes 1 et 2)
      if (!showTrumpGolf && frontiereActuelleData) {
        const gActuelle = svg.append('g')
          .attr('class', 'frontieres-actuelles')
          .style('opacity', 1)

        gActuelle.selectAll('path')
          .data(frontiereActuelleData.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', borderStrokeWidth)
          .attr('pointer-events', 'none')
      }

      // ======================
      // BASES MILITAIRES TECHNAT (couche ponctuelle - étape 2 uniquement)
      // ======================
      if (showTechnat && !showTrumpGolf && basesMilitaireTechnatData) {
        // Rayon responsive selon la largeur de la fenêtre
        const baseRadius = width < 500 ? 4 : width < 900 ? 5 : 7
        // Font size responsive pour le tooltip
        const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
        const tooltip = d3.select(document.body)
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
          .style('z-index', 10000)
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
          .attr('fill-opacity', 1)
          .attr('stroke', '#ffffff')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2)
          .on('mousemove', function(event, d) {
            // Masquer le tooltip des pays (priorité aux bases)
            d3.selectAll('.country-tooltip').style('opacity', 0)
            const tooltipNode = tooltip.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltip.text(d.properties.NAME_CITY || 'militaire')
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
            // Masquer le tooltip des pays (priorité aux bases)
            d3.selectAll('.country-tooltip').style('opacity', 0)
            const tooltipNode = tooltip.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltip.text(d.properties.NAME_CITY || 'militaire')
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

        // Tooltip affiché uniquement lors du survol direct d'un cercle (plus de tooltip à proximité)
      }

      // ======================
      // BASES USA 2025 (étape 1 - au-dessus des bases militaires technat)
      // ======================
      if (!showTechnat && basesUsa2025Data) {
        const baseRadius = width < 500 ? 4 : width < 900 ? 5 : 7
        const tooltipFontSize = width < 500 ? 10 : width < 900 ? 12 : 16
        const tooltipUsa = d3.select(document.body)
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
          .style('z-index', 10000)
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
            // Masquer le tooltip des pays (priorité aux bases)
            d3.selectAll('.country-tooltip').style('opacity', 0)
            const tooltipNode = tooltipUsa.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltipUsa.text(d.properties.NAME_CITY || 'USA')
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
            // Masquer le tooltip des pays (priorité aux bases)
            d3.selectAll('.country-tooltip').style('opacity', 0)
            const tooltipNode = tooltipUsa.node() as HTMLDivElement
            if (!tooltipNode) return
            tooltipUsa.text(d.properties.NAME_CITY || 'USA')
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

        // Tooltip affiché uniquement lors du survol direct d'un cercle (plus de tooltip à proximité)
      }

      // ======================
      // CANAL DE PANAMA LABEL - AU-DESSUS DE TOUT (étape 1)
      // ======================
      if (!showTechnat && trumpData && venezuelaData) {
        const canalFeature = trumpData.features.find(f => f.properties.NAME === 'Canal de Panama')
        if (canalFeature) {
          const canalCentroid = d3.geoCentroid(canalFeature as any)
          const canalCoords = projection(canalCentroid)
          if (canalCoords) {
            // Décaler le label en bas du canal
            const labelOffsetY = 45; // valeur positive pour aller vers le bas
            // Dessiner le trait du canal vers le label en bas avec des extrémités arrondies
            svg.append('g')
              .attr('class', 'canal-panama-line')
              .append('line')
              .attr('x1', canalCoords[0])
              .attr('y1', canalCoords[1])
              .attr('x2', canalCoords[0])
              .attr('y2', canalCoords[1] + labelOffsetY - 10)
              .attr('stroke', '#DD203C')
              .attr('stroke-width', 2)
             
            // Label avec double contour blanc positionné en bas du canal
            const labelFontSize = width < 600 ? 11 : width < 900 ? 12 : 16
            const labelGroup = svg.append('g')
              .attr('class', 'canal-panama-label')
            // Contour blanc externe
            labelGroup.append('text')
              .attr('x', canalCoords[0])
              .attr('y', canalCoords[1] + labelOffsetY)
              .text('Canal de Panama')
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
              .text('Canal de Panama')
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
      // LABELS DES PAYS (ÉTAPES 1 ET 2)
      // ======================
      if (!showTrumpGolf) {
        // Labels communs aux deux étapes
        const commonLabels = [
          { label: 'États-Unis', nameFr: 'États-Unis' },
          { label: 'Canada', nameFr: 'Canada' },
          { label: 'Groenland', nameFr: 'Groenland' },
          { label: 'Venezuela', nameFr: 'Venezuela' }
        ]
        
        // Labels supplémentaires pour l'étape 2
        const step2OnlyLabels = [
          { label: 'Mexique', nameFr: 'Mexique' },
          { label: 'Colombie', nameFr: 'Colombie' }
        ]
        
        const countryLabels = !showTechnat 
          ? commonLabels
          : [...commonLabels, ...step2OnlyLabels]

        const labelFontSize = width < 600 ? 11 : width < 900 ? 14 : 18

        countryLabels.forEach(({ label, nameFr }, index) => {
          const country = filteredFeatures.find(f => f.properties.NAME_FR === nameFr)
          if (country) {
            const centroid = d3.geoCentroid(country as any)
            const coords = projection(centroid)
            if (coords) {
              // Décalages pour certains pays
              let offsetX = 0
              let offsetY = 0
              if (label === 'Canada') {
                offsetX = -40
              } else if (label === 'Venezuela') {
                offsetX = 10
                offsetY = -10
              }
              
              // Vérifier si c'est un nouveau label de l'étape 2
              const isNewStep2Label = showTechnat && step2OnlyLabels.some(l => l.label === label)
              
              const labelGroup = svg.append('g')
                .attr('class', `country-label-${label}`)
                .style('opacity', isNewStep2Label ? 0 : 1)
              
              // Contour rouge
              labelGroup.append('text')
                .attr('x', coords[0] + offsetX)
                .attr('y', coords[1] + offsetY)
                .text(label)
                .attr('font-family', '"Sanomat Web Medium Regular", serif')
                .attr('font-size', labelFontSize)
                .attr('font-weight', 'bold')
                .attr('fill', 'none')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('stroke', '#DD203C')
                .attr('stroke-width', 3)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
              
              // Texte blanc
              labelGroup.append('text')
                .attr('x', coords[0] + offsetX)
                .attr('y', coords[1] + offsetY)
                .text(label)
                .attr('font-family', '"Sanomat Web Medium Regular", serif')
                .attr('font-size', labelFontSize)
                .attr('font-weight', 'bold')
                .attr('fill', '#ffffff')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
              
              // Animation d'apparition pour les nouveaux labels de l'étape 2
              if (isNewStep2Label) {
                labelGroup.transition()
                  .delay(600 + index * 100)
                  .duration(500)
                  .style('opacity', 1)
              }
            }
          }
        })
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
              .attr('font-family', '"Open Sans", sans-serif')
              .attr('font-size', oceanFontSize)
              .attr('font-weight', 400)
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
              .attr('font-family', '"Open Sans", sans-serif')
              .attr('font-size', oceanFontSize)
              .attr('font-weight', 400)
              .attr('font-style', 'italic')
              .attr('fill', '#999999')
              .attr('opacity', 0.7)
              .text(line)
          })
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
    currentStep
  ])

  // ======================
  // TRANSITION DE DÉZOOM ENTRE ÉTAPE 2 ET 3
  // ======================
  useEffect(() => {
    if (!svgRef.current || !mapContainerRef.current || !technatData || !geojsonData) return
    if (isTransitioning) return

    const container = mapContainerRef.current
    const svg = d3.select(svgRef.current)
    const width = container.clientWidth
    const height = container.clientHeight

    // Préparer les données filtrées
    let baseGeojson = geojsonData
    if (currentStep <= 1 && world2025Data) {
      baseGeojson = world2025Data
    }
    const filteredFeatures = baseGeojson.features.filter(
      f => f.properties.NAME !== 'Antarctica'
    )
    const filteredGeoJSON = {
      type: 'FeatureCollection',
      features: filteredFeatures
    }

    // Ne faire la transition QUE si on passe de l'étape 2 à 3 ou de 3 à 2
    const transitionNeeded = (prevStepRef.current === 2 && currentStep === 3) || 
                            (prevStepRef.current === 3 && currentStep === 2)
    
    prevStepRef.current = currentStep
    
    if (!transitionNeeded) return

    setIsTransitioning(true)
    
    // Optimisation GPU
    svg.style('will-change', 'transform')

    // Définir les projections de départ et d'arrivée
    const start = geoGinzburg9().fitSize([width, height], technatData as any)
    const end = geoGinzburg9().fitSize([width, height], filteredGeoJSON as any)

    const scaleI = d3.interpolate(
      currentStep === 3 ? start.scale() : end.scale(),
      currentStep === 3 ? end.scale() : start.scale()
    )
    const translateI = d3.interpolate(
      currentStep === 3 ? start.translate() : end.translate(),
      currentStep === 3 ? end.translate() : start.translate()
    )

    // Noms des océans pour mise à jour pendant la transition
    const oceans = [
      { name: 'Océan\nPacifique', coords: [-140, 10] },
      { name: 'Océan\nAtlantique', coords: [-60, 25] },
      { name: 'Océan\nIndien', coords: [75, -20] },
      { name: 'Océan\nArctique', coords: [-5, 80] }
    ]
    const oceanFontSize = width < 600 ? 10 : width < 900 ? 12 : 16

    svg.transition()
      .duration(1300)
      .ease(d3.easeCubicOut)
      .tween('zoom', () => (t: number) => {
        const p = geoGinzburg9()
          .scale(scaleI(t))
          .translate(translateI(t))

        const tempPath = d3.geoPath().projection(p)
        
        // Mettre à jour tous les paths
        svg.selectAll<SVGPathElement, any>('path')
          .attr('d', tempPath as any)
        
        // Mettre à jour les cercles (bases militaires)
        svg.selectAll<SVGCircleElement, GeoFeature>('circle')
          .attr('cx', d => {
            const coords = p(d.geometry.coordinates as [number, number])
            return coords ? coords[0] : 0
          })
          .attr('cy', d => {
            const coords = p(d.geometry.coordinates as [number, number])
            return coords ? coords[1] : 0
          })
        
        // Mettre à jour les positions des textes des océans
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

        // Mettre à jour les labels des pays
        const countryLabels = [
          { label: 'États-Unis', nameFr: 'États-Unis', offsetX: 0, offsetY: 0 },
          { label: 'Canada', nameFr: 'Canada', offsetX: -40, offsetY: 0 },
          { label: 'Mexique', nameFr: 'Mexique', offsetX: 0, offsetY: 0 },
          { label: 'Groenland', nameFr: 'Groenland', offsetX: 0, offsetY: 0 },
          { label: 'Venezuela', nameFr: 'Venezuela', offsetX: 10, offsetY: -10 },
          { label: 'Colombie', nameFr: 'Colombie', offsetX: 0, offsetY: 0 }
        ]
        
        countryLabels.forEach(({ label, nameFr, offsetX, offsetY }) => {
          const country = filteredFeatures.find(f => f.properties.NAME_FR === nameFr)
          if (country) {
            const centroid = d3.geoCentroid(country as any)
            const coords = p(centroid)
            if (coords) {
              svg.selectAll(`.country-label-${label} text`)
                .attr('x', coords[0] + offsetX)
                .attr('y', coords[1] + offsetY)
            }
          }
        })

        // Mettre à jour le label du Canal de Panama si présent
        if (trumpData) {
          const canalFeature = trumpData.features.find(f => f.properties.NAME === 'Canal de Panama')
          if (canalFeature) {
            const canalCentroid = d3.geoCentroid(canalFeature as any)
            const canalCoords = p(canalCentroid)
            if (canalCoords) {
              const labelOffsetY = 45
              svg.select('.canal-panama-line line')
                .attr('x1', canalCoords[0])
                .attr('y1', canalCoords[1])
                .attr('x2', canalCoords[0])
                .attr('y2', canalCoords[1] + labelOffsetY - 10)
              
              svg.selectAll('.canal-panama-label text')
                .attr('x', canalCoords[0])
                .attr('y', canalCoords[1] + labelOffsetY)
            }
          }
        }
      })
      .on('end', () => {
        svg.style('will-change', 'auto')
        setIsTransitioning(false)
      })

  }, [currentStep, technatData, geojsonData, world2025Data, trumpData, isTransitioning])

  // Obtenir le titre et la source selon l'étape
  const getTitle = () => {
    if (currentStep <= 1) return 'Les revendications des États-Unis'
    if (currentStep === 2) return 'Le Technat'
    return 'Economies de grands espaces (Großraumwirtschaften)'
  }

  const getSubtitle = () => {
    if (currentStep <= 1) return 'Donald Trump, 2025-2026'
    if (currentStep === 2) return 'Howard Scott, 1940'
    return 'Ferdinand Fried, 1940'
  }

  const getSource = () => {
    if (currentStep <= 1) return 'Donald Trump, X, 2025-2026'
    if (currentStep === 2) return 'Howard Scott, 1940'
    return 'Fried Ferdinand, Das XX. Jahrhundert, 1940'
  }

  return (
    <Box 
      ref={scrollContainerRef}
      sx={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'auto',
        position: 'relative',
        isolation: 'isolate',
        zIndex: 20,
      }}
    >
      {/* Carte fixe en arrière-plan */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%', 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1,
        pointerEvents: 'auto',
      }}>
        {/* Header - au-dessus du flou */}
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          px: 1.2,
          pb: 1,
          pt: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: 'black',
          gap: 0.5,
          zIndex: 100,
          flexShrink: 0,
          filter: `blur(${blurAmount}px)`,
          transition: 'filter 0.5s ease-out',
          position: 'relative',
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ 
              fontFamily: '"Sanomat Web Medium Regular"',
              fontSize: { xs: '14px', sm: '19px', md: '23px' },
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              {getTitle()}
            </Box>
            <Box sx={{ 
              fontFamily: '"Publico Text Web Regular"',
              fontSize: { xs: '12px', sm: '15px', md: '19px' },
              transition: 'all 0.3s ease'
            }}>
              {getSubtitle()}
            </Box>
          </Box>
        </Box>

        {/* Map container */}
        <Box ref={mapContainerRef} sx={{ 
          width: '100%', 
          flexGrow: 1, 
          minHeight: 0, 
          position: 'relative',
          filter: `blur(${blurAmount}px)`,
          transition: 'filter 0.5s ease-out'
        }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
          
          {/* Indicateur pour continuer à explorer */}
          {showScrollPrompt && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                bottom: { xs: 20, md: 30 },
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(255,255,255,0.98)',
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 1, sm: 1.2, md: 1.5 },
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                fontSize: { xs: '12px', sm: '14px', md: '15px' },
                color: '#333',
                fontFamily: '"Open Sans", sans-serif',
                fontWeight: 600,
                animation: 'pulseSubtle 2.5s ease-in-out infinite',
                '@keyframes pulseSubtle': {
                  '0%': { opacity: 0.85, transform: 'translateX(-50%) scale(1)' },
                  '50%': { opacity: 1, transform: 'translateX(-50%) scale(1.05)' },
                  '100%': { opacity: 0.85, transform: 'translateX(-50%) scale(1)' },
                },
                zIndex: 101,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                pointerEvents: 'none',
              }}
            >
              Scrollez
              <KeyboardArrowDownIcon 
                sx={{ 
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#DD203C',
                }}
              />
            </Box>
          )}
          
          {/* Source en bas au centre */}
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
              transition: 'all 0.3s ease'
            }}
          >
            Source: {getSource()}
          </Box>
        </Box>
        

        
        {/* Barre de progression */}
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
            width: currentStep === 0 ? '0%' : currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%',
            backgroundColor: '#DD203C',
            transition: 'width 0.8s ease-in-out',
            boxShadow: '0 0 8px rgba(221, 32, 60, 0.5)'
          }} />
        </Box>
        
        {/* Legend */}
        <Box sx={{ 
          width: '100%', 
          minHeight: { xs: '120px', sm: '90px', md: '90px' }, 
          flexShrink: 0,
          filter: `blur(${blurAmount}px)`,
          transition: 'filter 0.5s ease-out'
        }}>
          <Legend showTechnat={showTechnat} showTrumpGolf={showTrumpGolf} />
        </Box>
      </Box>

      {/* Conteneur de scrollytelling */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        
        {/* Section 0: Intro */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[0] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '80%', md: '60%' },
              bgcolor: 'rgba(255,255,255,0.97)',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 4 },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              opacity: activeSection === 0 ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'auto',
            }}
          >
            <Box sx={{ 
              fontFamily: '"Open Sans", sans-serif',
              fontSize: { xs: '18px', sm: '22px', md: '26px' },
              fontWeight: 800,
              mb: 2,
              color: '#DD203C'
            }}>
              Introduction
            </Box>
            <Box sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              lineHeight: 1.5,
              color: '#1b1b1b',
              fontFamily: '"Open Sans", sans-serif',
            }}>
              {stepTexts.intro.split('\n\n').map((para, i) => (
                <Box key={i} sx={{ mb: i < stepTexts.intro.split('\n\n').length - 1 ? '11px' : 0 }}>
                  {para}
                </Box>
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              mt: 3,
              color: '#DD203C',
              fontWeight: 600,
              fontSize: { xs: '15px', sm: '17px', md: '19px' },
            }}>
              Scrollez pour explorer
              <KeyboardArrowDownIcon 
                sx={{ 
                  fontSize: { xs: '28px', sm: '32px', md: '36px' },
                  color: '#DD203C',
                  animation: 'bounce 1.5s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(8px)' },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Section 1: Étape 1 - Trump (texte) */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[1] = el }}
          sx={{
            minHeight: '0vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '80%', md: '60%' },
              bgcolor: 'rgba(255,255,255,0.97)',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 4 },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              opacity: activeSection === 1 ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'auto',
            }}
          >
            <Box sx={{ 
              fontFamily: '"Open Sans", sans-serif',
              fontSize: { xs: '18px', sm: '22px', md: '26px' },
              fontWeight: 800,
              mb: 2,
              color: '#DD203C'
            }}>
              Les revendications de Trump
            </Box>
            <Box sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              lineHeight: 1.5,
              color: '#1b1b1b',
              fontFamily: '"Open Sans", sans-serif',
            }}>
              {stepTexts.step1.split('\n\n').map((para, i) => (
                <Box key={i} sx={{ mb: i < stepTexts.step1.split('\n\n').length - 1 ? '11px' : 0 }}>
                  {para}
                </Box>
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}>
              <KeyboardArrowDownIcon 
                sx={{ 
                  fontSize: { xs: '28px', sm: '32px', md: '36px' },
                  color: '#DD203C',
                  animation: 'bounce 1.5s ease-in-out infinite',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Section 2: Exploration carte 1 */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[2] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 4,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              p: 1.5,
              borderRadius: '50%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              opacity: activeSection === 2 ? 1 : 0,
              transition: 'opacity 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 100050,
            }}
          >
            <KeyboardArrowDownIcon sx={{ color: '#DD203C', fontSize: { xs: '24px', sm: '28px' } }} />
          </Box>
        </Box>

        {/* Section 3: Étape 2 - Technat (texte) */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[3] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '80%', md: '60%' },
              bgcolor: 'rgba(255,255,255,0.97)',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 4 },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              opacity: activeSection === 3 ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'auto',
            }}
          >
            <Box sx={{ 
              fontFamily: '"Open Sans", sans-serif',
              fontSize: { xs: '18px', sm: '22px', md: '26px' },
              fontWeight: 800,
              mb: 2,
              color: '#DD203C'
            }}>
              Le Technat
            </Box>
            <Box sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              lineHeight: 1.5,
              color: '#1b1b1b',
              fontFamily: '"Open Sans", sans-serif',
            }}>
              {stepTexts.step2.split('\n\n').map((para, i) => (
                <Box key={i} sx={{ mb: i < stepTexts.step2.split('\n\n').length - 1 ? '11px' : 0 }}>
                  {para}
                </Box>
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}>
              <KeyboardArrowDownIcon 
                sx={{ 
                  fontSize: { xs: '28px', sm: '32px', md: '36px' },
                  color: '#DD203C',
                  animation: 'bounce 1.5s ease-in-out infinite',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Section 4: Exploration carte 2 */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[4] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 4,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              p: 1.5,
              borderRadius: '50%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              opacity: activeSection === 4 ? 1 : 0,
              transition: 'opacity 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 50,
            }}
          >
            <KeyboardArrowDownIcon sx={{ color: '#DD203C', fontSize: { xs: '24px', sm: '28px' } }} />
          </Box>
        </Box>

        {/* Section 5: Étape 3 - Économies (texte) */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[5] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '80%', md: '60%' },
              bgcolor: 'rgba(255,255,255,0.97)',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 4 },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              opacity: activeSection === 5 ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'auto',
            }}
          >
            <Box sx={{ 
              fontFamily: '"Open Sans", sans-serif',
              fontSize: { xs: '18px', sm: '22px', md: '26px' },
              fontWeight: 800,
              mb: 2,
              color: '#DD203C'
            }}>
              Les économies de grands espaces
            </Box>
            <Box sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              lineHeight: 1.5,
              color: '#1b1b1b',
              fontFamily: '"Open Sans", sans-serif',
            }}>
              {stepTexts.step3.split('\n\n').map((para, i) => (
                <Box key={i} sx={{ mb: i < stepTexts.step3.split('\n\n').length - 1 ? '11px' : 0 }}>
                  {para}
                </Box>
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}>
              <KeyboardArrowDownIcon 
                sx={{ 
                  fontSize: { xs: '28px', sm: '32px', md: '36px' },
                  color: '#DD203C',
                  animation: 'bounce 1.5s ease-in-out infinite',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Section 6: Exploration finale */}
        <Box
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[6] = el }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        />

      </Box>
    </Box>
  )
}

export default App
