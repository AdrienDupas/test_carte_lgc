import { Box } from '@mui/material'

interface NotesProps {
  showTechnat: boolean
  showTrumpGolf: boolean
  visible: boolean
}

function Notes({ showTechnat, showTrumpGolf, visible }: NotesProps) {
  // Textes pour chaque étape
  const stepTexts = {
    step1: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
    step2: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.",
    step3: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software."
  }

  // Déterminer quel texte afficher selon l'étape
  const getCurrentText = () => {
    if (!showTechnat) return stepTexts.step3  // Étape 1 = ancien step3 (Trump)
    if (!showTrumpGolf) return stepTexts.step2 // Étape 2 = Technat (inchangé)
    return stepTexts.step1                      // Étape 3 = ancien step1 (Aire éco)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 8, md: 16 },
        left: { xs: 8, md: 16 },
        maxWidth: { xs: '85%', sm: '60%', md: '45%' },
        bgcolor: 'rgba(255,255,255,0.95)',
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 1.5, sm: 2, md: 2.5 },
        borderRadius: 2,
        boxShadow: 3,
        fontSize: { xs: '11px', sm: '13px', md: '14px' },
        lineHeight: 1.6,
        color: '#1b1b1b',
        fontFamily: '"Publico Text Web Regular", serif',
        zIndex: 2000,
        transform: visible ? 'translateX(0)' : 'translateX(-120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out',
      }}
    >
      {getCurrentText()}
    </Box>
  )
}

export default Notes
