<template>
	<div v-if="page">
		<!-- Современный заголовок страницы как на странице новостей -->
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>

		<!-- Сетка партнеров -->
		<section class="section">
			<div class="partners-grid">
				<div v-for="partner in partners" :key="partner.id" class="partner-card" @click="openPartnerModal(partner)">
					<div class="partner-card-media">
						<NuxtImg
							v-if="partner.logo"
							class="partner-card-image"
							:src="resolveImage(partner.logo)"
							:alt="partner.alt || (language === 'RU' ? partner.name : partner.name_en || partner.name)"
							fit="contain"
							background="ffffff"
							width="220"
							height="140" />
					</div>
					<div class="partner-card-body">
						<h3 class="partner-card-title">{{ language === 'RU' ? partner.name : partner.name_en || partner.name }}</h3>
					</div>
				</div>
			</div>
		</section>

		<!-- Модалка партнера -->
		<EntityModal v-model="isModalOpen" :entity="selectedPartner" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import EntityModal from '~/components/EntityModal.vue'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

// Типы для партнеров
interface Partner {
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

const { data: pageData } = await useFetch(`${config.public.apiBase}page/7/`)
const { data: partnersData } = await useFetch(`${config.public.apiBase}partner/`)

const page = computed(() => (Array.isArray(pageData.value) && pageData.value.length > 0 ? pageData.value[0] : null))
useSeoFromPage(page, language)

const partners = computed(() => (partnersData.value as Partner[]) || [])

// Состояние модалки
const isModalOpen = ref(false)
const selectedPartner = ref<Partner>({
	id: 0,
	name: '',
})

// Открытие модалки
const openPartnerModal = (partner: Partner) => {
	selectedPartner.value = partner
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
	color: #0f172a;
}

/* Сетка партнеров */
.partners-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.75rem;
	align-items: stretch;
	width: 100%;
	box-sizing: border-box;
}

/* Карточка партнера */
.partner-card {
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

.partner-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
	border-color: rgba(14, 165, 233, 0.25);
}

/* Медиа-блок */
.partner-card-media {
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

.partner-card-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	max-width: 100%; /* Ограничение максимальной ширины */
	max-height: 100%; /* Ограничение максимальной высоты */
	transition: transform 0.3s ease;
}

.partner-card:hover .partner-card-image {
	transform: scale(1.05);
}

/* Тело карточки */
.partner-card-body {
	padding: 1rem 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.partner-card-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: #0f172a;
	line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}
	
	.partners-grid {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.25rem;
	}
	
	.partner-card-media {
		height: 140px;
	}
}
</style>
