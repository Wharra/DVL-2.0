<template>
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

:root {
  color: #111827;
  font-family: 'Instrument Sans', 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(250, 204, 21, 0.18), transparent 26%),
    linear-gradient(180deg, #f8f5ee 0%, #f3efe6 100%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  color: #111827;
  background:
    radial-gradient(circle at top left, rgba(250, 204, 21, 0.18), transparent 26%),
    linear-gradient(180deg, #f8f5ee 0%, #f3efe6 100%);
}

button,
input {
  font: inherit;
}

a {
  color: inherit;
}
</style>
