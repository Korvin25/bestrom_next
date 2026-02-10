<template>
	<NuxtLayout>
		<section class="hero card-shadow">
			<h2>{{ language === 'RU' ? 'Страница не найдена' : 'Page not found' }}</h2>
			<p>{{ language === 'RU' ? 'Проверьте адрес или вернитесь на главную.' : 'Check the address or return to the home page.' }}</p>
			<NuxtLink class="btn" to="/">{{ language === 'RU' ? 'На главную' : 'Go home' }}</NuxtLink>
		</section>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

defineProps<{ error?: any }>()

const appStore = useAppStore()
const { language } = storeToRefs(appStore)

useSeoMeta({
	title: computed(() => (language.value === 'RU' ? 'Страница не найдена' : 'Page not found')),
})
</script>

<style scoped>
.hero {
	padding: 2rem;
	margin: 2rem 0;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: flex-start;
}
.btn {
	width: auto;
	padding: 0 1.5rem;
}
</style>
