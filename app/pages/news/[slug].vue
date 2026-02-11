<template>
	<div v-if="newsItem" class="news-detail" itemscope itemtype="http://schema.org/NewsArticle">
		<!-- Заголовок новости -->
		<section class="news-header">
			<h1 class="news-title" itemprop="headline">{{ language === 'RU' ? newsItem.name : newsItem.name_en || newsItem.name }}</h1>
			<div class="news-meta">
				<span class="news-date" itemprop="datePublished" :content="newsItem.published">{{ formatDate(newsItem.published) }}</span>
			</div>
		</section>

		<!-- Изображение новости -->
		<div v-if="newsItem.img" class="news-image-wrapper">
			<NuxtImg
				class="news-image"
				:src="resolveImage(newsItem.img)"
				:alt="language === 'RU' ? newsItem.name : newsItem.name_en || newsItem.name"
				fit="contain"
				background="ffffff"
				width="920"
				height="520"
				itemprop="image" />
		</div>

		<!-- Контент новости -->
		<article class="news-content-card" itemprop="articleBody">
			<div class="news-content" v-html="newsContent" />
		</article>

		<!-- Последние новости -->
		<section v-if="latestNews.length > 0" class="latest-news-section">
			<h2 class="latest-news-title">{{ language === 'RU' ? 'Последние новости' : 'Latest News' }}</h2>
			<div class="latest-news-grid">
				<NuxtLink
					v-for="item in latestNews"
					:key="item.id"
					:to="`/news/${item.slug}`"
					class="latest-news-card">
					<div class="latest-news-image-wrapper">
						<NuxtImg
							v-if="item.img"
							class="latest-news-image"
							:src="resolveImage(item.img)"
							:alt="language === 'RU' ? item.name : item.name_en || item.name"
							fit="contain"
							background="ffffff"
							width="360"
							height="220" />
					</div>
					<div class="latest-news-body">
						<h3 class="latest-news-card-title">{{ language === 'RU' ? item.name : item.name_en || item.name }}</h3>
						<span class="latest-news-date">{{ formatDate(item.published) }}</span>
					</div>
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

// Типы для новости
interface NewsItem {
	id: number | string
	slug: string
	name: string
	name_en?: string
	mini_description?: string
	mini_description_en?: string
	description?: string
	description_en?: string
	img?: string
	published: string
	seo_title?: string
	seo_title_en?: string
	seo_description?: string
	seo_description_en?: string
}

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()
const route = useRoute()

const { data: newsData } = await useFetch(`${config.public.apiBase}news/`)

const newsItem = computed(() => ((newsData.value as NewsItem[]) || []).find((item) => item.slug === route.params.slug))
const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

// Последние новости (исключая текущую новость)
const latestNews = computed(() => {
	const allNews = (newsData.value as NewsItem[]) || []
	const now = new Date()
	return allNews
		.filter((item) => item.slug !== route.params.slug && new Date(item.published) < now)
		.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
		.slice(0, 3)
})

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const newsContent = computed(() => {
	if (!newsItem.value) return ''
	const html = language.value === 'RU' ? newsItem.value.description : newsItem.value.description_en || newsItem.value.description
	return (html || '').replaceAll('src="/', `src="${mediaBase.value}`)
})

