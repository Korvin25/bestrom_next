<template>
	<PageBase :page-id="13" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PageBase from '~/components/PageBase.vue'
import { useAppStore } from '~/stores/app'

const { setBreadcrumbs } = useBreadcrumbs()
const { language } = storeToRefs(useAppStore())

const updateBreadcrumbs = () => {
	setBreadcrumbs([
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Реквизиты' : 'Requisites', to: '/requisites' },
	])
}

onMounted(() => {
	updateBreadcrumbs()
})

watch(language, () => {
	updateBreadcrumbs()
})
</script>
