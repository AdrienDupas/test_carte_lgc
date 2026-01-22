import { Box, Fade } from '@mui/material'

interface LegendProps {
  showTechnat: boolean
  showTrumpGolf: boolean
}

function Legend({ showTechnat, showTrumpGolf }: LegendProps) {
  // (paysItem removed: unused variable)

  // Étape 1: Economies de grands espaces
  const step1Items = [
    <Box 
      key="cat1"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 16, md: 20 }, 
        height: { xs: 16, md: 20 }, 
        backgroundColor: '#6d000d',
         opacity: 0.8,
        border: '1px solid #191919',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Pôles économiques dominants
      </Box>
    </Box>,
    <Box 
      key="cat2"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 16, md: 20 }, 
        height: { xs: 16, md: 20 }, 
        backgroundColor: '#e30615',
        opacity: 0.8,
        border: '1px solid #191919',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Zones d’extraction des ressources
      </Box>
    </Box>,
    <Box 
      key="pays"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 16, md: 20 }, 
        height: { xs: 16, md: 20 }, 
        backgroundColor: '#e0dcdc', 
        border: '1px solid #aaa',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Régions périphériques
      </Box>
    </Box>,
    <Box 
      key="aire-eco"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 28, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '2px solid #df5757',
        backgroundColor: 'transparent',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Quatre aires économiques
      </Box>
    </Box>,
    <Box 
      key="frontiere-1939"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 28, md: 36 }, 
        height: { xs: 10, md: 12 }, 
        position: 'relative',
        backgroundColor: 'transparent',
        flexShrink: 0
      }}>
        {/* Contour gris (sous-couche) */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '100%',
          height: 0,
          borderTop: { xs: '5px solid #bdbdbd', md: '7px solid #bdbdbd' },
          borderRadius: 2,
          transform: 'translateY(-50%)',
          zIndex: 1
        }} />
        {/* Contour blanc (dessus) */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '100%',
          height: 0,
          borderTop: { xs: '3px solid #ffffff', md: '4px solid #ffffff' },
          borderRadius: 2,
          transform: 'translateY(-50%)',
          zIndex: 2
        }} />
      </Box>
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Frontières 1939
      </Box>
    </Box>
  ]

  // Étape 2: Technat
  const step2Items = [
    <Box 
      key="technat"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 16, md: 20 }, 
        height: { xs: 16, md: 20 }, 
        backgroundColor: '#DD203C',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Technat
      </Box>
    </Box>,
    <Box 
      key="reseau"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 28, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '3px solid #adadad',
        backgroundColor: 'transparent',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Réseaux de bases de défense
      </Box>
    </Box>,
    <Box 
      key="bases"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 14, md: 16 }, 
        height: { xs: 14, md: 16 }, 
        borderRadius: '50%', 
        backgroundColor: '#DD203C', 
        border: '3px solid #fff',
       
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Bases militaires
      </Box>
    </Box>,
    <Box 
      key="frontiere-technat"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 28, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '2px dashed #DD203C',
        backgroundColor: 'transparent',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Frontières maritimes du Technat
      </Box>
    </Box>,
    <Box 
      key="frontiere-1939"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.8,
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 28, md: 36 }, 
        height: { xs: 10, md: 12 }, 
        position: 'relative',
        backgroundColor: 'transparent',
        flexShrink: 0
      }}>
        {/* Contour gris (sous-couche) */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '100%',
          height: 0,
          borderTop: { xs: '5px solid #bdbdbd', md: '7px solid #bdbdbd' },
          borderRadius: 2,
          transform: 'translateY(-50%)',
          zIndex: 1
        }} />
        {/* Contour blanc (dessus) */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '100%',
          height: 0,
          borderTop: { xs: '3px solid #ffffff', md: '4px solid #ffffff' },
          borderRadius: 2,
          transform: 'translateY(-50%)',
          zIndex: 2
        }} />
      </Box>
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Frontières 1939
      </Box>
    </Box>
  ]

  // Étape 3: Trump
  const step3Items = [
    <Box 
      key="trump"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 14, md: 20 }, 
        height: { xs: 14, md: 20 }, 
        backgroundColor: '#DD203C',
        opacity: 0.8,
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Revendications de Donald Trump
      </Box>
    </Box>,
    <Box 
      key="venezuela"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 14, md: 20 }, 
        height: { xs: 14, md: 20 }, 
        background: 'repeating-linear-gradient(-45deg, #DD203C, #DD203C 2px, white 2px, white 4px)',
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Revendication non officielle
      </Box>
    </Box>,
    <Box 
      key="bases-usa-2025"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 12, md: 16 }, 
        height: { xs: 12, md: 16 }, 
        borderRadius: '50%', 
        backgroundColor: '#4991d9', 
        border: '3px solid #fff',
        
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Bases militaires états-uniennes actuelles
      </Box>
    </Box>,
    <Box 
      key="separator-1"
      sx={{ 
        width: '100%',
        height: '1px',
        backgroundColor: '#d0d0d0',
        my: { xs: 0.5, md: 0.3 },
        flexShrink: 0
      }}
    />,
    <Box 
      key="technat-pale"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 14, md: 20 }, 
        height: { xs: 14, md: 20 }, 
        backgroundColor: '#DD203C',
        opacity: 0.2,
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Technat
      </Box>
    </Box>,
    <Box 
      key="bases-technat-pale"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 12, md: 16 }, 
        height: { xs: 12, md: 16 }, 
        borderRadius: '50%', 
        backgroundColor: '#DD203C', 
        opacity: 0.25,
        border: '3px solid #fff',
       
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Bases militaires du Technat
      </Box>
    </Box>,
    <Box 
      key="reseau-pale"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 24, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '3px solid #bfbfbf',
        backgroundColor: 'transparent',
        opacity: 0.4,
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Réseaux de bases du Technat
      </Box>
    </Box>,
    <Box 
      key="frontiere-technat-pale"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 24, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '2px dashed #DD203C',
        backgroundColor: 'transparent',
        opacity: 0.2,
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Frontières du Technat
      </Box>
    </Box>,
    <Box 
      key="separator-2"
      sx={{ 
         
        width: '100%',
        height: '1px',
        backgroundColor: '#d0d0d0',
        my: { xs: 0.5, md: 0.3 },
        flexShrink: 0
        
      }}
    />,
    <Box 
      key="aire-eco-pale"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, md: 0.8 },
        transition: 'opacity 0.6s ease-in-out',
        opacity: 1
      }}
    >
      <Box sx={{ 
        width: { xs: 24, md: 36 }, 
        height: { xs: 6, md: 8 }, 
        borderTop: '2px solid #e23434',
        backgroundColor: 'transparent',
        opacity: 0.3,
        flexShrink: 0
      }} />
      <Box sx={{ fontSize: { xs: 11, md: 14 }, opacity: 1 }}>
        Aires économiques de Fried
      </Box>
    </Box>
  ]

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderTop: '1px solid #e0e0e0',
      position: 'relative',
      px: 2,
      py: 3.4
    }}>
      {/* Étape 1 */}
      <Fade in={!showTechnat} timeout={600} unmountOnExit>
        <Box sx={{ 
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, md: 3 },
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          width: 'calc(100% - 32px)',
          px: { xs: 0.5, md: 1 }
        }}>
          {step1Items}
        </Box>
      </Fade>

      {/* Étape 2 */}
      <Fade in={showTechnat && !showTrumpGolf} timeout={600} unmountOnExit>
        <Box sx={{ 
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, md: 3 },
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          width: 'calc(100% - 32px)',
          px: { xs: 0.5, md: 1 }
        }}>
          {step2Items}
        </Box>
      </Fade>

      {/* Étape 3 */}
      <Fade in={showTrumpGolf} timeout={600} unmountOnExit>
        <Box sx={{ 
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          rowGap: { xs: 0.4, md: 0.6 },
          columnGap: { xs: 0.4, md: 2 },
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          width: 'calc(100% - 32px)',
          px: { xs: 0.1, md: 1 }
        }}>
          {step3Items}
        </Box>
      </Fade>
    </Box>
  )
}

export default Legend
