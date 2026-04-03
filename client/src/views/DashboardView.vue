<script setup>
import { computed, ref } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import CourseCard from '../components/dashboard/CourseCard.vue'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoOverview, fetchDashboardOverview } from '../services/dashboard.js'

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedView = ref('all')

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchDashboardOverview,
  demoData: demoOverview,
  demoRoute: '/dashboard',
})

const viewOptions = [
  { id: 'all', label: 'Tous' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'catchup', label: 'A relancer' },
]

const overview = computed(() => data.value ?? demoOverview)

const categories = computed(() => [
  'All',
  ...new Set(overview.value.courses.map(course => course.category)),
])

const filteredCourses = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  return overview.value.courses.filter((course) => {
    const matchesQuery =
      normalizedQuery === '' ||
      [course.title, course.code, course.category, course.deliverable]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesCategory =
      selectedCategory.value === 'All' ||
      course.category === selectedCategory.value

    const matchesView =
      selectedView.value === 'all' ||
      (selectedView.value === 'favorites' && course.favorite) ||
      (selectedView.value === 'catchup' && (course.urgent || course.progress < 40))

    return matchesQuery && matchesCategory && matchesView
  })
})

const resumeCourse = computed(() =>
  overview.value.courses.find(course => course.urgent) ?? overview.value.courses[0] ?? null,
)

function courseLocation(code) {
  return auth.isDemo
    ? { path: `/courses/${code}`, query: { demo: '1' } }
    : { path: `/courses/${code}` }
}

function calendarLocation() {
  return auth.isDemo
    ? { path: '/calendar', query: { demo: '1' } }
    : { path: '/calendar' }
}
</script>

<template>
  <main class="shell">
    <AppTopbar
      :student="overview.student"
      :mode="auth.mode"
      @logout="handleLogout"
    />

    <section v-if="loading" class="hero loading-state">
      <div class="loading-card">
        <p class="eyebrow">
          Chargement
        </p>
        <h1>Preparation du dashboard...</h1>
        <p class="hero-text">
          Recuperation de la session et des donnees prioritaires.
        </p>
      </div>
    </section>

    <section v-else-if="errorMessage" class="hero error-state">
      <div class="loading-card">
        <p class="eyebrow">
          API indisponible
        </p>
        <h1>Impossible de charger la version connectee.</h1>
        <p class="hero-text">
          {{ errorMessage }}
        </p>
        <div class="hero-actions">
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
        <div class="hero-copy">
          <p class="eyebrow">
            Dashboard etudiant
          </p>
          <h1>Bonjour, {{ overview.student.name }}</h1>
          <p class="hero-text">
            Une version plus claire de De Vinci Learning : moins de bruit, les
            actions importantes en premier, et un suivi direct de tes cours.
          </p>

          <div class="hero-actions">
            <RouterLink
              v-if="resumeCourse"
              class="primary-action"
              :to="courseLocation(resumeCourse.code)"
            >
              Reprendre le dernier cours
            </RouterLink>
            <RouterLink
              class="secondary-action"
              :to="calendarLocation()"
            >
              Voir le planning complet
            </RouterLink>
          </div>
        </div>

        <div class="hero-stats">
          <article class="stat-card">
            <span>Progression moyenne</span>
            <strong>{{ overview.summary.averageProgress }}%</strong>
            <small>{{ overview.summary.completedCount }} cours bien engages cette semaine</small>
          </article>
          <article class="stat-card stat-card-alert">
            <span>Points de vigilance</span>
            <strong>{{ overview.summary.urgentCount }}</strong>
            <small>rendus ou cours qui demandent une relance rapide</small>
          </article>
          <article class="stat-card">
            <span>Messages non lus</span>
            <strong>{{ overview.summary.unreadCount }}</strong>
            <small>{{ overview.student.program }} - {{ overview.student.email }}</small>
          </article>
        </div>
      </section>

      <section class="toolbar">
        <label class="search-field">
          <span>Recherche</span>
          <input
            v-model="searchQuery"
            data-testid="search-input"
            type="search"
            placeholder="Rechercher un cours, un prof ou un rendu"
          >
        </label>

        <div class="toolbar-stack">
          <div class="segmented-control" aria-label="Vue des cours">
            <button
              v-for="option in viewOptions"
              :key="option.id"
              type="button"
              class="segmented-button"
              :class="{ active: selectedView === option.id }"
              @click="selectedView = option.id"
            >
              {{ option.label }}
            </button>
          </div>

          <div class="chip-row" aria-label="Categories">
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
        </div>
      </section>

      <div class="content-grid">
        <section class="course-panel" aria-labelledby="courses-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">
                Mes cours
              </p>
              <h2 id="courses-title">
                Ce qui demande ton attention
              </h2>
            </div>
            <p class="section-meta">
              {{ filteredCourses.length }} cours affiches
            </p>
          </div>

          <div v-if="filteredCourses.length" class="course-grid">
            <CourseCard
              v-for="course in filteredCourses"
              :key="course.code"
              :course="course"
              :to="courseLocation(course.code)"
            />
          </div>

          <div v-else class="empty-state">
            <h3>Aucun cours ne correspond a ce filtre</h3>
            <p>
              Essaie une autre categorie ou retire quelques mots de ta recherche.
            </p>
          </div>
        </section>

        <DashboardSidebar
          :timeline="overview.timeline"
          :announcements="overview.announcements"
          :discovery="overview.discovery"
          :mode="auth.mode"
        />
      </div>
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
.content-grid {
  width: min(1360px, 100%);
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.9fr);
  gap: 20px;
  padding: 24px 0 20px;
}

