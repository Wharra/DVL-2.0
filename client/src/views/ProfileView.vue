<script setup>
import { computed } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoProfileView, fetchProfileView } from '../services/dashboard.js'

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchProfileView,
  demoData: demoProfileView,
  demoRoute: '/profile',
})

const payload = computed(() => data.value ?? demoProfileView)

function courseLocation(code) {
  return auth.isDemo
    ? { path: `/courses/${code}`, query: { demo: '1' } }
    : { path: `/courses/${code}` }
}

function entryLocation(key) {
  return auth.isDemo
    ? { path: `/calendar/${key}`, query: { demo: '1' } }
    : { path: `/calendar/${key}` }
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload.student" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single">
      <div class="panel">
        <p class="eyebrow">Chargement</p>
        <h1>Ouverture du profil...</h1>
      </div>
    </section>

    <section v-else-if="errorMessage" class="hero single">
      <div class="panel">
        <p class="eyebrow">API indisponible</p>
        <h1>Impossible de charger le profil.</h1>
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
          <p class="eyebrow">Profil etudiant</p>
          <h1>{{ payload.student.name }}</h1>
          <p class="copy">
            Un profil utile: statut, promo, campus et points d attention sans devoir fouiller plusieurs pages.
          </p>
          <div class="identity-grid">
            <div>
              <span>Programme</span>
              <strong>{{ payload.student.program }}</strong>
            </div>
            <div>
              <span>Promotion</span>
              <strong>{{ payload.student.cohort }}</strong>
            </div>
            <div>
              <span>Campus</span>
              <strong>{{ payload.student.campus }}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{{ payload.student.email }}</strong>
            </div>
            <div>
              <span>Statut</span>
              <strong>{{ payload.student.status }}</strong>
            </div>
            <div>
              <span>Inscrit depuis</span>
              <strong>{{ formatDate(payload.student.joinedAt) }}</strong>
            </div>
          </div>
        </div>

        <div class="stat-grid">
          <article class="stat-card">
            <span>Progression moyenne</span>
            <strong>{{ payload.summary.averageProgress }}%</strong>
          </article>
          <article class="stat-card">
            <span>Favoris</span>
            <strong>{{ payload.summary.favorites }}</strong>
          </article>
          <article class="stat-card stat-card-alert">
            <span>Urgents</span>
            <strong>{{ payload.summary.urgent }}</strong>
          </article>
          <article class="stat-card">
            <span>Messages non lus</span>
            <strong>{{ payload.summary.unreadMessages }}</strong>
          </article>
          <article class="stat-card">
            <span>Annonces</span>
            <strong>{{ payload.summary.announcements }}</strong>
          </article>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Priorites</p>
              <h2>Cours a garder en vue</h2>
            </div>
          </div>

          <ul class="entry-list">
            <li v-for="course in payload.focusCourses" :key="course.code">
              <RouterLink class="entry-link" :to="courseLocation(course.code)">
                <strong>{{ course.title }}</strong>
                <span>{{ course.code }} - {{ course.deliverable }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>

        <aside class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Agenda</p>
              <h2>Prochains rendez-vous</h2>
            </div>
          </div>

          <ul class="entry-list">
            <li v-for="entry in payload.upcomingEntries" :key="entry.key">
              <RouterLink class="entry-link" :to="entryLocation(entry.key)">
                <strong>{{ entry.title }}</strong>
                <span>{{ entry.time }} - {{ entry.detail }}</span>
              </RouterLink>
            </li>
          </ul>
        </aside>
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

.single {
  grid-template-columns: 1fr;
}

.panel,
.stat-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16);
}

.panel {
  padding: 28px;
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
.section-heading,
.identity-grid {
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary-action,
.secondary-action {
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

.identity-grid {
  flex-wrap: wrap;
  align-items: stretch;
  margin-top: 18px;
}

.identity-grid div {
  min-width: 180px;
  padding: 16px;
  border-radius: 20px;
  background: #f8fafc;
}

.identity-grid span {
  display: block;
  color: #64748b;
  margin-bottom: 4px;
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

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 20px;
}

.entry-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.entry-link {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 20px;
  background: #f8fafc;
  color: inherit;
  text-decoration: none;
}

.entry-link span {
  color: #64748b;
}

@media (max-width: 1080px) {
  .hero,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .shell {
    padding: 14px;
  }

  .panel {
    padding: 18px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
