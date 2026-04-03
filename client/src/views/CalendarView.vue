<script setup>
import { computed } from 'vue'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoCalendarView, fetchCalendarView } from '../services/dashboard.js'

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: fetchCalendarView,
  demoData: demoCalendarView,
  demoRoute: '/calendar',
})

const payload = computed(() => data.value ?? demoCalendarView)

function entryLocation(key) {
  return auth.isDemo
    ? { path: `/calendar/${key}`, query: { demo: '1' } }
    : { path: `/calendar/${key}` }
}

function announcementLocation(slug) {
  return auth.isDemo
    ? { path: `/announcements/${slug}`, query: { demo: '1' } }
    : { path: `/announcements/${slug}` }
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload.student" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single">
      <div class="panel">
        <p class="eyebrow">
          Chargement
        </p>
        <h1>Preparation du calendrier...</h1>
      </div>
    </section>

    <section v-else-if="errorMessage" class="hero single">
      <div class="panel">
        <p class="eyebrow">
          API indisponible
        </p>
        <h1>Impossible de charger le calendrier.</h1>
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
        <div class="panel">
          <p class="eyebrow">
            Semaine a venir
          </p>
          <h1>Calendrier</h1>
          <p class="copy">
            Vue chronologique des cours, points projet et rappels importants.
          </p>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">
                Planning
              </p>
              <h2>Sessions a venir</h2>
            </div>
          </div>

          <ul class="calendar-list">
            <li v-for="entry in payload.entries" :key="entry.key" data-testid="calendar-entry">
              <RouterLink class="calendar-link" :to="entryLocation(entry.key)">
                <strong>{{ entry.time }}</strong>
                <div>
                  <p>{{ entry.title }}</p>
                  <small>{{ entry.detail }}</small>
                </div>
              </RouterLink>
            </li>
          </ul>
        </section>

        <aside class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">
                Rappels campus
              </p>
              <h2>Annonces</h2>
            </div>
          </div>

          <ul class="announcement-list">
            <li v-for="item in payload.announcements" :key="item.slug">
              <RouterLink class="announcement-link" :to="announcementLocation(item.slug)">
                <span class="announcement-pill" :class="`announcement-pill-${item.level}`">
                  {{ item.level }}
                </span>
                <strong>{{ item.title }}</strong>
                <p>{{ item.detail }}</p>
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
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 24px 0 20px;
}

.panel {
  padding: 28px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16);
}

.eyebrow {
  margin: 0 0 6px;
  color: #92400e;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.copy {
  color: #475569;
  line-height: 1.65;
}

.actions,
.section-heading {
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

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
  gap: 20px;
}

.calendar-list,
.announcement-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.calendar-list li {
  border-radius: 20px;
  background: #f8fafc;
}

.calendar-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  color: inherit;
  text-decoration: none;
}

.calendar-list li strong {
  min-width: 86px;
  font-family: 'Space Grotesk', sans-serif;
}

.calendar-list p,
.announcement-list p {
  margin: 4px 0 0;
}

.calendar-list small,
.announcement-list p {
  color: #64748b;
}

.announcement-list li {
  border-radius: 20px;
  background: #f8fafc;
}

.announcement-link {
  display: grid;
  gap: 8px;
  padding: 16px;
  color: inherit;
  text-decoration: none;
}

.announcement-pill {
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.announcement-pill-warning {
  background: #fff7ed;
  color: #c2410c;
}

.announcement-pill-info {
  background: #eff6ff;
  color: #1d4ed8;
}

@media (max-width: 1080px) {
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

  .actions,
  .section-heading,
  .calendar-list li {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
