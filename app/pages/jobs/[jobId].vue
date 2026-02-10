<template>
	<div v-if="job" class="job-detail">
		<!-- Заголовок с изображением -->
		<section class="job-header card-shadow">
			<div v-if="job.img" class="job-header-image">
				<NuxtImg
					:src="resolveImage(job.img)"
					:alt="job.alt || jobTitle"
					fit="contain"
					background="ffffff"
					width="200"
					height="160" />
			</div>
			<div class="job-header-content">
				<h1 class="job-header-title">{{ jobTitle }}</h1>
				<div v-if="job.salary" class="job-header-salary">
					<span class="job-header-salary-label">{{ language === 'RU' ? 'Заработная плата:' : 'Salary:' }}</span>
					<span class="job-header-salary-amount">{{ job.salary }}</span>
				</div>
			</div>
		</section>

		<!-- Краткое описание -->
		<section v-if="miniDescription" class="section job-mini-description card-shadow">
			<div v-html="miniDescription" />
		</section>

		<!-- Требования -->
		<section v-if="job.requirements || job.requirements_en" class="section card-shadow">
			<h2 class="section-title">{{ language === 'RU' ? 'Основные требования' : 'Primary requirements' }}</h2>
			<div class="section-content" v-html="language === 'RU' ? job.requirements : job.requirements_en || job.requirements" />
		</section>

		<!-- Навыки -->
		<section v-if="job.skills || job.skills_en" class="section card-shadow">
			<h2 class="section-title">{{ language === 'RU' ? 'Основные навыки' : 'Basic skills' }}</h2>
			<div class="section-content" v-html="language === 'RU' ? job.skills : job.skills_en || job.skills" />
		</section>

		<!-- Полное описание -->
		<section v-if="job.description || job.description_en" class="section card-shadow">
			<h2 class="section-title">{{ language === 'RU' ? 'Описание вакансии' : 'Job description' }}</h2>
			<div class="section-content" v-html="language === 'RU' ? job.description : job.description_en || job.description" />
		</section>

		<!-- Кнопки действий -->
		<section class="job-actions-section">
			<a href="tel:+78005557457" class="btn-action btn-call">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1112 17.2006 18.1856C16.9808 18.26 16.7478 18.2878 16.5167 18.2667C13.9523 17.988 11.489 17.1118 9.32498 15.7084C7.31151 14.4289 5.60443 12.7218 4.32498 10.7084C2.91663 8.53434 2.04019 6.05916 1.76665 3.48337C1.74565 3.25294 1.7733 3.02067 1.84718 2.80139C1.92106 2.58211 2.03963 2.38064 2.19562 2.2096C2.35162 2.03856 2.54149 1.90178 2.75314 1.80764C2.9648 1.7135 3.1936 1.66454 3.42498 1.66504H5.92498C6.32941 1.66116 6.72148 1.80981 7.02812 2.08104C7.33476 2.35226 7.53505 2.72923 7.59165 3.13337C7.69717 3.94204 7.89286 4.73744 8.17498 5.50004C8.2871 5.80736 8.31137 6.14087 8.24491 6.46178C8.17844 6.78269 8.02404 7.07873 7.79998 7.31671L6.74165 8.37504C7.92795 10.4684 9.63165 12.172 11.725 13.3584L12.7833 12.3C13.0213 12.076 13.3173 11.9216 13.6383 11.8551C13.9592 11.7886 14.2927 11.8129 14.6 11.925C15.3626 12.2072 16.158 12.4029 16.9667 12.5084C17.3755 12.5655 17.7563 12.7694 18.0293 13.0814C18.3023 13.3934 18.4482 13.7913 18.4417 14.2L18.3333 14.1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				{{ language === 'RU' ? 'Позвонить' : 'Call' }}
			</a>
			<button class="btn-action btn-respond" @click="showRespondModal">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18.3333 9.23333V10C18.3323 11.797 17.7504 13.5456 16.6744 14.9849C15.5985 16.4242 14.0861 17.4771 12.3628 17.9866C10.6395 18.4961 8.79768 18.4349 7.11202 17.8122C5.42636 17.1894 3.98718 16.0384 3.00912 14.5309C2.03106 13.0234 1.56648 11.24 1.68472 9.44693C1.80296 7.65383 2.49766 5.94694 3.66522 4.58089C4.83278 3.21485 6.41064 2.26282 8.16348 1.86679C9.91632 1.47076 11.7502 1.65195 13.3917 2.38333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M18.3333 3.33337L10 11.675L7.5 9.17504" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				{{ language === 'RU' ? 'Откликнуться' : 'Respond' }}
			</button>
		</section>

		<!-- Кнопка назад -->
		<div class="job-back">
			<NuxtLink to="/jobs" class="btn-back">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				{{ language === 'RU' ? 'Назад к вакансиям' : 'Back to vacancies' }}
			</NuxtLink>
		</div>

		<!-- Модалка отклика -->
		<JobRespondModal
			v-if="isRespondModalOpen"
			:job-name="jobTitle"
			@close="isRespondModalOpen = false" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import JobRespondModal from '~/components/JobRespondModal.vue'
import { useAppStore } from '~/stores/app'

interface Job {
	id: number | string
	name: string
	name_en?: string
	img?: string
	alt?: string
	salary?: string
	salary_en?: string
	requirements?: string
	requirements_en?: string
	skills?: string
	skills_en?: string
	description?: string
	description_en?: string
	mini_description?: string
	mini_description_en?: string
	seo_title?: string
	seo_title_en?: string
	seo_description?: string
	seo_description_en?: string
}

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()
const route = useRoute()

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const { data: jobsData } = await useFetch<Job[]>(`${config.public.apiBase}vacancy/`)

