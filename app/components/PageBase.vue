<template>
	<div v-if="page" class="page-base">
		<section v-if="showHero" class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>
		<PageBlocks v-if="page.blocks?.length" :blocks="page.blocks" :language="language" :media-base="mediaBase" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia';
import { useSeoFromPage } from '~/composables/useSeoFromPage';
import { useAppStore } from '~/stores/app';

const props = withDefaults(
	defineProps<{
		pageId: number
		showHero?: boolean
	}>(),
	{
		showHero: true,
	},
)

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()

type PageBaseData = {
	title?: string
	title_en?: string
	description?: string
	description_en?: string
	blocks?: any[]
}

const { data: pageData } = await useFetch<PageBaseData[]>(`${config.public.apiBase}page/${props.pageId}/`)
const page = computed<PageBaseData | null>(() => pageData.value?.[0] ?? null)
useSeoFromPage(page, language)

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)
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
	color: #2fc1ff;
	line-height: 1.2;
}

@media (max-width: 768px) {
	.page-title {
		font-size: 2rem;
	}
}
</style>
