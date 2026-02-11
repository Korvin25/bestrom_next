<template>
	<div v-if="page">
		<!-- Современный заголовок страницы как на странице новостей -->
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>

		<!-- Сетка клиентов -->
		<section class="section">
			<div class="clients-grid">
				<div v-for="client in clients" :key="client.id" class="client-card" @click="openClientModal(client)">
					<div class="client-card-media">
						<NuxtImg
							v-if="client.logo"
							class="client-card-image"
							:src="resolveImage(client.logo)"
							:alt="client.alt || (language === 'RU' ? client.name : client.name_en || client.name)"
							fit="contain"
							background="ffffff"
							width="220"
							height="140" />
					</div>
					<div class="client-card-body">
						<h3 class="client-card-title">{{ language === 'RU' ? client.name : client.name_en || client.name }}</h3>
					</div>
				</div>
			</div>
		</section>

		<!-- Модалка клиента -->
		<EntityModal v-model="isModalOpen" :entity="selectedClient" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import EntityModal from '~/components/EntityModal.vue'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

// Типы для клиентов
interface Client {
	id: number | string
	name: string
	name_en?: string
	logo?: string
	alt?: string
	description?: string
	description_en?: string
}

interface PageItem {
	title: string
	title_en?: string
	description?: string
	description_en?: string
}

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()

const { data: pageData } = await useFetch(`${config.public.apiBase}page/8/`)
const { data: clientsData } = await useFetch(`${config.public.apiBase}client/`)

const page = computed(() => (Array.isArray(pageData.value) && pageData.value.length > 0 ? pageData.value[0] : null))
useSeoFromPage(page, language)

const clients = computed(() => (clientsData.value as Client[]) || [])

// Состояние модалки
const isModalOpen = ref(false)
const selectedClient = ref<Client>({
	id: 0,
	name: '',
})

// Открытие модалки
const openClientModal = (client: Client) => {
	selectedClient.value = client
	isModalOpen.value = true
}

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)
const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}
</script>

<style scoped>
/* Заголовок страницы */
.page-header {
	margin-top: 2.5rem;
	margin-bottom: 2rem;
	text-align: left;
	padding: 0;
}

.page-title {
	margin: 0;
	font-size: 2.25rem;
	font-weight: 700;
	color: #2fc1ff;
}

/* Сетка клиентов */
.clients-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.75rem;
	align-items: stretch;
	width: 100%;
	box-sizing: border-box;
}

/* Карточка клиента */
.client-card {
	padding: 0;
	border-radius: 18px;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	background: #ffffff;
	border: 1px solid rgba(16, 24, 40, 0.06);
	box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	overflow: hidden;
	height: 100%;
}

.client-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
	border-color: rgba(14, 165, 233, 0.25);
}

/* Медиа-блок */
.client-card-media {
	position: relative;
	width: 100%;
	background: #ffffff; /* Белый фон для логотипов */
	height: 200px; /* Увеличена высота для полного отображения логотипов */
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem; /* Увеличен padding для предотвращения обрезки */
	box-sizing: border-box;
}

.client-card-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	max-width: 100%; /* Ограничение максимальной ширины */
	max-height: 100%; /* Ограничение максимальной высоты */
	transition: transform 0.3s ease;
}

.client-card:hover .client-card-image {
	transform: scale(1.05);
}

/* Тело карточки */
.client-card-body {
	padding: 1rem 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.client-card-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: #2fc1ff;
	line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}
	
	.clients-grid {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.25rem;
	}
	
	.client-card-media {
		height: 140px;
	}
}
</style>
