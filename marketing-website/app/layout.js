import './globals.css'

export const metadata = {
  title: 'RoadLink — Your Vehicle\'s Digital Identity',
  description: 'RoadLink gives every vehicle in India a secure digital identity. Anyone can reach the owner. No one can see their number.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
