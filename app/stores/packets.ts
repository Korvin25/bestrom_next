import { defineStore } from 'pinia'

export const usePacketsStore = defineStore('packets', () => {
	const config = useRuntimeConfig()
	const packets = ref<any[]>([])
	const packetsOptions = ref<any[]>([])
	const packetsSeams = ref<any[]>([])

	const loadPackets = async () => {
		packets.value = await $fetch<any[]>(`${config.public.apiBase}packets/`)
		return packets.value
	}

	const loadPacketsOptions = async () => {
		packetsOptions.value = await $fetch<any[]>(`${config.public.apiBase}packetoptions/`)
		return packetsOptions.value
	}

	const loadPacketsSeams = async () => {
		packetsSeams.value = await $fetch<any[]>(`${config.public.apiBase}packetseams/`)
		return packetsSeams.value
	}

	return {
		packets,
		packetsOptions,
		packetsSeams,
		loadPackets,
		loadPacketsOptions,
		loadPacketsSeams,
	}
})
