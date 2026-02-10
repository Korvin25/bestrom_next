<template>
	<div v-if="page" class="page-base flex-column">
		<section v-if="historyContent" class="section">
			<h2>{{ language === 'RU' ? 'О компании' : 'About company' }}</h2>
			<div class="content flex-row card-shadow">
				<div class="about-content flex-column" @click="router.push('/about/history')">
					<h3>{{ contentTitle(historyContent) }}</h3>
					<p class="text-about-content">{{ contentText(historyContent) }}</p>
					<button class="content-btn btn" @click.stop="router.push('/about/history')">
						{{ language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE' }}
					</button>
				</div>
				<iframe
					v-if="videoSrc"
					class="video-player"
					:src="videoSrc"
					title="About video"
					frameborder="0"
					allow="clipboard-write; autoplay; fullscreen; picture-in-picture"
					allowfullscreen />
			</div>
		</section>

		<section v-if="reasonsContent" class="section">
			<h2>{{ language === 'RU' ? 'Почему выбирают нас' : 'Why choose us' }}</h2>
			<div class="content flex-row card-shadow">
				<div class="about-content flex-column">
					<h3>{{ contentTitle(reasonsContent) }}</h3>
					<div class="text-about-content" v-html="contentText(reasonsContent)" />
					<button class="content-btn btn" @click="router.push('/catalog')">
						{{ language === 'RU' ? 'КАТАЛОГ' : 'CATALOG' }}
					</button>
				</div>
				<div v-if="reasonsImage" class="image-content">
					<NuxtImg class="image-world" :src="reasonsImage" :alt="reasonsImageAlt" loading="lazy" />
				</div>
			</div>

			<div v-if="choiceFiles.length" class="our-choice flex-column">
				<div class="reasons flex-row">
					<div v-for="item in choiceFiles" :key="item.src" class="item-reason card-shadow">
						<NuxtImg :alt="item.alt" :src="item.src" width="64" height="64" />
						<div class="hidden-item">{{ item.alt }}</div>
					</div>
				</div>
			</div>
		</section>

		<section v-if="directors.length" class="section">
			<h2>{{ language === 'RU' ? 'Руководство БЕСТРОМ' : 'BESTROM management' }}</h2>
			<div class="directors-grid">
				<div v-for="person in directors" :key="person.id || person.name" class="director-item flex-column">
					<NuxtImg
						v-if="contentImage(person)"
						:alt="contentImageAlt(person)"
						:src="contentImage(person)"
						class="director-image" />
					<h5>{{ contentTitle(person) }}</h5>
					<p>{{ contentText(person) }}</p>
				</div>
			</div>
		</section>

		<section v-if="weCreateItems.length" class="section">
			<h2>
				{{ language === 'RU' ? 'Мы производим и реализуем' : 'We manufacture and distribute' }}
			</h2>
			<div class="we-create-grid">
				<div v-for="item in weCreateItems" :key="item.id || item.name" class="we-create-item card-shadow">
					<h5>{{ contentTitle(item) }}</h5>
				</div>
			</div>
		</section>

		<section v-if="historyItems.length" class="section">
			<h2>{{ language === 'RU' ? 'История развития' : 'The history of development' }}</h2>
			<div class="history-vertical card-shadow" @wheel.prevent="onHistoryWheel">
				<div class="history-years">
					<ClientOnly>
					<Swiper
						:key="swiperDirection"
						class="history-swiper"
						:direction="swiperDirection"
						:modules="[Mousewheel]"
						:slides-per-view="swiperSlidesPerView"
						:centered-slides="true"
						:space-between="12"
						:mousewheel="{ forceToAxis: true, releaseOnEdges: false, sensitivity: 1 }"
						:initial-slide="historyIndex"
						@swiper="onHistorySwiper"
						@slideChange="onHistorySlideChange">
							<SwiperSlide v-for="(item, index) in historyItems" :key="item.id || item.year">
								<button
									type="button"
									:class="['history-year', { active: index === historyIndex }]"
									@click="selectHistory(index)">
									{{ item.year }}
								</button>
							</SwiperSlide>
						</Swiper>
					</ClientOnly>
				</div>
				<div class="history-detail">
					<transition :name="historyDirection === 'up' ? 'history-slide-up' : 'history-slide-down'" mode="out-in">
						<div :key="historyIndex" class="history-detail-inner">
							<NuxtImg
								v-if="currentHistory?.img"
								class="history-logo"
								:src="resolveImage(currentHistory.img)"
								:alt="historyText(currentHistory)"
								width="96"
								height="96" />
							<p class="history-text">{{ historyText(currentHistory) }}</p>
						</div>
					</transition>
				</div>
			</div>
		</section>

		<section v-if="clients.length" class="section">
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

	
	<!-- Модалка для клиентов -->
	<EntityModal v-model="isModalOpen" :entity="selectedCustomer" />

		<PageBlocks
			v-if="otherBlocks.length"
			:blocks="otherBlocks"
			:language="language"
			:media-base="mediaBase" />
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import 'swiper/css'
import { Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import PageBlocks from '~/components/PageBlocks.vue'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

type FileSource = string | { file?: string; alt?: string } | Array<string | { file?: string; alt?: string }>

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()
const router = useRouter()

const { data: pageData } = await useFetch<any[]>(`${config.public.apiBase}page/2/`)
const { data: historyData } = await useFetch<any[]>(`${config.public.apiBase}history/`)
const { data: clientsData } = await useFetch<any[]>(`${config.public.apiBase}client/`)
const page = computed<any | null>(() => (pageData.value?.length ? pageData.value[0] : null))
useSeoFromPage(page, language)

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

const historyBlock = computed(() => page.value?.blocks?.find((block: any) => block.name === 'history'))
const reasonsBlock = computed(() => page.value?.blocks?.find((block: any) => block.name === 'reasons'))
const youtubeBlock = computed(() => page.value?.blocks?.find((block: any) => block.name === 'youtube'))
const directorsBlock = computed(() => page.value?.blocks?.find((block: any) => block.name === 'directors'))
const weCreateBlock = computed(() => page.value?.blocks?.find((block: any) => block.name === 'we-create'))

const historyContent = computed(() => historyBlock.value?.contents?.[0] || null)
const reasonsContent = computed(() => {
	const contents = reasonsBlock.value?.contents || []
	return contents.find((item: any) => item?.name !== 'choice') || contents[0] || null
})
const choiceContent = computed(() => {
	const contents = reasonsBlock.value?.contents || []
	return contents.find((item: any) => item?.name === 'choice') || null
})
const youtubeContent = computed(() => youtubeBlock.value?.contents?.[0] || null)

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

const contentTitle = (content: any) => {
	if (!content) return ''
	return language.value === 'RU' ? content.name || '' : content.name_en || content.name || ''
}

const contentText = (content: any) => {
	if (!content) return ''
	const raw = language.value === 'RU' ? content.text : content.text_en || content.text
	return typeof raw === 'string' ? raw : ''
}

const contentFiles = (content: any) => {
	const file = content?.file as FileSource | undefined
	if (!file) return []
	const filesArray = Array.isArray(file) ? file : [file]
	return filesArray
		.map((entry) => {
			if (typeof entry === 'string') {
				const src = resolveImage(entry)
				return src ? { src, alt: '' } : null
			}
			if (entry && typeof entry === 'object' && 'file' in entry) {
				const src = resolveImage(entry.file)
				return src ? { src, alt: entry.alt || '' } : null
			}
			return null
		})
		.filter(Boolean) as Array<{ src: string; alt: string }>
}

const reasonsImage = computed(() => {
	const files = contentFiles(reasonsContent.value)
	return files[0]?.src || ''
})
const reasonsImageAlt = computed(() => {
	const files = contentFiles(reasonsContent.value)
	return files[0]?.alt || contentTitle(reasonsContent.value)
})

const choiceFiles = computed(() => contentFiles(choiceContent.value))
const directors = computed(() => directorsBlock.value?.contents || [])
const weCreateItems = computed(() => weCreateBlock.value?.contents || [])
const historyItems = computed(() => historyData.value || [])
const clients = computed(() => clientsData.value || [])
const historyIndex = ref(0)
const currentHistory = computed(() => historyItems.value[historyIndex.value])
const historySwiper = ref<any | null>(null)
const historyDirection = ref<'up' | 'down'>('down')

// Адаптивное направление свайпера: горизонтальное на мобилке
const isMobile = ref(false)
const updateIsMobile = () => {
	isMobile.value = window.innerWidth <= 980
}
onMounted(() => {
	updateIsMobile()
	window.addEventListener('resize', updateIsMobile)
})
onBeforeUnmount(() => {
	window.removeEventListener('resize', updateIsMobile)
})
const swiperDirection = computed(() => (isMobile.value ? 'horizontal' : 'vertical') as 'horizontal' | 'vertical')
const swiperSlidesPerView = computed(() => (isMobile.value ? 5 : 5))

const videoSrc = computed(() => {
	const raw = contentText(youtubeContent.value)
	if (!raw) return ''
	if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
		try {
			const url = new URL(raw)
			const id = url.searchParams.get('v')
			return id ? `https://www.youtube.com/embed/${id}` : raw
		} catch {
			return raw
		}
	}
	return `https://rutube.ru/play/embed/${raw}`
})

const contentImage = (content: any) => {
	const files = contentFiles(content)
	return files[0]?.src || ''
}

const contentImageAlt = (content: any) => {
	const files = contentFiles(content)
	return files[0]?.alt || contentTitle(content)
}

const historyText = (item: any) => {
	if (!item) return ''
	return language.value === 'RU' ? item.description || '' : item.description_en || item.description || ''
}

const onHistorySwiper = (swiper: any) => {
	historySwiper.value = swiper
}

const onHistorySlideChange = (swiper: any) => {
	const direction = swiper.activeIndex > swiper.previousIndex ? 1 : -1
	historyDirection.value = direction > 0 ? 'down' : 'up'
	historyIndex.value = swiper.activeIndex
}

const selectHistory = (index: number) => {
	historyDirection.value = index > historyIndex.value ? 'down' : 'up'
	historyIndex.value = index
}

const onHistoryWheel = (event: WheelEvent) => {
	if (!historySwiper.value) return
	const direction = event.deltaY > 0 ? 1 : -1
	historyDirection.value = direction > 0 ? 'down' : 'up'
	if (direction > 0) {
		historySwiper.value.slideNext()
	} else {
		historySwiper.value.slidePrev()
	}
}

const clientsTrack = ref<HTMLElement | null>(null)
const clientsIndex = ref(0)
const isModalOpen = ref(false)
const selectedCustomer = ref<any>({
	id: 0,
	name: '',
})

const scrollClients = (direction: 1 | -1) => {
	const track = clientsTrack.value
	if (!track) return
	const firstSlide = track.querySelector<HTMLElement>('.partner-slide')
	const slideWidth = firstSlide ? firstSlide.offsetWidth : 220
	const gap = 16
	track.scrollBy({ left: (slideWidth + gap) * direction, behavior: 'smooth' })
}

const openCustomer = (item: any) => {
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

let clientsRaf = 0

const attachTrackListener = (
	track: Ref<HTMLElement | null>,
	total: ComputedRef<number>,
	setter: (value: number) => void,
	rafRef: () => number,
	setRaf: (value: number) => void,
) => {
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

const clientsTotal = computed(() => clients.value.length)

onMounted(() => {
	const detachClients = attachTrackListener(
		clientsTrack,
		clientsTotal,
		(value) => (clientsIndex.value = value),
		() => clientsRaf,
		(value) => (clientsRaf = value),
	)

	if (detachClients) {
		onBeforeUnmount(() => {
			detachClients?.()
		})
	}
})

watch(clients, () => {
	updateIndexFromTrack(clientsTrack.value, clientsTotal.value, (value) => (clientsIndex.value = value))
})

watch(historyIndex, (value) => {
	if (!historySwiper.value) return
	if (historySwiper.value.activeIndex === value) return
	historySwiper.value.slideTo(value)
})

const otherBlocks = computed<any[]>(() => {
	const blocks =
		page.value?.blocks?.filter(
			(block: any) => !['history', 'reasons', 'youtube', 'directors', 'we-create'].includes(block.name),
		) || []
	return blocks
})
</script>

<style scoped>
.content {
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
.content:hover {
	transform: translateY(-4px);
	border-color: rgba(47, 193, 255, 0.4);
	box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
}
.about-content {
	flex: 1.2;
	min-width: 0;
}
.text-about-content {
	padding: 1rem 0;
	text-align: left;
}
.content-btn {
	align-self: flex-start;
	width: auto;
	min-width: 160px;
	height: 40px;
	padding: 0.55rem 1.4rem;
	border-radius: 999px;
	background: #2fc1ff;
	color: #ffffff;
	font-size: 0.9rem;
	font-weight: 600;
	box-shadow: 0 6px 16px rgba(47, 193, 255, 0.35);
	transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.content-btn:hover {
	background: #22b2ee;
	transform: translateY(-1px);
	box-shadow: 0 10px 22px rgba(47, 193, 255, 0.4);
}
.content-btn:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.45);
	outline-offset: 3px;
}
.video-player {
	width: 100%;
	min-height: 320px;
	border-radius: 16px;
	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
}
.image-content {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	border-radius: 16px;
	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
}
.image-world {
	width: 100%;
	max-width: 520px;
	max-height: 320px;
	object-fit: contain;
}
.reasons {
	margin: 1rem 0;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 1rem;
}
.item-reason {
	text-align: center;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 7rem;
	padding: 1rem 0.75rem;
	background: #ffffff;
	border-radius: 14px;
	border: 1px solid rgba(0, 0, 0, 0.04);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.item-reason:hover {
	transform: translateY(-4px);
	border-color: rgba(47, 193, 255, 0.35);
	box-shadow: 0 14px 24px rgba(0, 0, 0, 0.12);
}
.item-reason img {
	max-width: 3.5rem;
	max-height: 3.5rem;
	transition: filter 0.2s ease;
}
.hidden-item {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 0.5rem;
	background: rgba(47, 193, 255, 0.9);
	color: #ffffff;
	border-radius: 6px;
	opacity: 0;
	transition: opacity 0.2s ease;
}
.item-reason:hover .hidden-item {
	opacity: 1;
}
.item-reason:hover img {
	filter: blur(3px);
}
.directors-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 1.5rem;
}
.director-item {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	background: #ffffff;
	border-radius: 16px;
	border: 1px solid rgba(0, 0, 0, 0.04);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.director-item:hover {
	transform: translateY(-6px);
	border-color: rgba(47, 193, 255, 0.35);
	box-shadow: 0 16px 28px rgba(0, 0, 0, 0.12);
}
.director-image {
	width: 100%;
	border-radius: 6px;
	box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.15);
	object-fit: cover;
}
.director-item p {
	margin: 0;
	padding-top: 0.5rem;
	border-top: 1px solid #2fc1ff;
}
.we-create-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 1.25rem;
}
.we-create-item {
	padding: 2rem;
	min-height: 7rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	background: #ffffff;
	border-radius: 16px;
	border: 1px solid rgba(0, 0, 0, 0.04);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.we-create-item:hover {
	transform: translateY(-6px);
	border-color: rgba(47, 193, 255, 0.35);
	box-shadow: 0 16px 28px rgba(0, 0, 0, 0.12);
}
.history-vertical {
	display: grid;
	grid-template-columns: 140px 1fr;
	gap: 1.5rem;
	padding: 2rem;
	align-items: center;
	min-height: 360px;
	overflow: hidden;
}
.history-years {
	height: 320px;
}
.history-swiper {
	height: 100%;
}
.history-swiper :deep(.swiper-slide) {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.history-year {
	background: transparent;
	border: none;
	text-align: left;
	font-size: 16px;
	color: rgba(47, 193, 255, 0.55);
	font-weight: 600;
	cursor: pointer;
	transition: font-size 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.history-year.active {
	font-size: 26px;
	color: #2fc1ff;
	transform: translateY(2px);
}
.history-detail {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 1rem;
	min-height: 220px;
}
.history-detail-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	width: 100%;
	min-width: 0;
}
.history-logo {
	width: 96px;
	height: 96px;
	object-fit: contain;
}
.history-text {
	margin: 0;
	color: rgba(47, 193, 255, 0.8);
	font-size: 16px;
	line-height: 1.5;
	word-wrap: break-word;
	overflow-wrap: break-word;
}
.history-slide-up-enter-active,
.history-slide-up-leave-active,
.history-slide-down-enter-active,
.history-slide-down-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}
.history-slide-up-enter-from {
	opacity: 0;
	transform: translateY(12px);
}
.history-slide-up-leave-to {
	opacity: 0;
	transform: translateY(-12px);
}
.history-slide-down-enter-from {
	opacity: 0;
	transform: translateY(-12px);
}
.history-slide-down-leave-to {
	opacity: 0;
	transform: translateY(12px);
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

@media (max-width: 980px) {
	.content {
		grid-template-columns: 1fr;
	}
	.about-content {
		width: 100%;
	}
	.image-content {
		display: none;
	}
	.we-create-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}
	.we-create-item {
		padding: 0.75rem;
		min-height: auto;
		border-radius: 12px;
	}
	.we-create-item h5 {
		font-size: 13px;
		margin: 0;
	}
	.item-reason {
		min-height: 6rem;
	}
	.history-vertical {
		grid-template-columns: 1fr;
		padding: 1rem;
		min-height: auto;
		gap: 0.75rem;
		overflow: visible;
	}
	.history-years {
		height: auto;
		width: 100%;
		overflow: hidden;
	}
	.history-swiper {
		height: auto;
		width: 100%;
	}
	.history-swiper :deep(.swiper-slide) {
		justify-content: center;
	}
	.history-year {
		text-align: center;
		font-size: 14px;
		white-space: nowrap;
	}
	.history-year.active {
		font-size: 22px;
	}
	.history-detail {
		min-height: auto;
		overflow: hidden;
	}
	.history-detail-inner {
		width: 100%;
	}
	.history-logo {
		width: 72px;
		height: 72px;
	}
	.history-text {
		font-size: 14px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

}
</style>
