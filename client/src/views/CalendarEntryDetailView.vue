<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoCalendarEntryDetails, fetchCalendarEntryDetail } from '../services/dashboard.js'

const route = useRoute()

const {
  auth,
  data,
  errorMessage,
  handleLogout,
  loadResource,
  loading,
  openDemo,
} = useProtectedResource({
  loader: () => fetchCalendarEntryDetail(route.params.key),
  demoData: demoCalendarEntryDetails[route.params.key] ?? {
    student: { name: 'Jordi', program: 'MS FinTech', cohort: 'Promotion 2026', email: 'jordi@demo.local' },
    entry: null,
    relatedCourse: null,
    announcements: [],
  },
  demoRoute: `/calendar/${route.params.key}`,
})

const payload = computed(() => data.value)

function announcementLocation(slug) {
  return auth.isDemo
    ? { path: `/announcements/${slug}`, query: { demo: '1' } }
    : { path: `/announcements/${slug}` }
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload?.student ?? { name: 'Jordi', program: 'MS FinTech' }" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single">
      <div class="panel"><p class="eyebrow">Chargement</p><h1>Ouverture du planning...</h1></div>
    </section>

    <section v-else-if="errorMessage || !payload?.entry" class="hero single">
      <div class="panel">
        <p class="eyebrow">Planning</p>
        <h1>Impossible d ouvrir cette session.</h1>
        <p class="copy">{{ errorMessage || 'Entree introuvable.' }}</p>
        <div class="actions">
          <button class="primary-action" type="button" @click="loadResource">Reessayer</button>
          <button class="secondary-action" type="button" @click="openDemo">Ouvrir la demo</button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <div class="panel">
          <p class="eyebrow">Session</p>
          <h1>{{ payload.entry.title }}</h1>
          <p class="copy">{{ payload.entry.detail }}</p>
          <div class="meta-grid">
            <div><span>Horaire</span><strong>{{ payload.entry.time }}</strong></div>
            <div><span>Reference</span><strong>{{ payload.entry.key }}</strong></div>
          </div>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="section-heading">
            <div><p class="eyebrow">Cours lie</p><h2>Module associe</h2></div>
          </div>

          <RouterLink
            v-if="payload.relatedCourse"
            class="entry-link"
            :to="auth.isDemo ? `/courses/${payload.relatedCourse.code}?demo=1` : `/courses/${payload.relatedCourse.code}`"
          >
            <strong>{{ payload.relatedCourse.title }}</strong>
            <span>{{ payload.relatedCourse.code }} - {{ payload.relatedCourse.deliverable }}</span>
          </RouterLink>
          <p v-else class="copy">Aucun module directement associe.</p>
        </section>

        <aside class="panel">
          <div class="section-heading">
            <div><p class="eyebrow">Contexte</p><h2>Annonces utiles</h2></div>
          </div>
          <ul class="entry-list">
            <li v-for="item in payload.announcements" :key="item.slug ?? item.title">
              <RouterLink class="entry-link" :to="announcementLocation(item.slug)">
                <strong>{{ item.title }}</strong>
                <span>{{ item.detail }}</span>
              </RouterLink>
            </li>
            <li v-if="!payload.announcements.length" class="empty-slot">
              Aucun contexte annonce pour cette session.
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
.hero { display: grid; grid-template-columns: 1fr; gap: 20px; padding: 24px 0 20px; }
.panel { padding: 28px; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 30px; background: rgba(255, 255, 255, 0.82); box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16); }
.eyebrow { margin: 0 0 6px; color: #92400e; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
h1, h2 { margin: 0; font-family: 'Space Grotesk', sans-serif; }
h1 { font-size: clamp(2.2rem, 5vw, 4rem); }
.copy { color: #475569; line-height: 1.65; }
.actions, .section-heading, .meta-grid { display: flex; gap: 12px; align-items: center; }
.primary-action, .secondary-action { border: 0; cursor: pointer; padding: 12px 16px; border-radius: 16px; font-weight: 700; }
.primary-action { background: #111827; color: #f8fafc; }
.secondary-action { background: rgba(255,255,255,0.72); color: #111827; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.08); }
.meta-grid { flex-wrap: wrap; margin-top: 18px; }
.meta-grid div { min-width: 160px; padding: 16px; border-radius: 20px; background: #f8fafc; }
.meta-grid span { display: block; color: #64748b; margin-bottom: 4px; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr); gap: 20px; }
.entry-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.entry-link, .entry-static { display: grid; gap: 6px; padding: 16px; border-radius: 20px; background: #f8fafc; color: inherit; text-decoration: none; }
.entry-link span, .entry-static span { color: #64748b; }
.empty-slot { padding: 16px; border-radius: 20px; background: #f8fafc; color: #64748b; }
@media (max-width: 1080px) { .content-grid { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .shell { padding: 14px; } .panel { padding: 18px; } .actions { flex-direction: column; align-items: stretch; } }
</style>
