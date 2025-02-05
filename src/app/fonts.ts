import localFont from 'next/font/local'

export const dejaVu = localFont({
  src: [
    {
      path: '../../public/fonts/DejaVuSansMono.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/DejaVuSansMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/DejaVuSansMono-BoldOblique.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/DejaVuSansMono-Oblique.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-dejaVu'
})

export const basier = localFont({
    src: [
      {
        path: '../../public/fonts/BasierCircle-Regular.otf',
        weight: '500',
        style: 'normal',
      },
    ],
    variable: '--font-basier'
  })
  