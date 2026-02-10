import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
	const config = useRuntimeConfig()
	const language = ref<'RU' | 'EN'>('RU')

	const server = computed(() => config.public.apiBase)
	const serverMedia = computed(() => config.public.mediaBase)
	const serverRaskroy = computed(() => config.public.raskroyBase)

	const toggleLanguage = () => {
		language.value = language.value === 'RU' ? 'EN' : 'RU'
	}

	return {
		language,
		server,
		serverMedia,
		serverRaskroy,
		toggleLanguage,
	}
})
