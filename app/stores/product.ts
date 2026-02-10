import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
	const config = useRuntimeConfig()
	const products = ref<any[]>([])

	const loadProducts = async () => {
		products.value = await $fetch<any[]>(`${config.public.apiBase}product/`)
		return products.value
	}

	return {
		products,
		loadProducts,
	}
})
