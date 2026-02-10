import { defineStore } from 'pinia'

export const useVacancyStore = defineStore('vacancy', () => {
	const config = useRuntimeConfig()
	const vacancy = ref<any[]>([])

	const loadVacancy = async () => {
		vacancy.value = await $fetch<any[]>(`${config.public.apiBase}vacancy/`)
		return vacancy.value
	}

	return {
		vacancy,
		loadVacancy,
	}
})
