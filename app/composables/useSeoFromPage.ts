import { useRoute } from '#imports'

type PageEntity = {
	title?: string
	title_en?: string
	seo_title?: string
	seo_title_en?: string
	description?: string
	description_en?: string
	seo_description?: string
	seo_description_en?: string
}

export const useSeoFromPage = (page: Ref<PageEntity | null>, language: Ref<'RU' | 'EN'>) => {
	const route = useRoute()
	const config = useRuntimeConfig()

	const title = computed(() => {
		const current = page.value
		if (!current) return 'БЕСТРОМ'
		return language.value === 'RU'
			? current.seo_title || current.title || 'БЕСТРОМ'
			: current.seo_title_en || current.title_en || 'BESTROM'
	})

	const description = computed(() => {
		const current = page.value
		if (!current) return ''
		return language.value === 'RU'
			? current.seo_description || current.description || ''
			: current.seo_description_en || current.description_en || ''
	})

	const canonical = computed(() => `${config.public.siteUrl}${route.path}`)

	useSeoMeta({
		title,
		description,
		ogTitle: title,
		ogDescription: description,
		ogUrl: canonical,
		ogType: 'website',
		twitterCard: 'summary_large_image',
	})

	useHead({
		link: [{ rel: 'canonical', href: canonical.value }],
	})
}
