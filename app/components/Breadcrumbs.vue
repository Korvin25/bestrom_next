<template>
  <nav v-if="crumbs && crumbs.length" aria-label="Breadcrumb" class="breadcrumbs-container">
    <ol itemscope itemtype="http://schema.org/BreadcrumbList" class="breadcrumbs-list">
      <li 
        v-for="(crumb, index) in crumbs" 
        :key="index" 
        itemprop="itemListElement" 
        itemscope 
        itemtype="http://schema.org/ListItem"
        class="breadcrumbs-item"
      >
        <template v-if="index < crumbs.length - 1">
          <NuxtLink :to="crumb.to" itemprop="item" class="breadcrumbs-link">
            <span itemprop="name">{{ crumb.label }}</span>
          </NuxtLink>
          <span class="breadcrumbs-separator">/</span>
        </template>
        <template v-else>
          <span itemprop="name" class="breadcrumbs-current" aria-current="page">{{ crumb.label }}</span>
          <meta itemprop="item" :content="fullUrl(crumb.to)" />
        </template>
        <meta itemprop="position" :content="String(index + 1)" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const { crumbs } = useBreadcrumbs();
const config = useRuntimeConfig();

const fullUrl = (path: string) => {
  const siteUrl = config.public.siteUrl || 'https://bestrom.ru';
  return `${siteUrl}${path}`;
};

const jsonLd = computed(() => {
  if (!crumbs.value || !crumbs.value.length) return null;

  return {
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.value.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@id": fullUrl(crumb.to),
        "name": crumb.label
      }
    }))
  };
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => jsonLd.value ? JSON.stringify(jsonLd.value) : '')
    }
  ]
});
</script>

<style scoped>
.breadcrumbs-container {
  padding: 1rem 0;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}

.breadcrumbs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumbs-item {
  display: flex;
  align-items: center;
}

.breadcrumbs-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs-link:hover {
  color: #e30613; /* Brand color */
}

.breadcrumbs-separator {
  margin: 0 0.5rem;
  color: #94a3b8;
  font-size: 0.8em;
}

.breadcrumbs-current {
  color: #2fc1ff;
  font-weight: 500;
}
</style>
