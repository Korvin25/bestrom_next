import { defineStore } from 'pinia'

export const usePartnersStore = defineStore('partners', () => {
	const config = useRuntimeConfig()
	const partners = ref<any[]>([])

	const loadPartners = async () => {
		partners.value = await $fetch<any[]>(`${config.public.apiBase}partner/`)
		return partners.value
	}

	return {
		partners,
		loadPartners,
	}
})
