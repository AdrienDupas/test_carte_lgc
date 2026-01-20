import { useMediaQuery, useTheme } from '@mui/material'

export const useResponsive = () => {
  const theme = useTheme()
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')) // 600-900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')) // >= 900px
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    // Valeurs responsive pour l'application
    fontSize: {
      title: isMobile ? '14px' : isTablet ? '18px' : '23px',
      subtitle: isMobile ? '12px' : isTablet ? '16px' : '19px',
      tooltip: isMobile ? 10 : isTablet ? 12 : 16,
      ocean: isMobile ? 10 : isTablet ? 12 : 16,
      canalLabel: isMobile ? 10 : isTablet ? 11 : 16,
      button: isMobile ? '10px' : '14px',
      source: isMobile ? '9px' : '11px',
    },
    spacing: {
      baseRadius: isMobile ? 4 : isTablet ? 5 : 7,
      buttonPadding: isMobile ? { x: 2, y: 1 } : { x: 2, y: 1 },
    },
    dimensions: {
      borderStrokeWidth: isMobile ? 0.8 : isTablet ? 1 : 1.2,
      legendMinHeight: isMobile ? '120px' : '80px',
      progressBarHeight: isMobile ? '4px' : isTablet ? '6px' : '8px',
    }
  }
}
