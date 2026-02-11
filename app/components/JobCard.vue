<template>
	<NuxtLink :to="`/jobs/${job.id}`" class="job-card">
		<!-- Изображение вакансии -->
		<div v-if="job.img" class="job-card-image">
			<NuxtImg
				:src="resolveImage(job.img)"
				:alt="job.alt || jobTitle"
				fit="contain"
				background="ffffff"
				width="180"
				height="140" />
		</div>

		<!-- Контент вакансии -->
		<div class="job-card-content">
			<h3 class="job-card-title">{{ jobTitle }}</h3>

			<!-- Требования -->
			<div v-if="job.requirements" class="job-section">
				<h5 class="job-section-title">{{ language === 'RU' ? 'Основные требования:' : 'Primary requirements:' }}</h5>
				<div class="job-section-text" v-html="truncate(job.requirements, 150)" />
			</div>

			<!-- Навыки -->
			<div v-if="job.skills" class="job-section">
				<h5 class="job-section-title">{{ language === 'RU' ? 'Основные навыки:' : 'Basic skills:' }}</h5>
				<div class="job-section-text" v-html="truncate(job.skills, 150)" />
			</div>
		</div>

		<!-- Зарплата и кнопка -->
		<div class="job-card-footer">
			<div v-if="job.salary" class="job-salary">
				<div class="job-salary-label">{{ language === 'RU' ? 'Заработная плата' : 'Salary' }}</div>
				<div class="job-salary-amount">{{ job.salary }}</div>
			</div>
			<div class="job-card-action">
				{{ language === 'RU' ? 'Подробнее' : 'More details' }}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
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
}

const props = defineProps<{
	job: Job
}>()

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const jobTitle = computed(() => {
	return language.value === 'RU' 
		? props.job.name 
		: props.job.name_en || props.job.name
})

// Функция для обрезки HTML текста
const truncate = (html: string, maxLength: number) => {
	if (!html) return ''
	const text = html.replace(/<[^>]*>/g, '')
	if (text.length <= maxLength) return html
	return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.job-card {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 18px;
	border: 1px solid rgba(16, 24, 40, 0.06);
	box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	height: 100%;
}

.job-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
	border-color: rgba(14, 165, 233, 0.25);
}

/* Изображение */
.job-card-image {
	width: 100%;
	background: #ffffff;
	height: 180px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(16, 24, 40, 0.06);
}

.job-card-image img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	transition: transform 0.3s ease;
}

.job-card:hover .job-card-image img {
	transform: scale(1.05);
}

/* Контент */
.job-card-content {
	flex: 1;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.job-card-title {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 700;
	color: #2fc1ff;
	line-height: 1.4;
	padding-bottom: 0.75rem;
	border-bottom: 2px solid #0ea5e9;
}

/* Секции */
.job-section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.job-section-title {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 600;
	color: #2fc1ff;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.job-section-text {
	font-size: 0.875rem;
	color: #64748b;
	line-height: 1.6;
}

.job-section-text :deep(ul) {
	margin: 0;
	padding-left: 1.25rem;
}

.job-section-text :deep(li) {
	margin-bottom: 0.25rem;
}

/* Футер с зарплатой */
.job-card-footer {
	padding: 1.5rem;
	border-top: 1px solid rgba(16, 24, 40, 0.06);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background: linear-gradient(to bottom, rgba(14, 165, 233, 0.02), rgba(14, 165, 233, 0.05));
}

.job-salary {
	text-align: center;
}

.job-salary-label {
	font-size: 0.75rem;
	font-weight: 600;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-bottom: 0.25rem;
}

.job-salary-amount {
	font-size: 1.75rem;
	font-weight: 700;
	color: #0ea5e9;
	line-height: 1.2;
}

/* Кнопка действия */
.job-card-action {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: #0ea5e9;
	color: #ffffff;
	border-radius: 999px;
	font-weight: 600;
	font-size: 0.875rem;
	transition: background 0.2s ease, transform 0.2s ease;
}

.job-card:hover .job-card-action {
	background: #0284c7;
	transform: translateX(4px);
}

.job-card-action svg {
	transition: transform 0.2s ease;
}

.job-card:hover .job-card-action svg {
	transform: translateX(2px);
}

/* Адаптивность */
@media (max-width: 768px) {
	.job-card-image {
		height: 140px;
		padding: 1rem;
	}

	.job-card-title {
		font-size: 1.125rem;
	}

	.job-salary-amount {
		font-size: 1.5rem;
	}
}
</style>