const formatDate = (value: string) => {
	if (!value) return ''
	const date = new Date(value)
	return date.toLocaleDateString(language.value === 'RU' ? 'ru-RU' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

useSeoMeta({
	title: computed(() =>
		newsItem.value
			? language.value === 'RU'
				? newsItem.value.seo_title || newsItem.value.name
				: newsItem.value.seo_title_en || newsItem.value.name_en || newsItem.value.name
			: 'БЕСТРОМ',
	),
	description: computed(() =>
		newsItem.value
			? language.value === 'RU'
				? newsItem.value.seo_description || newsItem.value.mini_description
				: newsItem.value.seo_description_en || newsItem.value.mini_description_en || newsItem.value.mini_description
			: '',
	),
})

const jsonLd = computed(() => {
	if (!newsItem.value) return null

	return {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		"headline": language.value === 'RU' ? newsItem.value.name : newsItem.value.name_en || newsItem.value.name,
		"image": [resolveImage(newsItem.value.img)],
		"datePublished": newsItem.value.published,
		"dateModified": newsItem.value.published,
		"author": {
			"@type": "Organization",
			"name": "Bestrom",
			"url": config.public.siteUrl
		}
	}
})

useHead({
	script: [
		{
			type: 'application/ld+json',
			innerHTML: computed(() => jsonLd.value ? JSON.stringify(jsonLd.value) : '')
		}
	]
})

const { setBreadcrumbs } = useBreadcrumbs()

const updateBreadcrumbs = () => {
	setBreadcrumbs([
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Новости' : 'News', to: '/news' },
		{ label: language.value === 'RU' ? newsItem.value?.name || '' : newsItem.value?.name_en || newsItem.value?.name || '', to: route.path },
	])
}

onMounted(() => {
	updateBreadcrumbs()
})

watch([language, newsItem], () => {
	updateBreadcrumbs()
})
</script>

<style scoped>
.news-detail {
	max-width: 920px;
	margin: 0 auto;
}

/* Заголовок новости */
.news-header {
	margin-top: 2.5rem;
	margin-bottom: 2rem;
}

.news-title {
	margin: 0 0 0.75rem 0;
	font-size: 2.5rem;
	font-weight: 700;
	color: #2fc1ff;
	line-height: 1.2;
}

.news-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-top: 0.75rem;
}

.news-date {
	display: inline-flex;
	align-items: center;
	font-size: 0.95rem;
	color: #64748b;
	font-weight: 500;
}

.news-date::before {
	content: '📅';
	margin-right: 0.5rem;
	font-size: 1rem;
}

/* Изображение новости */
.news-image-wrapper {
	margin-bottom: 2.5rem;
	border-radius: 18px;
	overflow: hidden;
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
	background: #f8fafc;
}

.news-image {
	width: 100%;
	height: auto;
	display: block;
	object-fit: contain;
}

/* Карточка контента */
.news-content-card {
	background: #ffffff;
	border: 1px solid rgba(16, 24, 40, 0.06);
	border-radius: 18px;
	box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
	padding: 2.5rem 3rem;
	margin-bottom: 3rem;
}

/* Стили контента */
.news-content :deep(p) {
	margin: 0 0 1.25rem 0;
	color: #334155;
	font-size: 1.05rem;
	line-height: 1.7;
}

.news-content :deep(p:last-child) {
	margin-bottom: 0;
}

.news-content :deep(h1),
.news-content :deep(h2),
.news-content :deep(h3) {
	margin: 2rem 0 1rem 0;
	color: #2fc1ff;
	font-weight: 700;
	line-height: 1.3;
}

.news-content :deep(h1) {
	font-size: 2rem;
}

.news-content :deep(h2) {
	font-size: 1.65rem;
}

.news-content :deep(h3) {
	font-size: 1.35rem;
}

.news-content :deep(h1:first-child),
.news-content :deep(h2:first-child),
.news-content :deep(h3:first-child) {
	margin-top: 0;
}

.news-content :deep(ul),
.news-content :deep(ol) {
	margin: 1.25rem 0;
	padding-left: 1.75rem;
	color: #334155;
	line-height: 1.7;
}

.news-content :deep(li) {
	margin-bottom: 0.5rem;
}

.news-content :deep(img) {
	max-width: 100%;
	height: auto;
	border-radius: 12px;
	margin: 1.5rem 0;
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.news-content :deep(a) {
	color: #0ea5e9;
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s ease;
}

.news-content :deep(a:hover) {
	color: #0284c7;
	text-decoration: underline;
}

.news-content :deep(blockquote) {
	margin: 1.5rem 0;
	padding: 1rem 1.5rem;
	border-left: 4px solid #0ea5e9;
	background: #f0f9ff;
	border-radius: 0 8px 8px 0;
	color: #334155;
	font-style: italic;
}

.news-content :deep(code) {
	background: #f1f5f9;
	padding: 0.2rem 0.4rem;
	border-radius: 4px;
	font-family: 'Courier New', monospace;
	font-size: 0.9em;
	color: #be185d;
}

.news-content :deep(pre) {
	background: #1e293b;
	color: #e2e8f0;
	padding: 1.5rem;
	border-radius: 12px;
	overflow-x: auto;
	margin: 1.5rem 0;
}

	.news-content :deep(pre code) {
		background: transparent;
		color: inherit;
		padding: 0;
	}

	/* Секция последних новостей */
	.latest-news-section {
		margin-top: 3rem;
		margin-bottom: 3rem;
	}

	.latest-news-title {
		margin: 0 0 1.5rem 0;
		font-size: 1.75rem;
		font-weight: 700;
		color: #2fc1ff;
	}

	.latest-news-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.5rem;
	}

	.latest-news-card {
		display: flex;
		flex-direction: column;
		background: #ffffff;
		border: 1px solid rgba(16, 24, 40, 0.06);
		border-radius: 16px;
		box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
	}

	.latest-news-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
		border-color: rgba(14, 165, 233, 0.25);
	}

	.latest-news-image-wrapper {
		position: relative;
		width: 100%;
		height: 180px;
		overflow: hidden;
		background: #f8fafc;
	}

	.latest-news-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.latest-news-card:hover .latest-news-image {
		transform: scale(1.08);
	}

	.latest-news-body {
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.latest-news-card-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #2fc1ff;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.latest-news-date {
		font-size: 0.85rem;
		color: #64748b;
		margin-top: auto;
	}

	/* Адаптивность */
	@media (max-width: 1024px) {
		.news-content-card {
			padding: 2rem 2.5rem;
		}

		.latest-news-grid {
			grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		}
	}

@media (max-width: 768px) {
	.news-title {
		font-size: 1.85rem;
	}

	.news-content-card {
		padding: 1.5rem 1.75rem;
	}

	.news-content :deep(p) {
		font-size: 1rem;
	}

	.news-content :deep(h1) {
		font-size: 1.65rem;
	}

	.news-content :deep(h2) {
		font-size: 1.4rem;
	}

	.news-content :deep(h3) {
		font-size: 1.2rem;
	}
}

@media (max-width: 480px) {
	.news-title {
		font-size: 1.5rem;
	}

	.news-content-card {
		padding: 1.25rem 1.25rem;
	}
}
</style>

