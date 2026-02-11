<template>
	<div v-if="page">
		<!-- Заголовок страницы -->
		<section class="page-header">
			<h1 class="page-title">{{ language === 'RU' ? page.title : page.title_en || page.title }}</h1>
		</section>

		<!-- Список вакансий -->
		<section v-if="jobs.length" class="section">
			<div class="jobs-grid">
				<JobCard v-for="job in jobs" :key="job.id" :job="job" />
			</div>
		</section>

		<!-- Пустое состояние -->
		<section v-else class="section empty-state">
			<div class="empty-state-card card-shadow">
				<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M32 20V32L40 40" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<h3>{{ language === 'RU' ? 'Вакансий нет' : 'No vacancies' }}</h3>
				<p>{{ language === 'RU' ? 'В данный момент открытых вакансий нет. Проверьте позже.' : 'There are no open vacancies at the moment. Check back later.' }}</p>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import JobCard from '~/components/JobCard.vue'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

interface Job {
	id: number | string
	name: string
	name_en?: string
	img?: string
	alt?: string
	requirements?: string
	requirements_en?: string
	skills?: string
	skills_en?: string
	salary?: string
	salary_en?: string
	mini_description?: string
	mini_description_en?: string
	description?: string
	description_en?: string
}

interface Page {
	title: string
	title_en?: string
	description?: string
	description_en?: string
}

const appStore = useAppStore()
const { language } = storeToRefs(appStore)
const config = useRuntimeConfig()

const { data: pageData } = await useFetch<Page[]>(`${config.public.apiBase}page/9/`)
const { data: jobsData } = await useFetch<Job[]>(`${config.public.apiBase}vacancy/`)

const page = computed<any | null>(() => (Array.isArray(pageData.value) && pageData.value.length > 0 ? pageData.value[0] : null))
useSeoFromPage(page, language)

const jobs = computed(() => (jobsData.value as Job[]) || [])
</script>

<style scoped>
/* Заголовок страницы */
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

/* Сетка вакансий */
.jobs-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
	gap: 2rem;
	align-items: stretch;
}

/* Пустое состояние */
.empty-state {
	display: flex;
	justify-content: center;
	padding: 4rem 1rem;
}

.empty-state-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 3rem 2rem;
	background: #ffffff;
	border-radius: 18px;
	max-width: 500px;
	gap: 1rem;
}

.empty-state-card svg {
	opacity: 0.6;
}

.empty-state-card h3 {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 700;
	color: #2fc1ff;
}

.empty-state-card p {
	margin: 0;
	font-size: 1rem;
	color: #64748b;
	line-height: 1.6;
}

/* Адаптивность */
@media (max-width: 768px) {
	.page-title {
		font-size: 2rem;
	}

	.page-description {
		font-size: 1rem;
	}

	.jobs-grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.empty-state-card {
		padding: 2rem 1.5rem;
	}
}
</style>
