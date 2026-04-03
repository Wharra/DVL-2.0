<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoAnnouncementDetails, fetchAnnouncementDetail } from '../services/dashboard.js'

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
  loader: () => fetchAnnouncementDetail(route.params.slug),
  demoData: demoAnnouncementDetails[route.params.slug] ?? {
    student: { name: 'Jordi', program: 'MS FinTech', cohort: 'Promotion 2026', email: 'jordi@demo.local' },
    announcement: null,
    relatedMessages: [],
    relatedEntries: [],
  },
  demoRoute: `/announcements/${route.params.slug}`,
})

const payload = computed(() => data.value)

function messageLocation(slug) {
  return auth.isDemo
    ? { path: `/messages/${slug}`, query: { demo: '1' } }
    : { path: `/messages/${slug}` }
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
    : date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
}
</script>

<template>
  <main class="shell">
    <AppTopbar :student="payload?.student ?? { name: 'Jordi', program: 'MS FinTech' }" :mode="auth.mode" @logout="handleLogout" />

    <section v-if="loading" class="hero single">
      <div class="panel">
        <p class="eyebrow">Chargement</p>
        <h1>Ouverture de l annonce...</h1>
      </div>
    </section>

    <section v-else-if="errorMessage || !payload?.announcement" class="hero single">
      <div class="panel">
        <p class="eyebrow">Annonce</p>
        <h1>Impossible d ouvrir cette annonce.</h1>
        <p class="copy">{{ errorMessage || 'Annonce introuvable.' }}</p>
        <div class="actions">
          <button class="primary-action" type="button" @click="loadResource">Reessayer</button>
          <button class="secondary-action" type="button" @click="openDemo">Ouvrir la demo</button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <div class="panel">
          <p class="eyebrow">Annonce campus</p>
          <h1>{{ payload.announcement.title }}</h1>
          <p class="copy">{{ payload.announcement.detail }}</p>
          <div class="meta-grid">
            <div>
              <span>Niveau</span>
              <strong>{{ payload.announcement.level }}</strong>
            </div>
            <div>
              <span>Publie le</span>
              <strong>{{ formatDate(payload.announcement.publishedAt) }}</strong>
            </div>
            <div>
              <span>Reference</span>
              <strong>{{ payload.announcement.slug }}</strong>
            </div>
          </div>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Messages</p>
              <h2>Conversations associees</h2>
            </div>
          </div>

          <ul class="entry-list">
            <li v-for="item in payload.relatedMessages" :key="item.slug">
              <RouterLink class="entry-link" :to="messageLocation(item.slug)">
                <strong>{{ item.subject }}</strong>
                <span>{{ item.sender }} - {{ item.preview }}</span>
              </RouterLink>
            </li>
            <li v-if="!payload.relatedMessages.length" class="empty-slot">
              Aucune conversation associee a cette annonce.
            </li>
          </ul>
        </section>

        <aside class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Planning</p>
              <h2>Sessions impactees</h2>
            </div>
          </div>

          <ul class="entry-list">
            <li v-for="item in payload.relatedEntries" :key="item.key">
              <RouterLink class="entry-link" :to="entryLocation(item.key)">
                <strong>{{ item.title }}</strong>
                <span>{{ item.time }} - {{ item.detail }}</span>
              </RouterLink>
            </li>
            <li v-if="!payload.relatedEntries.length" class="empty-slot">
              Aucun slot de planning n est impacte directement.
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
.content-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr); gap: 20px; }
.entry-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.entry-link { display: grid; gap: 6px; padding: 16px; border-radius: 20px; background: #f8fafc; color: inherit; text-decoration: none; }
.entry-link span { color: #64748b; }
.empty-slot { padding: 16px; border-radius: 20px; background: #f8fafc; color: #64748b; }
@media (max-width: 1080px) { .content-grid { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .shell { padding: 14px; } .panel { padding: 18px; } .actions { flex-direction: column; align-items: stretch; } }
</style>
