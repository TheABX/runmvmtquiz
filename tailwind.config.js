/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        primary: '#145A5A',
        accent: '#F5A623',
        text: {
          primary: '#222222',
          secondary: '#666666',
        },
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
      },
    },
  },
  plugins: [],
}

