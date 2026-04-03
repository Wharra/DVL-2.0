<script setup>
import { computed } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoGradesView, fetchGradesView } from '../services/dashboard.js'

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchGradesView,
  demoData: demoGradesView,
  demoRoute: '/grades',
})

const payload = computed(() => data.value ?? demoGradesView)

function gradeLocation(courseCode) {
  return auth.isDemo ? `/grades/${courseCode}?demo=1` : `/grades/${courseCode}`
}

function formatDate(value) {
  if (!value) {
    return 'En attente'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload.student" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single"><div class="panel"><p class="eyebrow">Chargement</p><h1>Ouverture des notes...</h1></div></section>

    <section v-else-if="errorMessage" class="hero single">
      <div class="panel">
        <p class="eyebrow">API indisponible</p>
        <h1>Impossible de charger les notes.</h1>
        <p class="copy">{{ errorMessage }}</p>
        <div class="actions">
          <button class="primary-action" type="button" @click="loadResource">Reessayer</button>
          <button class="secondary-action" type="button" @click="openDemo">Ouvrir la demo</button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <div class="panel panel-wide">
          <p class="eyebrow">Performance</p>
          <h1>Mes notes</h1>
          <p class="copy">Moyennes par module, evaluations publiees et attentes encore en cours de correction.</p>
        </div>

        <div class="stat-grid">
          <article class="stat-card">
            <span>Moyenne globale</span>
            <strong>{{ payload.summary.globalAverage ?? '--' }}</strong>
          </article>
          <article class="stat-card">
            <span>Rendus corriges</span>
            <strong>{{ payload.summary.returned }}</strong>
          </article>
          <article class="stat-card stat-card-alert">
            <span>En attente</span>
            <strong>{{ payload.summary.pending }}</strong>
          </article>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="section-heading"><div><p class="eyebrow">Modules</p><h2>Vue par cours</h2></div></div>
          <div class="grade-grid">
            <RouterLink
              v-for="course in payload.courses"
              :key="course.courseCode"
              data-testid="grade-card"
              class="grade-card"
              :to="gradeLocation(course.courseCode)"
            >
              <strong>{{ course.courseTitle }}</strong>
              <span>{{ course.courseCode }}</span>
              <b>{{ course.average ?? '--' }}/20</b>
              <small>{{ course.publishedCount }} corrige(s), {{ course.pendingCount }} en attente</small>
            </RouterLink>
          </div>
        </section>

        <aside class="panel">
          <div class="section-heading"><div><p class="eyebrow">Recents</p><h2>Dernieres evaluations</h2></div></div>
          <ul class="entry-list">
            <li v-for="item in payload.recentGrades" :key="item.slug" class="entry-link">
              <strong>{{ item.title }}</strong>
              <span>{{ item.score }}/{{ item.outOf }} - {{ formatDate(item.returnedAt) }}</span>
            </li>
          </ul>
        </aside>
      </div>
    </template>
  </main>
</template>

<style scoped>
.shell { min-height: 100vh; padding: 24px; }
.hero, .content-grid { width: min(1360px, 100%); margin: 0 auto; }
.hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr); gap: 20px; padding: 24px 0 20px; }
.single { grid-template-columns: 1fr; }
.panel, .stat-card { border: 1px solid rgba(15,23,42,0.08); border-radius: 30px; background: rgba(255,255,255,0.82); box-shadow: 0 28px 64px rgba(148,163,184,0.16); }
.panel { padding: 28px; }
.panel-wide h1, .section-heading h2 { margin: 0; font-family: 'Space Grotesk', sans-serif; }
.panel-wide h1 { font-size: clamp(2.2rem, 5vw, 4rem); }
.eyebrow { margin: 0 0 6px; color: #92400e; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.copy { color: #475569; line-height: 1.65; }
.actions, .section-heading { display: flex; gap: 12px; align-items: center; }
.primary-action, .secondary-action { border: 0; cursor: pointer; padding: 12px 16px; border-radius: 16px; font-weight: 700; }
.primary-action { background: #111827; color: #f8fafc; }
.secondary-action { background: rgba(255,255,255,0.72); color: #111827; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.08); }
.stat-grid { display: grid; gap: 16px; }
.stat-card { padding: 22px; }
.stat-card span { color: #64748b; }
.stat-card strong { display: block; margin-top: 10px; font-size: 2rem; font-family: 'Space Grotesk', sans-serif; }
.stat-card-alert { background: linear-gradient(135deg, #fff7ed, #ffedd5); }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr); gap: 20px; }
.grade-grid, .entry-list { display: grid; gap: 12px; }
.entry-list { list-style: none; margin: 0; padding: 0; }
.grade-card, .entry-link { display: grid; gap: 6px; padding: 16px; border-radius: 20px; background: #f8fafc; color: inherit; text-decoration: none; }
.grade-card span, .grade-card small, .entry-link span { color: #64748b; }
.grade-card b { font-size: 1.4rem; }
@media (max-width: 1080px) { .hero, .content-grid { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .shell { padding: 14px; } .panel { padding: 18px; } .actions { flex-direction: column; align-items: stretch; } }
</style>