const job = computed(() => (jobsData.value || []).find((item: Job) => String(item.id) === route.params.jobId))

const jobTitle = computed(() => {
	if (!job.value) return ''
	return language.value === 'RU' 
		? job.value.name 
		: job.value.name_en || job.value.name
})

const miniDescription = computed(() => {
	if (!job.value) return ''
	return language.value === 'RU'
		? job.value.mini_description || ''
		: job.value.mini_description_en || job.value.mini_description || ''
})

useSeoMeta({
	title: computed(() =>
		job.value
			? language.value === 'RU'
				? job.value.seo_title || job.value.name
				: job.value.seo_title_en || job.value.name_en || job.value.name
			: 'БЕСТРОМ',
	),
	description: computed(() =>
		job.value
			? language.value === 'RU'
				? job.value.seo_description || job.value.mini_description || ''
				: job.value.seo_description_en || job.value.mini_description_en || job.value.mini_description || ''
			: '',
	),
})

const isRespondModalOpen = ref(false)

const showRespondModal = () => {
	isRespondModalOpen.value = true
}
</script>

<style scoped>
.job-detail {
	padding-top: 2rem;
	padding-bottom: 3rem;
}

/* Заголовок с изображением */
.job-header {
	display: flex;
	align-items: center;
	gap: 2rem;
	padding: 2.5rem;
	background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(14, 165, 233, 0.02));
	border-radius: 18px;
	margin-bottom: 2rem;
	border: 1px solid rgba(14, 165, 233, 0.15);
}

.job-header-image {
	flex-shrink: 0;
	width: 200px;
	height: 160px;
	background: #ffffff;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.job-header-image img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.job-header-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.job-header-title {
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
	color: #0f172a;
	line-height: 1.3;
}

.job-header-salary {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
}

.job-header-salary-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.job-header-salary-amount {
	font-size: 1.75rem;
	font-weight: 700;
	color: #0ea5e9;
}

/* Секции */
.section {
	margin-bottom: 1.5rem;
	padding: 2rem;
	background: #ffffff;
	border-radius: 18px;
	border: 1px solid rgba(16, 24, 40, 0.06);
}

.job-mini-description {
	background: linear-gradient(to bottom, rgba(14, 165, 233, 0.04), rgba(14, 165, 233, 0.01));
	border-left: 4px solid #0ea5e9;
}

.section-title {
	margin: 0 0 1.5rem 0;
	font-size: 1.5rem;
	font-weight: 700;
	color: #0f172a;
	padding-bottom: 0.75rem;
	border-bottom: 2px solid #0ea5e9;
}

.section-content {
	color: #475569;
	font-size: 1rem;
	line-height: 1.7;
}

.section-content :deep(p) {
	margin: 0 0 1rem 0;
}

.section-content :deep(p:last-child) {
	margin-bottom: 0;
}

.section-content :deep(ul),
.section-content :deep(ol) {
	margin: 0 0 1rem 0;
	padding-left: 1.5rem;
}

.section-content :deep(li) {
	margin-bottom: 0.5rem;
}

.section-content :deep(strong) {
	color: #0f172a;
	font-weight: 600;
}

.section-content :deep(a) {
	color: #0ea5e9;
	text-decoration: none;
	transition: color 0.2s ease;
}

.section-content :deep(a:hover) {
	color: #0284c7;
	text-decoration: underline;
}

/* Кнопка назад */
.job-actions {
	margin-top: 2rem;
	display: flex;
	justify-content: center;
}

.btn-back {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.75rem;
	background: #ffffff;
	color: #0ea5e9;
	border: 2px solid #0ea5e9;
	border-radius: 999px;
	font-weight: 600;
	font-size: 1rem;
	text-decoration: none;
	transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.btn-back:hover {
	background: #0ea5e9;
	color: #ffffff;
	transform: translateX(-4px);
}

.btn-back svg {
	transition: transform 0.2s ease;
}

.btn-back:hover svg {
	transform: translateX(-2px);
}

/* Адаптивность */
@media (max-width: 768px) {
	.job-header {
		flex-direction: column;
		text-align: center;
		padding: 2rem 1.5rem;
	}

	.job-header-image {
		width: 160px;
		height: 130px;
	}

	.job-header-title {
		font-size: 1.5rem;
	}

	.job-header-salary {
		flex-direction: column;
		gap: 0.25rem;
	}

	.job-header-salary-amount {
		font-size: 1.5rem;
	}

	.section {
		padding: 1.5rem;
	}

	.section-title {
		font-size: 1.25rem;
	}
}

/* Кнопки действий */
.job-actions-section {
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
}

.btn-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	padding: 1rem 2rem;
	border-radius: 999px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.2s ease;
	cursor: pointer;
	border: none;
	flex: 1;
	min-width: 200px;
}

.btn-call {
	background: #ffffff;
	color: #0ea5e9;
	border: 2px solid #0ea5e9;
	box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.btn-call:hover {
	background: #f0f9ff;
	transform: translateY(-2px);
	box-shadow: 0 8px 16px rgba(14, 165, 233, 0.2);
}

.btn-respond {
	background: #0ea5e9;
	color: #ffffff;
	box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn-respond:hover {
	background: #0284c7;
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
}

.btn-action svg {
	transition: transform 0.2s ease;
}

.btn-action:hover svg {
	transform: scale(1.1);
}

@media (max-width: 480px) {
	.job-actions-section {
		flex-direction: column;
	}
	
	.btn-action {
		width: 100%;
	}
}
</style>
