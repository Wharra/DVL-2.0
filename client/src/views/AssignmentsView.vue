<script setup>
import { computed } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoAssignmentsView, fetchAssignmentsView } from '../services/dashboard.js'

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchAssignmentsView,
  demoData: demoAssignmentsView,
  demoRoute: '/assignments',
})

const payload = computed(() => data.value ?? demoAssignmentsView)

function assignmentLocation(slug) {
  return auth.isDemo
    ? { path: `/assignments/${slug}`, query: { demo: '1' } }
    : { path: `/assignments/${slug}` }
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload.student" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single">
      <div class="panel"><p class="eyebrow">Chargement</p><h1>Ouverture des devoirs...</h1></div>
    </section>

    <section v-else-if="errorMessage" class="hero single">
      <div class="panel">
        <p class="eyebrow">API indisponible</p>
        <h1>Impossible de charger les devoirs.</h1>
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
          <p class="eyebrow">Execution</p>
          <h1>Devoirs</h1>
          <p class="copy">Une vue unique pour suivre les rendus, les due dates et les priorites reelles.</p>
        </div>

        <div class="stat-grid">
          <article class="stat-card">
            <span>Total</span>
            <strong>{{ payload.summary.total }}</strong>
          </article>
          <article class="stat-card stat-card-alert">
            <span>A rendre vite</span>
            <strong>{{ payload.summary.dueSoon }}</strong>
          </article>
          <article class="stat-card">
            <span>En revue</span>
            <strong>{{ payload.summary.inReview }}</strong>
          </article>
          <article class="stat-card">
            <span>Soumis</span>
            <strong>{{ payload.summary.completed }}</strong>
          </article>
        </div>
      </section>

      <section class="panel assignment-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Backlog</p>
            <h2>Rendus a suivre</h2>
          </div>
        </div>

        <RouterLink
          v-for="assignment in payload.assignments"
          :key="assignment.slug"
          data-testid="assignment-card"
          class="assignment-card"
          :to="assignmentLocation(assignment.slug)"
        >
          <div class="assignment-meta">
            <span class="pill" :class="`pill-${assignment.priority}`">{{ assignment.priority }}</span>
            <small>{{ formatDate(assignment.dueAt) }}</small>
          </div>
          <h3>{{ assignment.title }}</h3>
          <p class="course-code">{{ assignment.courseCode }}</p>
          <p class="copy">{{ assignment.detail }}</p>
          <strong class="status">{{ assignment.status }}</strong>
        </RouterLink>
      </section>
    </template>
  </main>
</template>

<style scoped>
.shell { min-height: 100vh; padding: 24px; }
.hero, .assignment-panel { width: min(1360px, 100%); margin: 0 auto; }
.hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.9fr); gap: 20px; padding: 24px 0 20px; }
.single { grid-template-columns: 1fr; }
.panel, .stat-card { border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 30px; background: rgba(255,255,255,0.82); box-shadow: 0 28px 64px rgba(148,163,184,0.16); }
.panel { padding: 28px; }
.panel-wide h1, .section-heading h2, .assignment-card h3 { margin: 0; font-family: 'Space Grotesk', sans-serif; }
.panel-wide h1 { font-size: clamp(2.2rem, 5vw, 4rem); }
.eyebrow { margin: 0 0 6px; color: #92400e; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.copy, .course-code { color: #475569; line-height: 1.65; }
.actions, .section-heading, .assignment-meta { display: flex; gap: 12px; align-items: center; }
.primary-action, .secondary-action { border: 0; cursor: pointer; padding: 12px 16px; border-radius: 16px; font-weight: 700; }
.primary-action { background: #111827; color: #f8fafc; }
.secondary-action { background: rgba(255,255,255,0.72); color: #111827; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.08); }
.stat-grid { display: grid; gap: 16px; }
.stat-card { padding: 22px; }
.stat-card span { color: #64748b; }
.stat-card strong { display: block; margin-top: 10px; font-size: 2rem; font-family: 'Space Grotesk', sans-serif; }
.stat-card-alert { background: linear-gradient(135deg, #fff7ed, #ffedd5); }
.assignment-panel { display: grid; gap: 16px; }
.assignment-card { display: grid; gap: 8px; padding: 20px; border-radius: 24px; background: #f8fafc; color: inherit; text-decoration: none; }
.assignment-meta { justify-content: space-between; }
.pill { display: inline-flex; padding: 6px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.pill-high { background: #fef2f2; color: #b91c1c; }
.pill-medium { background: #fff7ed; color: #c2410c; }
.pill-low { background: #eff6ff; color: #1d4ed8; }
.course-code, .status { font-weight: 700; }
@media (max-width: 1080px) { .hero { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .shell { padding: 14px; } .panel { padding: 18px; } .actions, .assignment-meta { flex-direction: column; align-items: stretch; } }
</style>
