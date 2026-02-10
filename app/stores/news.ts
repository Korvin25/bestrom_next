import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', () => {
	const config = useRuntimeConfig()
	const allNews = ref<any[]>([])
	const titleNews = ref<any | null>(null)
	const secondNews = ref<any[]>([])
	const otherNews = ref<any[]>([])

	const loadNews = async () => {
		const data = await $fetch<any[]>(`${config.public.apiBase}news/`)
		const prepared = data
			.filter((item) => new Date(item.published) < new Date())
			.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())

		allNews.value = prepared
		titleNews.value = prepared[0] || null
		secondNews.value = prepared.slice(1, 3)
		otherNews.value = prepared.slice(3)
		return prepared
	}

	return {
		allNews,
		titleNews,
		secondNews,
		otherNews,
		loadNews,
	}
})
