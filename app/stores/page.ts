import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', () => {
	const config = useRuntimeConfig()
	const pageId = ref<any[]>([])

	const loadPage = async (id: number) => {
		const data = await $fetch<any[]>(`${config.public.apiBase}page/${id}/`)
		pageId.value = data
		return data
	}

	return {
		pageId,
		loadPage,
	}
})
