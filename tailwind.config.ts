import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A3D5C',
        accent: '#E8A020',
        secondary: '#1E6B8C',
        background: '#F8F9FA',
        foreground: '#1A1A2A',
      },
    },
  },
  plugins: [],
}
export default config
