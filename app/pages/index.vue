<template>
	<div v-if="page" class="home">

		<section class="section activity-section">
			<h2>{{ language === 'RU' ? 'Деятельность компании БЕСТРОМ' : 'Activities of the company BESTROM' }}</h2>
			<div v-if="activityItem" class="activity-card card-shadow">
				<div class="activity-content">
					<h3>{{ activityTitle }}</h3>
					<p class="activity-text">{{ activityText }}</p>
					<NuxtLink class="btn" :to="activityLink">
						{{ language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE' }}
					</NuxtLink>
				</div>
				<div v-if="activityImage" class="activity-image-frame">
					<NuxtImg
						class="activity-image"
						:src="activityImage"
						:alt="activityTitle"
						fit="contain"
						background="ffffff"
						width="420"
						height="320" />
				</div>
			</div>
		</section>

		<section class="section">
			<h2>{{ language === 'RU' ? 'Новости' : 'News' }}</h2>
			<div v-if="news.length" class="news-grid">
				<NuxtLink v-for="item in news.slice(0, 3)" :key="item.id" :to="`/news/${item.slug}`" class="news-card card-shadow">
					<NuxtImg
						v-if="item.img"
						:src="resolveImage(item.img)"
						:alt="language === 'RU' ? item.name : item.name_en || item.name"
						fit="contain"
						background="ffffff"
						width="420"
						height="260" />
					<h3>{{ language === 'RU' ? item.name : item.name_en || item.name }}</h3>
					<p class="news-card-text">
						{{ getMiniDescription(item) }}
					</p>
				</NuxtLink>
			</div>
			<p v-else>{{ language === 'RU' ? 'Новостей нет' : 'No news' }}</p>
		</section>

		<section class="section selection-section">
			<h2>{{ language === 'RU' ? 'Подбор оборудования' : 'Equipment selection' }}</h2>
			<div v-if="selectionCategories.length" class="selection-grid">
				<NuxtLink
					v-for="category in selectionCategories"
					:key="category.id"
					:to="`/catalog/type/${category.slug}`"
					class="selection-card card-shadow">
					<div class="selection-icon">
						<NuxtImg
							class="selection-icon-image"
							:src="resolveImage(category.img)"
							:alt="language === 'RU' ? category.name : category.name_en || category.name"
							fit="contain"
							background="ffffff"
							width="64"
							height="64"
							v-if="category.img" />
					</div>
					<p class="selection-title">
						{{ language === 'RU' ? category.name : category.name_en || category.name }}
					</p>
				</NuxtLink>
			</div>
		</section>

		<section class="section partners-section">
			<h2>{{ language === 'RU' ? 'Партнеры' : 'Partners' }}</h2>
			<div class="partners-slider card-shadow">
				<button class="slider-btn slider-btn-prev" type="button" @click="scrollPartners(-1)" aria-label="Предыдущие партнеры">
					<span aria-hidden="true">‹</span>
				</button>
				<div ref="partnersTrack" class="partners-track">
					<div v-for="partner in partners" :key="partner.id" class="partner-slide" @click="openCustomer(partner)">
					<NuxtImg
						v-if="partner.logo"
						:src="resolveImage(partner.logo)"
						:alt="partner.alt || partner.name"
						fit="contain"
						background="ffffff"
						width="180"
						height="120" />
					</div>
				</div>
				<div v-if="partners.length > 1" class="slider-dots" aria-hidden="true">
					<span
						v-for="(_, index) in partners"
						:key="`partner-dot-${index}`"
						:class="['slider-dot', { active: index === partnersIndex }]" />
				</div>
				<button class="slider-btn slider-btn-next" type="button" @click="scrollPartners(1)" aria-label="Следующие партнеры">
					<span aria-hidden="true">›</span>
				</button>
			</div>
		</section>

		<section class="section">
			<h2>{{ language === 'RU' ? 'Клиенты' : 'Clients' }}</h2>
			<div class="partners-slider card-shadow">
				<button class="slider-btn slider-btn-prev" type="button" @click="scrollClients(-1)" aria-label="Предыдущие клиенты">
					<span aria-hidden="true">‹</span>
				</button>
				<div ref="clientsTrack" class="partners-track">
					<div v-for="client in clients" :key="client.id" class="partner-slide" @click="openCustomer(client)">
					<NuxtImg
						v-if="client.logo"
						:src="resolveImage(client.logo)"
						:alt="client.alt || client.name"
						fit="contain"
						background="ffffff"
						width="180"
						height="120" />
					</div>
				</div>
				<div v-if="clients.length > 1" class="slider-dots" aria-hidden="true">
					<span
						v-for="(_, index) in clients"
						:key="`client-dot-${index}`"
						:class="['slider-dot', { active: index === clientsIndex }]" />
				</div>
				<button class="slider-btn slider-btn-next" type="button" @click="scrollClients(1)" aria-label="Следующие клиенты">
					<span aria-hidden="true">›</span>
				</button>
			</div>
		</section>

		<!-- Модалка для партнеров и клиентов -->
	<EntityModal v-model="isModalOpen" :entity="selectedCustomer" />

		<PageBlocks
			v-if="page.blocks?.length"
			:blocks="page.blocks.filter((block: any) => !['activity', 'contacts'].includes(block.name))"
			:language="language"
			:media-base="mediaBase" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

type ActivityFile = string | { file?: string } | Array<{ file?: string } | string>

interface ActivityItem {
	name?: string
	name_en?: string
	text?: string
	text_en?: string
	file?: ActivityFile
}

interface PageBlock {
	name?: string
	contents?: ActivityItem[]
}

interface PageEntity {
	title?: string
	title_en?: string
	seo_title?: string
	seo_title_en?: string
	description?: string
	description_en?: string
	seo_description?: string
	seo_description_en?: string
}

interface PageData extends PageEntity {
	blocks?: PageBlock[]
}

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

interface PartnerItem {
	id: number | string
	logo?: string
	alt?: string
	name?: string
	name_en?: string
	description?: string
	description_en?: string
}

interface ClientItem {
	id: number | string
	logo?: string
	alt?: string
	name?: string
	name_en?: string
	description?: string
	description_en?: string
}

interface FilterCategory {
	id: number | string
	name: string
	name_en?: string
	slug: string
	img?: string
}

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()

const { data: pageData } = await useFetch<PageData[]>(`${config.public.apiBase}page/1/`)
const { data: newsData } = await useFetch<NewsItem[]>(`${config.public.apiBase}news/`)
const { data: partnersData } = await useFetch<PartnerItem[]>(`${config.public.apiBase}partner/`)
const { data: clientsData } = await useFetch<ClientItem[]>(`${config.public.apiBase}client/`)
const { data: filtersData } = await useFetch<FilterCategory[]>(`${config.public.apiBase}filters/`)

const page = computed<PageData | null>(() => pageData.value?.[0] ?? null)
useSeoFromPage(page, language)

const newsNow = useState<string>('newsNow', () => new Date().toISOString())

const parsePublishedDate = (value?: string) => {
	if (!value) return null
	const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value)
	return new Date(hasTimezone ? value : `${value}Z`)
}

const stripHtml = (value?: string) => {
	if (!value) return ''
	return value
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

const decodeEntities = (value: string) => {
	return value
		.replace(/&laquo;/g, '«')
		.replace(/&raquo;/g, '»')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&mdash;/g, '—')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
}

const getMiniDescription = (item: NewsItem) => {
	const raw = language.value === 'RU'
		? item.mini_description
		: item.mini_description_en || item.mini_description
	return decodeEntities(stripHtml(raw))
}

const news = computed<NewsItem[]>(() => {
	const items = newsData.value || []
	const now = new Date(newsNow.value)
	return items
		.filter((item) => {
			const publishedAt = parsePublishedDate(item.published)
			return publishedAt ? publishedAt < now : false
		})
		.sort((a, b) => {
			const aDate = parsePublishedDate(a.published)
			const bDate = parsePublishedDate(b.published)
			const aTime = aDate ? aDate.getTime() : 0
			const bTime = bDate ? bDate.getTime() : 0
			return bTime - aTime
		})
})

const partners = computed<PartnerItem[]>(() => partnersData.value || [])
const clients = computed<ClientItem[]>(() => clientsData.value || [])
const selectionCategories = computed<FilterCategory[]>(() => filtersData.value || [])

const partnersTrack = ref<HTMLElement | null>(null)
const clientsTrack = ref<HTMLElement | null>(null)
const partnersIndex = ref(0)
const clientsIndex = ref(0)
const isModalOpen = ref(false)
const selectedCustomer = ref<PartnerItem | ClientItem>({
	id: 0,
	name: '',
})
const scrollPartners = (direction: 1 | -1) => {
	const track = partnersTrack.value
	if (!track) return
	const firstSlide = track.querySelector<HTMLElement>('.partner-slide')
	const slideWidth = firstSlide ? firstSlide.offsetWidth : 220
	const gap = 16
	track.scrollBy({ left: (slideWidth + gap) * direction, behavior: 'smooth' })
}
const scrollClients = (direction: 1 | -1) => {
	const track = clientsTrack.value
	if (!track) return
	const firstSlide = track.querySelector<HTMLElement>('.partner-slide')
	const slideWidth = firstSlide ? firstSlide.offsetWidth : 220
	const gap = 16
	track.scrollBy({ left: (slideWidth + gap) * direction, behavior: 'smooth' })
}

const openCustomer = (item: PartnerItem | ClientItem) => {
	selectedCustomer.value = item
	isModalOpen.value = true
}

const getTrackStep = (track: HTMLElement | null) => {
	if (!track) return 0
	const firstSlide = track.querySelector<HTMLElement>('.partner-slide')
	const slideWidth = firstSlide ? firstSlide.offsetWidth : 220
	const styles = window.getComputedStyle(track)
	const gapValue = parseFloat(styles.gap || styles.columnGap || '16')
	const gap = Number.isNaN(gapValue) ? 16 : gapValue
	return slideWidth + gap
}

const updateIndexFromTrack = (track: HTMLElement | null, total: number, setter: (value: number) => void) => {
	if (!track || total <= 0) return
	const step = getTrackStep(track)
	if (!step) return
	const index = Math.round(track.scrollLeft / step)
	const clamped = Math.max(0, Math.min(total - 1, index))
	setter(clamped)
}

let partnersRaf = 0
let clientsRaf = 0

const attachTrackListener = (track: Ref<HTMLElement | null>, total: ComputedRef<number>, setter: (value: number) => void, rafRef: () => number, setRaf: (value: number) => void) => {
	const el = track.value
	if (!el) return
	const onScroll = () => {
		if (rafRef()) return
		setRaf(requestAnimationFrame(() => {
			updateIndexFromTrack(el, total.value, setter)
			setRaf(0)
		}))
	}
	el.addEventListener('scroll', onScroll, { passive: true })
	updateIndexFromTrack(el, total.value, setter)
	return () => el.removeEventListener('scroll', onScroll)
}

const partnersTotal = computed(() => partners.value.length)
const clientsTotal = computed(() => clients.value.length)

onMounted(() => {
	const detachPartners = attachTrackListener(
		partnersTrack,
		partnersTotal,
		(value) => (partnersIndex.value = value),
		() => partnersRaf,
		(value) => (partnersRaf = value)
	)
	const detachClients = attachTrackListener(
		clientsTrack,
		clientsTotal,
		(value) => (clientsIndex.value = value),
		() => clientsRaf,
		(value) => (clientsRaf = value)
	)

	if (detachPartners || detachClients) {
		onBeforeUnmount(() => {
			detachPartners?.()
			detachClients?.()
		})
	}
})

watch([partners, clients], () => {
	updateIndexFromTrack(partnersTrack.value, partnersTotal.value, (value) => (partnersIndex.value = value))
	updateIndexFromTrack(clientsTrack.value, clientsTotal.value, (value) => (clientsIndex.value = value))
})

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const activityBlock = computed<PageBlock | undefined>(() => page.value?.blocks?.find((block) => block.name === 'activity'))
const activityItem = computed<ActivityItem | null>(() => activityBlock.value?.contents?.[0] || null)
const activityTitle = computed(() => {
	if (!activityItem.value) return ''
	return language.value === 'RU'
		? activityItem.value.name
		: activityItem.value.name_en || activityItem.value.name
})
const activityText = computed(() => {
	if (!activityItem.value) return ''
	const raw = language.value === 'RU' ? activityItem.value.text : activityItem.value.text_en || activityItem.value.text
	if (!raw || typeof raw !== 'string') return ''
	return raw.split('/')[0]
})
const activityLink = computed(() => {
	if (!activityItem.value) return '/about'
	const raw = language.value === 'RU' ? activityItem.value.text : activityItem.value.text_en || activityItem.value.text
	if (!raw || typeof raw !== 'string') return '/about'
	const slug = raw.split('/')[1]
	return slug ? `/${slug}` : '/about'
})
const activityImage = computed(() => {
	const file = activityItem.value?.file
	if (!file) return ''
	if (typeof file === 'string') return resolveImage(file)
	if (Array.isArray(file)) {
		const first = file[0]
		if (!first) return ''
		if (typeof first === 'string') return resolveImage(first)
		return resolveImage(first.file || '')
	}
	if (typeof file === 'object' && 'file' in file) {
		return resolveImage((file as any).file)
	}
	return ''
})
</script>

<style scoped>
.hero {
	padding: 2rem;
	margin-bottom: 2rem;
}
.activity-section {
	margin-bottom: 2rem;
}
.activity-card {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
	gap: 2rem;
	align-items: center;
	padding: 2rem;
	overflow: hidden;
	border-radius: 18px;
	background: linear-gradient(135deg, rgba(47, 193, 255, 0.08), rgba(47, 193, 255, 0.02));
	border: 1px solid rgba(47, 193, 255, 0.16);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.activity-card:hover {
	transform: translateY(-4px);
	border-color: rgba(47, 193, 255, 0.4);
	box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
}
.activity-content {
	display: flex;
	flex-direction: column;
	min-width: 0;
}
.activity-text {
	padding: 1rem 0;
	text-align: left;
}
.activity-image {
	width: 100%;
	max-width: 100%;
	height: auto;
	object-fit: contain;
	justify-self: end;
	display: block;
	min-width: 0;
	transition: transform 0.25s ease, filter 0.25s ease;
}
.activity-image-frame {
	justify-self: end;
	padding: 1rem;
	border-radius: 16px;
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
	transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.activity-card:hover .activity-image {
	transform: translateY(-6px) scale(1.02);
}
.activity-card:hover .activity-image-frame {
	transform: translateY(-4px);
	box-shadow: 0 18px 28px rgba(0, 0, 0, 0.12);
}
.news-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 1.5rem;
}
.news-card {
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	min-width: 0;
	overflow: hidden;
	border-radius: 16px;
	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.04);
	text-decoration: none;
	color: inherit;
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.news-card:hover {
	transform: translateY(-6px);
	border-color: rgba(47, 193, 255, 0.35);
	box-shadow: 0 16px 28px rgba(0, 0, 0, 0.12);
}
.news-card:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.6);
	outline-offset: 4px;
}
.news-card img {
	width: 100%;
	height: auto;
	object-fit: contain;
	display: block;
	max-width: 100%;
	transition: transform 0.25s ease;
}
.news-card-text {
	margin: 0;
	color: inherit;
}
.news-card:hover img {
	transform: scale(1.03);
}
.selection-section {
	margin-top: 1rem;
}
.selection-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
}
.selection-card {
	padding: 1.25rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	text-align: center;
	background: #ffffff;
	border-radius: 14px;
	border: 1px solid rgba(0, 0, 0, 0.04);
	text-decoration: none;
	color: inherit;
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.selection-card:hover {
	transform: translateY(-6px);
	border-color: rgba(47, 193, 255, 0.35);
	box-shadow: 0 14px 24px rgba(0, 0, 0, 0.12);
}
.selection-card:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.6);
	outline-offset: 4px;
}
.selection-icon {
	width: 64px;
	height: 64px;
	color: #9e9e9e;
	display: grid;
	place-items: center;
	border-radius: 16px;
	background: rgba(47, 193, 255, 0.08);
	transition: transform 0.25s ease, background 0.25s ease;
}
.selection-icon-image {
	width: 100%;
	height: 100%;
}
.selection-card:hover .selection-icon {
	transform: scale(1.08);
	background: rgba(47, 193, 255, 0.16);
}
.selection-title {
	margin: 0;
	font-weight: 600;
	color: #2fc1ff;
}
.partners-section {
	margin-top: 1rem;
}
.partners-slider {
	position: relative;
	padding: 0.5rem 2.5rem 2.25rem;
}
.partners-track {
	display: flex;
	gap: 1rem;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	padding: 1rem 0;
	scrollbar-width: none;
}
.partners-track::-webkit-scrollbar {
	display: none;
}
.partner-slide {
	flex: 0 0 200px;
	scroll-snap-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem;
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
	border: 1px solid transparent;
	cursor: pointer;
}
.partner-slide:hover {
	transform: translateY(-4px);
	border-color: rgba(47, 193, 255, 0.3);
	box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
}
.slider-btn {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 32px;
	height: 32px;
	border: none;
	border-radius: 50%;
	background: #2fc1ff;
	color: #ffffff;
	font-size: 20px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 10px 16px rgba(47, 193, 255, 0.35);
	transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.slider-btn:hover {
	transform: translateY(-50%) scale(1.05);
	background: #22b2ee;
	box-shadow: 0 14px 20px rgba(47, 193, 255, 0.4);
}
.slider-btn:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.6);
	outline-offset: 3px;
}
.slider-btn-prev {
	left: 0.5rem;
}
.slider-btn-next {
	right: 0.5rem;
}
.slider-dots {
	position: absolute;
	left: 50%;
	bottom: 1rem;
	transform: translateX(-50%);
	display: flex;
	gap: 0.5rem;
}
.slider-dot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: rgba(47, 193, 255, 0.28);
	transition: transform 0.2s ease, background 0.2s ease;
}
.slider-dot.active {
	background: #2fc1ff;
	transform: scale(1.2);
}

.logo-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: 1rem;
}
.logo-card {
	padding: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
}
@media (max-width: 1248px) {
	.activity-card {
		grid-template-columns: 1fr;
	}
	.activity-image, .activity-image-frame {
		display: none;
	}

}
</style>
