<script setup>
import { computed, ref } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import CourseCard from '../components/dashboard/CourseCard.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoCoursesView, fetchCoursesView } from '../services/dashboard.js'

const searchQuery = ref('')
const selectedCategory = ref('All')

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchCoursesView,
  demoData: demoCoursesView,
  demoRoute: '/courses',
})

const payload = computed(() => data.value ?? demoCoursesView)
const categories = computed(() => [
  'All',
  ...new Set(payload.value.courses.map(course => course.category)),
])

const filteredCourses = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  return payload.value.courses.filter((course) => {
    const matchesQuery =
      normalizedQuery === '' ||
      [course.title, course.code, course.category, course.deliverable]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesCategory =
      selectedCategory.value === 'All' ||
      course.category === selectedCategory.value

    return matchesQuery && matchesCategory
  })
})

function courseLocation(code) {
  return auth.isDemo
    ? { path: `/courses/${code}`, query: { demo: '1' } }
    : { path: `/courses/${code}` }
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload.student" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero hero-single">
      <div class="panel">
        <p class="eyebrow">
          Chargement
        </p>
        <h1>Chargement des cours...</h1>
      </div>
    </section>

    <section v-else-if="errorMessage" class="hero hero-single">
      <div class="panel">
        <p class="eyebrow">
          API indisponible
        </p>
        <h1>Impossible de charger les cours.</h1>
        <p class="copy">
          {{ errorMessage }}
        </p>
        <div class="actions">
          <button class="primary-action" type="button" @click="loadResource">
            Reessayer
          </button>
          <button class="secondary-action" type="button" @click="openDemo">
            Ouvrir la demo
          </button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <div class="panel panel-wide">
          <p class="eyebrow">
            Catalogue personnel
          </p>
          <h1>Vue cours</h1>
          <p class="copy">
            Tous les modules avec progression, prochaines sessions et actions a traiter.
          </p>
        </div>

        <div class="stat-grid">
          <article class="stat-card">
            <span>Total</span>
            <strong>{{ payload.summary.total }}</strong>
          </article>
          <article class="stat-card">
            <span>Favoris</span>
            <strong>{{ payload.summary.favorites }}</strong>
          </article>
          <article class="stat-card stat-card-alert">
            <span>Urgents</span>
            <strong>{{ payload.summary.urgent }}</strong>
          </article>
        </div>
      </section>

      <section class="toolbar">
        <label class="search-field">
          <span>Recherche cours</span>
          <input
            v-model="searchQuery"
            data-testid="course-search-input"
            type="search"
            placeholder="Filtrer par nom, code ou rendu"
          >
        </label>

        <div class="chip-row">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="chip"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category === 'All' ? 'Toutes les categories' : category }}
          </button>
        </div>
      </section>

      <section class="course-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">
              Cours
            </p>
            <h2>{{ filteredCourses.length }} modules visibles</h2>
          </div>
        </div>

        <div class="course-grid">
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.code"
            :course="course"
            :to="courseLocation(course.code)"
          />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  padding: 24px;
}

.hero,
.toolbar,
.course-panel {
  width: min(1360px, 100%);
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 20px;
  padding: 24px 0 20px;
}

.hero-single {
  grid-template-columns: 1fr;
}

.panel,
.course-panel,
.search-field,
.stat-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16);
}

.panel {
  padding: 32px;
}

.panel-wide h1,
.section-heading h2 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.panel-wide h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0 0 6px;
  color: #92400e;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.copy {
  color: #475569;
  line-height: 1.65;
}

.actions,
.chip-row,
.section-heading {
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary-action,
.secondary-action,
.chip {
  border: 0;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 16px;
  font-weight: 700;
}

.primary-action {
  background: #111827;
  color: #f8fafc;
}

.secondary-action {
  background: rgba(255, 255, 255, 0.72);
  color: #111827;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.stat-grid {
  display: grid;
  gap: 16px;
}

.stat-card {
  padding: 22px;
}

.stat-card span {
  color: #64748b;
}

.stat-card strong {
  display: block;
  margin-top: 10px;
  font-size: 2rem;
  font-family: 'Space Grotesk', sans-serif;
}

.stat-card-alert {
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(280px, 440px) 1fr;
  gap: 18px;
  align-items: start;
  padding-bottom: 20px;
}

.search-field {
  display: grid;
  gap: 10px;
  padding: 20px;
}

.search-field span {
  font-size: 0.88rem;
  font-weight: 700;
  color: #475569;
}

.search-field input {
  width: 100%;
  padding: 15px 18px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.82);
  outline: none;
}

.chip-row {
  flex-wrap: wrap;
}

.chip {
  background: rgba(255, 255, 255, 0.76);
  color: #334155;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}

.chip.active {
  background: #111827;
  color: #f8fafc;
  box-shadow: none;
}

.course-panel {
  padding: 26px;
}

.section-heading {
  justify-content: space-between;
  margin-bottom: 18px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

@media (max-width: 1080px) {
  .hero,
  .toolbar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .shell {
    padding: 14px;
  }

  .panel,
  .course-panel,
  .search-field {
    padding: 18px;
  }

  .actions,
  .section-heading {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
