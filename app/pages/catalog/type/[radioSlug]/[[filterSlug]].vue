<template>
	<CatalogPage :radio-slug="radioSlug" :filter-slug="filterSlug" />
</template>

<script setup lang="ts">
import CatalogPage from '~/components/CatalogPage.vue'

const route = useRoute()
const radioSlug = computed(() => String(route.params.radioSlug || ''))
const filterSlug = computed(() => (route.params.filterSlug ? String(route.params.filterSlug) : undefined))
</script>
