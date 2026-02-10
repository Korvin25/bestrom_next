<template>
	<div v-if="page">
		<!-- Современный заголовок страницы -->
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>

		<!-- Сетка новостей -->
		<section class="section">
			<div class="news-grid">
				<NuxtLink v-for="item in news" :key="item.id" :to="`/news/${item.slug}`" class="news-card">
					<div class="news-card-media">
						<NuxtImg
							v-if="item.img"
							class="news-card-image"
							:src="resolveImage(item.img)"
							:alt="language === 'RU' ? item.name : item.name_en || item.name"
							fit="contain"
							background="ffffff"
							width="420"
							height="260" />
					</div>
					<div class="news-card-body">
						<h3 class="news-card-title">{{ language === 'RU' ? item.name : item.name_en || item.name }}</h3>
						<div class="news-card-divider"></div>
						<div class="news-card-description" v-html="language === 'RU' ? item.mini_description : item.mini_description_en || item.mini_description"></div>
						<span class="news-card-action">{{ language === 'RU' ? 'ЧИТАТЬ ДАЛЕЕ' : 'READ MORE' }}</span>
					</div>
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

// Типы для новостей
interface NewsItem {
	id: number | string
	slug: string
	name: string
	name_en?: string
	mini_description?: string
	mini_description_en?: string
	img?: string
	published: string
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

const { data: pageData } = await useFetch(`${config.public.apiBase}page/6/`)
const { data: newsData } = await useFetch(`${config.public.apiBase}news/`)

const page = computed(() => (Array.isArray(pageData.value) && pageData.value.length > 0 ? pageData.value[0] : null))
useSeoFromPage(page, language)

const news = computed(() => {
	const items = (newsData.value as NewsItem[]) || []
	const now = new Date()
	return items
		.filter((item) => new Date(item.published) < now)
		.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
})

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)
const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const { setBreadcrumbs } = useBreadcrumbs()

const updateBreadcrumbs = () => {
	setBreadcrumbs([
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Новости' : 'News', to: '/news' },
	])
}

onMounted(() => {
	updateBreadcrumbs()
})

watch(language, () => {
	updateBreadcrumbs()
})
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

/* Сетка новостей */
.news-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.75rem;
	align-items: stretch;
	width: 100%;
	box-sizing: border-box;
}

/* Карточка новости */
.news-card {
	padding: 0;
	border-radius: 18px;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border: 1px solid rgba(16, 24, 40, 0.06);
	box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	text-decoration: none;
	color: inherit;
	overflow: hidden;
	height: 100%;
}

.news-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
	border-color: rgba(14, 165, 233, 0.25);
}

/* Медиа-блок */
.news-card-media {
	position: relative;
	width: 100%;
	height: 260px;
	overflow: hidden;
	background: #f8fafc;
	display: flex;
	align-items: center;
	justify-content: center;
}

.news-card-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	transition: transform 0.3s ease;
}

.news-card:hover .news-card-image {
	transform: scale(1.05);
}

/* Тело карточки */
.news-card-body {
	padding: 1.5rem 1.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	flex: 1;
}

.news-card-title {
	margin: 0;
	font-size: 1.1rem;
	font-weight: 600;
	color: #0f172a;
	line-height: 1.4;
}

.news-card-divider {
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, rgba(14, 165, 233, 0.35) 0%, rgba(14, 165, 233, 0) 100%);
	margin: 0.25rem 0 0.5rem;
}

.news-card-description {
	margin: 0;
	color: #475569;
	font-size: 0.95rem;
	line-height: 1.5;
	flex: 1;
}

.news-card-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem 1.2rem;
	border-radius: 999px;
	background: #38bdf8;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.85rem;
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.35);
	margin-top: auto;
	transition: background 0.2s ease, transform 0.2s ease;
	align-self: flex-start;
}

.news-card:hover .news-card-action {
	background: #0ea5e9;
	transform: translateX(4px);
}

/* Адаптивность */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}
	
	.page-description {
		font-size: 0.95rem;
	}
	
	.news-grid {
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
	
	.news-card-media {
		height: 200px;
	}
}
</style>
