import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
	const config = useRuntimeConfig()
	const history = ref<any[]>([])

	const loadHistory = async () => {
		history.value = await $fetch<any[]>(`${config.public.apiBase}history/`)
		return history.value
	}

	return {
		history,
		loadHistory,
	}
})
