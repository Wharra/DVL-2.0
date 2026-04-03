<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
  to: {
    type: [Object, String],
    default: null,
  },
})
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    data-testid="course-card"
    class="course-card course-card-link"
    :style="{
      '--course-accent': course.accent,
      '--course-glow': course.glow,
    }"
  >
    <div class="course-visual">
      <span class="course-tag">{{ course.category }}</span>
      <span v-if="course.favorite" class="course-badge">Favori</span>
    </div>

    <div class="course-body">
      <div>
        <h3>{{ course.title }}</h3>
        <p class="course-code">
          {{ course.code }}
        </p>
      </div>

      <p class="course-detail">
        {{ course.deliverable }}
      </p>

      <div class="progress-meta">
        <span>Progression</span>
        <strong>{{ course.progress }}%</strong>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" :style="{ width: `${course.progress}%` }" />
      </div>

      <div class="course-footer">
        <div>
          <span class="footer-label">Prochain slot</span>
          <strong>{{ course.nextSession }}</strong>
        </div>
        <span
          class="status-pill"
          :class="course.urgent ? 'status-pill-alert' : 'status-pill-calm'"
        >
          {{ course.urgent ? 'Action requise' : 'Sous controle' }}
        </span>
      </div>
    </div>
  </RouterLink>

  <article
    v-else
    data-testid="course-card"
    class="course-card"
    :style="{
      '--course-accent': course.accent,
      '--course-glow': course.glow,
    }"
  >
    <div class="course-visual">
      <span class="course-tag">{{ course.category }}</span>
      <span v-if="course.favorite" class="course-badge">Favori</span>
    </div>

    <div class="course-body">
      <div>
        <h3>{{ course.title }}</h3>
        <p class="course-code">
          {{ course.code }}
        </p>
      </div>

      <p class="course-detail">
        {{ course.deliverable }}
      </p>

      <div class="progress-meta">
        <span>Progression</span>
        <strong>{{ course.progress }}%</strong>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" :style="{ width: `${course.progress}%` }" />
      </div>

      <div class="course-footer">
        <div>
          <span class="footer-label">Prochain slot</span>
          <strong>{{ course.nextSession }}</strong>
        </div>
        <span
          class="status-pill"
          :class="course.urgent ? 'status-pill-alert' : 'status-pill-calm'"
        >
          {{ course.urgent ? 'Action requise' : 'Sous controle' }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.course-card {
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
}

.course-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.course-card-link:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(226, 232, 240, 0.9),
    0 22px 44px rgba(148, 163, 184, 0.16);
}

.course-visual {
  position: relative;
  min-height: 136px;
  padding: 18px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.44), transparent 22%),
    linear-gradient(135deg, var(--course-accent), var(--course-glow));
}

.course-tag,
.course-badge,
.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.course-tag {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  backdrop-filter: blur(10px);
}

.course-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 8px 10px;
  background: #fff7ed;
  color: #9a3412;
}

.course-body {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.course-body h3 {
  margin: 0;
  font-size: 1.22rem;
}

.course-code,
.course-detail,
.footer-label,
.progress-meta span {
  color: #64748b;
}

.course-code,
.course-detail {
  margin: 6px 0 0;
  line-height: 1.55;
}

.progress-meta,
.course-footer {
  display: flex;
  align-items: center;
}

.progress-meta {
  justify-content: space-between;
}

.progress-track {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--course-accent), var(--course-glow));
}

.course-footer {
  justify-content: space-between;
  gap: 14px;
}

.footer-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.8rem;
}

.status-pill {
  padding: 9px 12px;
  white-space: nowrap;
}

.status-pill-alert {
  background: #fef2f2;
  color: #b91c1c;
}

.status-pill-calm {
  background: #ecfdf5;
  color: #047857;
}

@media (max-width: 720px) {
  .course-footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
