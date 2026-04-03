<script setup>
import { computed } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoAnnouncementsView, fetchAnnouncementsView } from '../services/dashboard.js'

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchAnnouncementsView,
  demoData: demoAnnouncementsView,
  demoRoute: '/announcements',
})

const payload = computed(() => data.value ?? demoAnnouncementsView)

function announcementLocation(slug) {
  return auth.isDemo
    ? { path: `/announcements/${slug}`, query: { demo: '1' } }
    : { path: `/announcements/${slug}` }
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
      <div class="panel">
        <p class="eyebrow">Chargement</p>
        <h1>Ouverture des annonces...</h1>
      </div>
    </section>

    <section v-else-if="errorMessage" class="hero single">
      <div class="panel">
        <p class="eyebrow">API indisponible</p>
        <h1>Impossible de charger les annonces.</h1>
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
          <p class="eyebrow">Signal campus</p>
          <h1>Annonces</h1>
          <p class="copy">
            Les changements de salle, rappels et infos critiques sont centralises ici au lieu d etre disperses.
          </p>
        </div>

        <div class="stat-grid">
          <article class="stat-card">
            <span>Total</span>
            <strong>{{ payload.summary.total }}</strong>
          </article>
          <article class="stat-card stat-card-alert">
            <span>Warnings</span>
            <strong>{{ payload.summary.warning }}</strong>
          </article>
          <article class="stat-card">
            <span>Infos</span>
            <strong>{{ payload.summary.info }}</strong>
          </article>
        </div>
      </section>

      <section class="announcement-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Flux</p>
            <h2>Annonces recentes</h2>
          </div>
        </div>

        <RouterLink
          v-for="announcement in payload.announcements"
          :key="announcement.slug"
          data-testid="announcement-card"
          class="announcement-card"
          :class="`announcement-card-${announcement.level}`"
          :to="announcementLocation(announcement.slug)"
        >
          <div class="announcement-meta">
            <span class="announcement-pill" :class="`announcement-pill-${announcement.level}`">
              {{ announcement.level }}
            </span>
            <small>{{ formatDate(announcement.publishedAt) }}</small>
          </div>
          <h3>{{ announcement.title }}</h3>
          <p class="preview">{{ announcement.detail }}</p>
        </RouterLink>
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
.announcement-panel {
  width: min(1360px, 100%);
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 20px;
  padding: 24px 0 20px;
}

.single {
  grid-template-columns: 1fr;
}

.panel,
.announcement-panel,
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
.section-heading h2,
.announcement-card h3 {
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

.copy,
.preview {
  color: #475569;
  line-height: 1.65;
}

.actions,
.section-heading,
.announcement-meta {
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

.announcement-panel {
  display: grid;
  gap: 16px;
  padding: 26px;
}

.announcement-card {
  display: block;
  padding: 20px;
  border-radius: 24px;
  color: inherit;
  text-decoration: none;
}

.announcement-card-warning {
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
}

.announcement-card-info {
  background: #f8fafc;
}

.announcement-meta {
  justify-content: space-between;
}

.announcement-pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.announcement-pill-info {
  background: #eff6ff;
  color: #1d4ed8;
}

.announcement-pill-warning {
  background: #fff7ed;
  color: #c2410c;
}

.preview {
  margin: 8px 0 0;
}

@media (max-width: 1080px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .shell {
    padding: 14px;
  }

  .panel,
  .announcement-panel {
    padding: 18px;
  }

  .actions,
  .announcement-meta {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
