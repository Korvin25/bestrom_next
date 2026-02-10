<template>
	<div v-if="page" class="politic-page">
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>

		<div
			class="policy-content card-shadow"
			v-html="language === 'RU'
				? page.blocks?.[0]?.contents?.[0]?.text
				: (page.blocks?.[0]?.contents?.[0]?.text_en || page.blocks?.[0]?.contents?.[0]?.text)">
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const { language } = storeToRefs(appStore)
const config = useRuntimeConfig()

// Типы данных (примерные, на основе использования)
interface PageContent {
	text?: string
	text_en?: string
}

interface PageBlock {
	contents?: PageContent[]
}

interface PageData {
	title: string
	title_en?: string
	description?: string
	description_en?: string
	blocks?: PageBlock[]
}

const { data: pageData } = await useFetch<PageData[]>(`${config.public.apiBase}page/12/`)
const page = computed<PageData | null>(() => pageData.value?.[0] ?? null)

useSeoFromPage(page, language)
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

.policy-content {
	padding: 2rem;
	line-height: 1.6;
	font-size: 16px;
	white-space: pre-line; /* Важно для сохранения переносов строк */
	background: #ffffff;
	border-radius: 18px;
	margin-bottom: 2rem; /* Отступ снизу, как у блоков */
}

@media (max-width: 980px) {
	.policy-content {
		padding: 1rem;
		font-size: 14px;
	}
}
</style>
