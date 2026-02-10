import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filters', () => {
	const config = useRuntimeConfig()
	const filters = ref<any[]>([])
	const selectedFilter = ref<any | null>(null)

	const loadFilters = async () => {
		const data = await $fetch<any[]>(`${config.public.apiBase}filters/`)
		filters.value = data.sort((a, b) => a.sort - b.sort)
		return filters.value
	}

	const setSelectedFilter = (filter: any) => {
		selectedFilter.value = filter
	}

	return {
		filters,
		selectedFilter,
		loadFilters,
		setSelectedFilter,
	}
})
