import { defineStore } from 'pinia'

export const useClientsStore = defineStore('clients', () => {
	const config = useRuntimeConfig()
	const clients = ref<any[]>([])

	const loadClients = async () => {
		clients.value = await $fetch<any[]>(`${config.public.apiBase}client/`)
		return clients.value
	}

	return {
		clients,
		loadClients,
	}
})
