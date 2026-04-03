<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppTopbar from '../components/AppTopbar.vue'
import { useProtectedResource } from '../composables/useProtectedResource.js'
import { demoMessageDetails, fetchMessageDetail } from '../services/dashboard.js'

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
  loader: () => fetchMessageDetail(route.params.slug),
  demoData: demoMessageDetails[route.params.slug] ?? {
    student: { name: 'Jordi', program: 'MS FinTech', cohort: 'Promotion 2026', email: 'jordi@demo.local' },
    message: null,
    relatedAnnouncements: [],
  },
  demoRoute: `/messages/${route.params.slug}`,
})

const payload = computed(() => data.value)

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
      <div class="panel"><p class="eyebrow">Chargement</p><h1>Ouverture du message...</h1></div>
    </section>

    <section v-else-if="errorMessage || !payload?.message" class="hero single">
      <div class="panel">
        <p class="eyebrow">Messages</p>
        <h1>Impossible d ouvrir ce message.</h1>
        <p class="copy">{{ errorMessage || 'Message introuvable.' }}</p>
        <div class="actions">
          <button class="primary-action" type="button" @click="loadResource">Reessayer</button>
          <button class="secondary-action" type="button" @click="openDemo">Ouvrir la demo</button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <div class="panel">
          <p class="eyebrow">Message</p>
          <h1>{{ payload.message.subject }}</h1>
          <p class="copy">{{ payload.message.preview }}</p>
          <div class="meta-grid">
            <div><span>Expediteur</span><strong>{{ payload.message.sender }}</strong></div>
            <div><span>Recu le</span><strong>{{ formatDate(payload.message.receivedAt) }}</strong></div>
            <div><span>Priorite</span><strong>{{ payload.message.tone }}</strong></div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="section-heading">
          <div><p class="eyebrow">Contexte</p><h2>Annonces associees</h2></div>
        </div>
        <ul class="entry-list">
          <li v-for="item in payload.relatedAnnouncements" :key="item.slug ?? item.title">
            <RouterLink class="entry-link" :to="announcementLocation(item.slug)">
              <strong>{{ item.title }}</strong>
              <span>{{ item.detail }}</span>
            </RouterLink>
          </li>
          <li v-if="!payload.relatedAnnouncements.length" class="empty-slot">
            Aucun contexte supplementaire rattache a ce message.
          </li>
        </ul>
      </section>
    </template>
  </main>
</template>

<style scoped>
.shell { min-height: 100vh; padding: 24px; }
.hero, .panel { width: min(1360px, 100%); margin: 0 auto; }
.hero { display: grid; grid-template-columns: 1fr; gap: 20px; padding: 24px 0 20px; }
.panel { padding: 28px; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 30px; background: rgba(255,255,255,0.82); box-shadow: 0 28px 64px rgba(148,163,184,0.16); }
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
.entry-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.entry-link { display: grid; gap: 6px; padding: 16px; border-radius: 20px; background: #f8fafc; color: inherit; text-decoration: none; }
.entry-link span { color: #64748b; }
.empty-slot { padding: 16px; border-radius: 20px; background: #f8fafc; color: #64748b; }
@media (max-width: 720px) { .shell { padding: 14px; } .panel { padding: 18px; } .actions { flex-direction: column; align-items: stretch; } }
</style>