.hero-copy,
.hero-stats,
.loading-card {
  border-radius: 32px;
}

.hero-copy,
.loading-card {
  padding: 34px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.78)),
    linear-gradient(135deg, rgba(250, 204, 21, 0.2), transparent 55%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 28px 65px rgba(148, 163, 184, 0.18);
}

.loading-state,
.error-state {
  grid-template-columns: 1fr;
}

.hero-copy h1,
.section-heading h2,
.empty-state h3,
.loading-card h1 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1;
}

.hero-copy h1,
.loading-card h1 {
  font-size: clamp(2.4rem, 5vw, 4.2rem);
}

.eyebrow {
  margin: 0 0 6px;
  color: #92400e;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-text {
  max-width: 62ch;
  margin: 18px 0 0;
  color: #475569;
  font-size: 1.02rem;
  line-height: 1.65;
}

.hero-actions,
.section-heading {
  display: flex;
  align-items: center;
}

.hero-actions {
  gap: 12px;
  margin-top: 28px;
}

.primary-action,
.secondary-action,
.segmented-button,
.chip {
  border: 0;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  font-weight: 700;
  text-decoration: none;
}

.primary-action {
  background: #111827;
  color: #f8fafc;
  box-shadow: 0 18px 30px rgba(17, 24, 39, 0.18);
}

.secondary-action {
  background: rgba(255, 255, 255, 0.74);
  color: #111827;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.1);
}

.primary-action:hover,
.secondary-action:hover,
.segmented-button:hover,
.chip:hover {
  transform: translateY(-1px);
}

.hero-stats {
  display: grid;
  gap: 16px;
}

.stat-card {
  padding: 22px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 22px 55px rgba(148, 163, 184, 0.14);
}

.stat-card span,
.section-meta,
.empty-state p {
  color: #64748b;
}

.stat-card strong {
  display: block;
  margin: 10px 0 8px;
  font-size: 2rem;
  font-family: 'Space Grotesk', sans-serif;
}

.stat-card small {
  color: #475569;
  line-height: 1.5;
}

.stat-card-alert {
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(280px, 440px) 1fr;
  gap: 18px;
  align-items: start;
}

.search-field {
  display: grid;
  gap: 10px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(15, 23, 42, 0.08);
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

.search-field input:focus {
  border-color: rgba(245, 158, 11, 0.9);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.14);
}

.toolbar-stack {
  display: grid;
  gap: 14px;
}

.segmented-control,
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.segmented-button,
.chip {
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  color: #334155;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}

.segmented-button.active,
.chip.active {
  background: #111827;
  color: #f8fafc;
  box-shadow: none;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.8fr);
  gap: 20px;
  padding: 20px 0 32px;
}

.course-panel {
  padding: 26px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16);
}

.section-heading {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-heading h2 {
  font-size: 1.65rem;
}

.section-meta {
  font-weight: 700;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.empty-state {
  padding: 36px 20px;
  text-align: center;
  border: 1px dashed rgba(148, 163, 184, 0.45);
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.72);
}

.empty-state p {
  margin: 10px auto 0;
  max-width: 36ch;
  line-height: 1.6;
}

@media (max-width: 1080px) {
  .hero,
  .toolbar,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 720px) {
  .shell {
    padding: 14px;
  }

  .hero-copy,
  .loading-card,
  .course-panel,
  .search-field {
    padding: 18px;
  }

  .hero-copy h1,
  .loading-card h1 {
    line-height: 1.08;
  }

  .hero-actions,
  .section-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .section-meta {
    width: 100%;
  }
}
</style>
