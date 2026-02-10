<template>
	<div class="sitemap-page">
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? 'Карта сайта' : 'Sitemap' }}</h1>
		</section>
		<div class="sitemap card-shadow">
			<ul>
				<li v-for="route in staticRoutes" :key="route.path">
					<NuxtLink :to="route.path">{{ language === 'RU' ? route.labelRu : route.labelEn }}</NuxtLink>
				</li>
			</ul>
			<h3>{{ language === 'RU' ? 'Новости' : 'News' }}</h3>
			<ul>
				<li v-for="item in news" :key="item.id">
					<NuxtLink :to="`/news/${item.slug}`">{{ language === 'RU' ? item.name : item.name_en || item.name }}</NuxtLink>
				</li>
			</ul>
			<h3>{{ language === 'RU' ? 'Каталог' : 'Catalog' }}</h3>
			<ul>
				<li v-for="item in products" :key="item.id">
					<NuxtLink :to="`/catalog/machine/${item.slug}`">{{ language === 'RU' ? item.name : item.name_en || item.name }}</NuxtLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup async>
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const { language } = storeToRefs(appStore)
const config = useRuntimeConfig()

const staticRoutes = [
	{ path: '/', labelRu: 'Главная', labelEn: 'Main page' },
	{ path: '/about', labelRu: 'О компании', labelEn: 'About company' },
	{ path: '/about/history', labelRu: 'История', labelEn: 'History' },
	{ path: '/news', labelRu: 'Новости', labelEn: 'News' },
	{ path: '/cutting', labelRu: 'Раскрой пакета', labelEn: 'Cutting' },
	{ path: '/jobs', labelRu: 'Вакансии', labelEn: 'Vacancies' },
	{ path: '/partners', labelRu: 'Партнеры', labelEn: 'Partners' },
	{ path: '/clients', labelRu: 'Клиенты', labelEn: 'Clients' },
	{ path: '/catalog', labelRu: 'Каталог', labelEn: 'Catalog' },
	{ path: '/politic', labelRu: 'Политика конфиденциальности', labelEn: 'Privacy policy' },
	{ path: '/requisites', labelRu: 'Реквизиты', labelEn: 'Requisites' },
	{ path: '/sitemap', labelRu: 'Карта сайта', labelEn: 'Sitemap' },
]

const { data: newsData } = await useFetch(`${config.public.apiBase}news/`)
const { data: productData } = await useFetch(`${config.public.apiBase}product/`)

const news = computed(() => newsData.value || [])
const products = computed(() => productData.value || [])

useSeoMeta({
	title: computed(() => (language.value === 'RU' ? 'Карта сайта' : 'Sitemap')),
})

const { setBreadcrumbs } = useBreadcrumbs()

const updateBreadcrumbs = () => {
	setBreadcrumbs([
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Карта сайта' : 'Sitemap', to: '/sitemap' },
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
.page-header {
	margin-top: 1rem;
	margin-bottom: 2rem;
}

.page-title {
	margin: 0;
	font-size: 2.5rem;
	font-weight: 700;
	color: #0f172a;
	line-height: 1.2;
}

@media (max-width: 768px) {
	.page-title {
		font-size: 2rem;
	}
}

.sitemap {
	padding: 1.5rem;
}
.sitemap ul {
	margin: 0 0 1.5rem 0;
	padding-left: 0; /* Убираем дефолтный отступ */
	list-style: none; /* Убираем дефолтные маркеры */
}

.sitemap li {
	margin-bottom: 0.5rem;
}

.sitemap a {
	color: #0ea5e9; /* Основной цвет ссылок (sky-500) */
	text-decoration: none;
	font-weight: 500;
	transition: all 0.2s ease;
	display: inline-block;
}

.sitemap a:hover {
	color: #0284c7; /* Цвет при наведении (sky-700) */
	text-decoration: underline;
	transform: translateX(4px); /* Небольшой сдвиг вправо для эффекта */
}

.sitemap h3 {
	margin-top: 2rem;
	margin-bottom: 1rem;
	font-size: 1.5rem;
	font-weight: 600;
	color: #0f172a;
	border-bottom: 1px solid #e2e8f0;
	padding-bottom: 0.5rem;
}
</style>
