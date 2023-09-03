module.exports = {
    darkMode: 'class',
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
    ],
    theme: {
      colors: {
        'suse-text': '#FFFFFF',
        'suse-dark-green': '#0C322C',
        'suse-light-green': '#30BA78',
        'suse-info-text': '#FE7C3F',
        'suse-red-text' :'#ff0000',
        'suse-text-black': '#000000',
        'suse-text-light-bg': '#145249',
        'suse-terminal': '#262626',
      },
      extend: {
        fontFamily: {
          "poppins-semibold": ['Poppins-SemiBold', 'san-serif'],
        }
      },
    },
    plugins: [],
  }