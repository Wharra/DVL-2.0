<script setup>
const props = defineProps({
  timeline: {
    type: Array,
    required: true,
  },
  announcements: {
    type: Array,
    required: true,
  },
  discovery: {
    type: Array,
    required: true,
  },
  mode: {
    type: String,
    default: 'authenticated',
  },
})

function calendarLocation(key) {
  return props.mode === 'demo'
    ? { path: `/calendar/${key}`, query: { demo: '1' } }
    : { path: `/calendar/${key}` }
}

function announcementLocation(slug) {
  return props.mode === 'demo'
    ? { path: `/announcements/${slug}`, query: { demo: '1' } }
    : { path: `/announcements/${slug}` }
}
</script>

<template>
  <aside class="right-rail">
    <section class="rail-card">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">
            Aujourd hui
          </p>
          <h2>Agenda compact</h2>
        </div>
      </div>

      <ul class="timeline">
        <li v-for="item in timeline" :key="item.key ?? item.time + item.title">
          <RouterLink class="timeline-link" :to="calendarLocation(item.key)">
            <strong>{{ item.time }}</strong>
            <div>
              <p>{{ item.title }}</p>
              <small>{{ item.detail }}</small>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="rail-card rail-card-dark">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow light">
            Alerte campus
          </p>
          <h2>Annonces a lire</h2>
        </div>
      </div>

      <ul class="announcement-list">
        <li v-for="item in announcements" :key="item.slug ?? item.title">
          <RouterLink
            class="announcement-link"
            data-testid="announcement-link"
            :to="announcementLocation(item.slug)"
          >
            <strong>{{ item.title }}</strong>
            <p>{{ item.detail }}</p>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="rail-card">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">
            Pourquoi c est mieux
          </p>
          <h2>Experience repensee</h2>
        </div>
      </div>

      <ul class="discovery-list">
        <li v-for="item in discovery" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </aside>
</template>

<style scoped>
.right-rail {
  display: grid;
  gap: 18px;
}

.rail-card {
  padding: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 28px 64px rgba(148, 163, 184, 0.16);
}

.rail-card-dark {
  background: linear-gradient(160deg, #111827, #334155);
  color: #f8fafc;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #92400e;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.eyebrow.light {
  color: rgba(255, 255, 255, 0.72);
}

.section-heading h2 {
  margin: 0;
  font-size: 1.65rem;
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1;
}

.timeline,
.announcement-list,
.discovery-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline li {
  border-radius: 20px;
  background: #f8fafc;
}

.timeline-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  color: inherit;
  text-decoration: none;
}

.timeline li strong {
  min-width: 56px;
  font-family: 'Space Grotesk', sans-serif;
}

.timeline li p,
.announcement-list li strong {
  margin: 0 0 4px;
}

.timeline small {
  color: #64748b;
}

.announcement-list li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.announcement-list li:last-child {
  border-bottom: 0;
}

.announcement-link {
  display: block;
  padding-bottom: 14px;
  color: inherit;
  text-decoration: none;
}

.announcement-list p {
  margin: 0;
  color: rgba(226, 232, 240, 0.78);
  line-height: 1.6;
}

.discovery-list li {
  position: relative;
  padding-left: 18px;
  color: #64748b;
  line-height: 1.6;
}

.discovery-list li::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f59e0b;
}
</style>
