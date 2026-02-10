<template>
	<div v-if="product" class="flex-column catalog-detail">
		<section class="section">
			<h2>{{ productTitle }}</h2>

		<div class="slider-content card-shadow">
			<Swiper
				v-if="sliderItems.length"
				class="main-swiper"
				:modules="[Navigation]"
				:slides-per-view="1"
				:space-between="16"
				:navigation="sliderItems.length > 1"
				@swiper="onMainSwiper"
				@slideChange="onSlideChange">
				<SwiperSlide v-for="slide in sliderItems" :key="slide.id || slide.img">
					<div class="slide-center">
						<NuxtImg
							class="catalog-item-card-image"
							:src="resolveMedia(slide.img)"
							:alt="slide.alt || productTitle" />
					</div>
				</SwiperSlide>
			</Swiper>
			<div v-else class="flex-row else-flex">
				<NuxtImg class="catalog-item-card-image" src="/assets/no-image.jpg" alt="no-image" />
			</div>

			<div v-if="sliderItems.length > 1" class="thumbs-row">
				<div
					v-for="(slide, index) in sliderItems"
					:key="`thumb-${slide.id || slide.img}`"
					:class="['thumb-item', { active: index === activeSlide }]"
					@click="goToSlide(Number(index))">
					<NuxtImg
						class="thumb-image"
						:src="resolveMedia(slide.img)"
						:alt="slide.alt || productTitle" />
				</div>
			</div>
		</div>

			<div class="buttons-section catalog-ig-buttons flex-row">
				<button class="btn" type="button" @click="showModalCall = true">
					{{ language === 'RU' ? 'ЗАКАЗАТЬ ЗВОНОК' : 'REQUEST A CALL' }}
				</button>
				<button class="btn" type="button" @click="showModalApplication = true">
					{{ language === 'RU' ? 'ОТПРАВИТЬ ЗАЯВКУ' : 'SEND AN APPLICATION' }}
				</button>
			</div>

			<div class="details flex-column card-shadow">
				<div class="desktop-section details-select flex-row">
					<div
						v-for="(item, index) in aboutItems"
						:key="item.id"
						:class="isSelected === index ? 'details-select-item-choice' : ''"
						class="details-select-item flex-column card-shadow"
						@click="isSelected = index">
						<NuxtImg
							:src="isSelected === index ? item.activeImage : item.disableImage"
							:alt="item.title" />
						<p>{{ language === 'RU' ? item.title : item.title_en }}</p>
					</div>
				</div>

				<div class="mobile-section details-select">
					<div class="details-select-mobile-grid">
						<div
							v-for="(item, index) in aboutItems"
							:key="item.id"
							:class="isSelected === index ? 'details-select-item-choice' : ''"
							class="details-select-item flex-column card-shadow"
							@click="isSelected = index">
							<NuxtImg
								:src="isSelected === index ? item.activeImage : item.disableImage"
								:alt="item.title" />
							<p>{{ language === 'RU' ? item.title : item.title_en }}</p>
						</div>
					</div>
				</div>

				<div v-if="isSelected === 0" class="details-select-settings">
					<div
						v-for="item in product.ProductPropertyValue || []"
						:key="item.id"
						class="details-select-settings-item">
						<h4>
							{{ language === 'RU' ? item.product_property?.name : item.product_property?.name_en }}
						</h4>
						<div v-html="language === 'RU' ? item.name : item.name_en || item.name" />
					</div>
				</div>

				<div v-if="isSelected === 1" class="details-select-video">
					<div v-if="(product.VideoProduct || []).length">
						<div v-for="item in product.VideoProduct" :key="item.id" class="details-select-video-item">
							<iframe
								class="video-player"
								width="100%"
								height="315"
								:src="videoEmbedSrc(item.video)"
								frameborder="0"
								allow="clipboard-write; autoplay; fullscreen; picture-in-picture"
								allowfullscreen />
						</div>
					</div>
					<div v-else>
						<p>{{ language === 'RU' ? 'Для данного оборудования видео отсутствует' : 'No videos available' }}</p>
					</div>
				</div>

				<div v-if="isSelected === 2" class="details-select-products flex-row">
					<div
						v-for="item in product.Items || []"
						:key="item.id"
						class="details-select-products-item card-shadow"
						@click="openProductExamples(item)">
						<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
						<NuxtImg :src="resolveMedia(item.img)" :alt="item.alt" />
						<AppHiddenItem :text="language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE'" />
					</div>
				</div>

				<div v-if="isSelected === 3" class="details-select-inventory">
					<div class="slider-content">
						<Swiper
							:modules="swiperModules"
							:slides-per-view="1.5"
							:space-between="16"
							:breakpoints="inventoryBreakpoints"
							:loop="(product.equipments || []).length > 1"
							:navigation="(product.equipments || []).length > 1"
							:pagination="(product.equipments || []).length > 1 ? { clickable: true } : false">
							<SwiperSlide v-for="item in product.equipments || []" :key="item.id">
								<div
									class="details-select-inventory-item flex-column card-shadow"
									@click="openEquipment(item)">
									<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
									<NuxtImg
										:src="resolveMedia(item.SliderProd?.[0]?.img)"
										:alt="item.SliderProd?.[0]?.alt || item.name" />
									<AppHiddenItem :text="language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE'" />
								</div>
							</SwiperSlide>
						</Swiper>
					</div>
				</div>

				<div v-if="isSelected === 4">
					<div class="details-select-packet flex-row">
						<div v-for="item in product.Packet || []" :key="item.id" class="details-select-packet-item card-shadow">
							<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
							<NuxtImg :src="resolveMedia(item.img)" :alt="item.alt" />
						</div>
					</div>

					<h2 class="title-brand title-padding">
						{{ language === 'RU' ? 'Дополнительные опции пакетов' : 'Additional package options' }}
					</h2>

					<div class="details-select-packet flex-row">
						<div
							v-for="item in product.PacketsOptions || []"
							:key="item.id"
							class="details-select-packet-item card-shadow">
							<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
							<NuxtImg :src="resolveMedia(item.img)" :alt="item.alt" />
						</div>
					</div>
				</div>

				<div v-if="isSelected === 5" class="details-select-solution">
					<div v-if="solutionIntro" class="solution-intro">
						<div class="solution-intro-text">
							<h3>{{ language === 'RU' ? solutionIntro.name : solutionIntro.name_en }}</h3>
							<p>{{ language === 'RU' ? solutionIntro.text : solutionIntro.text_en }}</p>
						</div>
						<div class="solution-intro-image">
							<NuxtImg
								:alt="solutionIntro.file?.[0]?.alt || 'solution'"
								:src="resolveMedia(solutionIntro.file?.[0]?.file)" />
						</div>
					</div>

					<div v-if="(product.Solution || []).length" class="slider-content">
						<Swiper
							:modules="swiperModules"
							:slides-per-view="1.2"
							:space-between="16"
							:breakpoints="solutionBreakpoints"
							:loop="(product.Solution || []).length > 1"
							:navigation="(product.Solution || []).length > 1"
							:pagination="(product.Solution || []).length > 1 ? { clickable: true } : false">
							<SwiperSlide v-for="item in product.Solution || []" :key="item.id">
								<div class="details-select-solution-item flex-column card-shadow">
									<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
									<NuxtImg :src="resolveMedia(item.img)" :alt="item.alt" />
									<AppHiddenItem :text="language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE'" />
								</div>
							</SwiperSlide>
						</Swiper>
					</div>
				</div>
			</div>
		</section>
	</div>

	<transition name="modal">
		<AppModalCatalogProductExamples
			v-if="showModalProductExamples"
			:title="productExamplesTitle"
			:product-examples="productExamples"
			@close="showModalProductExamples = false" />
	</transition>

	<transition-group name="modal">
		<AppModalCatalogCall
			v-if="showModalCall"
			:name-machine="productTitle"
			@close="showModalCall = false" />
		<AppModalCatalogApplication
			v-if="showModalApplication"
			:name-machine="productTitle"
			@close="showModalApplication = false" />
	</transition-group>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useAppStore } from '~/stores/app'
import { usePageStore } from '~/stores/page'
import { useProductStore } from '~/stores/product'

const appStore = useAppStore()
const productStore = useProductStore()
const pageStore = usePageStore()
const { language, serverMedia } = storeToRefs(appStore)
const { products } = storeToRefs(productStore)

const route = useRoute()
const router = useRouter()

if (!products.value.length) {
	await productStore.loadProducts()
}

if (!pageStore.pageId.length) {
	await pageStore.loadPage(11)
}

const slugParam = computed(() =>
	Array.isArray(route.params.catalogSlug) ? route.params.catalogSlug[0] : route.params.catalogSlug,
)

const product = computed(() =>
	products.value.find((item: any) => item.slug === slugParam.value || String(item.id) === String(slugParam.value)),
)

const productTitle = computed(() =>
	product.value ? (language.value === 'RU' ? product.value.name : product.value.name_en || product.value.name) : '',
)

const resolveMedia = (src: unknown) => {
	if (!src || typeof src !== 'string') return '/assets/no-image.jpg'
	if (src.startsWith('http')) return src
	return `${serverMedia.value}${src.replace(/^\//, '')}`
}

const sliderItems = computed(() => product.value?.SliderProd || [])
const swiperModules = [Navigation, Pagination]
const mainSwiper = ref<any>(null)
const activeSlide = ref(0)

const onMainSwiper = (swiper: any) => {
	mainSwiper.value = swiper
}
const onSlideChange = (swiper: any) => {
	activeSlide.value = swiper.realIndex
}
const goToSlide = (index: number) => {
	if (mainSwiper.value) {
		mainSwiper.value.slideTo(index)
	}
}

const aboutItems = [
	{
		id: 'settings',
		disableImage: '/assets/catalog-details-settings.png',
		activeImage: '/assets/catalog-details-settings-active.png',
		title: 'технические характеристики',
		title_en: 'specifications',
	},
	{
		id: 'video',
		disableImage: '/assets/catalog-details-video.png',
		activeImage: '/assets/catalog-details-video-active.png',
		title: 'видео',
		title_en: 'video',
	},
	{
		id: 'products',
		disableImage: '/assets/catalog-details-products.png',
		activeImage: '/assets/catalog-details-products-active.png',
		title: 'продукты',
		title_en: 'products',
	},
	{
		id: 'inventory',
		disableImage: '/assets/catalog-details-inventory.png',
		activeImage: '/assets/catalog-details-inventory-active.png',
		title: 'доп. оборудование',
		title_en: 'optional equipment',
	},
	{
		id: 'packet',
		disableImage: '/assets/catalog-details-packet.png',
		activeImage: '/assets/catalog-details-packet-active.png',
		title: 'тип пакета',
		title_en: 'package type',
	},
	{
		id: 'solution',
		disableImage: '/assets/catalog-details-solution.png',
		activeImage: '/assets/catalog-details-solution-active.png',
		title: 'готовые решения',
		title_en: 'ready-made solutions',
	},
]

const isSelected = ref(0)
const showModalCall = ref(false)
const showModalApplication = ref(false)
const showModalProductExamples = ref(false)
const productExamplesTitle = ref('')
const productExamples = ref<any[]>([])

const solutionIntro = computed(() => pageStore.pageId?.[0]?.blocks?.[0]?.contents?.[0] || null)

const inventoryBreakpoints = {
	0: { slidesPerView: 1.2, spaceBetween: 12 },
	1248: { slidesPerView: 1.9, spaceBetween: 16 },
}

const solutionBreakpoints = {
	0: { slidesPerView: 1.2, spaceBetween: 12 },
	1248: { slidesPerView: 1, spaceBetween: 16 },
}

const openProductExamples = (item: any) => {
	productExamplesTitle.value = language.value === 'RU' ? item.name : item.name_en || item.name
	productExamples.value = item.ItemsExample || []
	showModalProductExamples.value = true
}

const openEquipment = (item: any) => {
	window.scrollTo(0, 0)
	router.push(`/catalog/machine/${item.id}`)
}

const videoEmbedSrc = (src: string) => {
	if (!src) return ''
	if (src.includes('youtube.com') || src.includes('youtu.be')) {
		const match = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
		return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : src
	}
	return `https://rutube.ru/play/embed/${src}`
}


useSeoMeta({
	title: computed(() =>
		product.value
			? language.value === 'RU'
				? product.value.seo_title || product.value.name
				: product.value.seo_title_en || product.value.name_en || product.value.name
			: 'БЕСТРОМ',
	),
	description: computed(() =>
		product.value
			? language.value === 'RU'
				? product.value.seo_description || product.value.description || product.value.name
				: product.value.seo_description_en || product.value.description_en || product.value.description || product.value.name_en || product.value.name
			: '',
	),
})

watch(
	() => showModalCall.value || showModalApplication.value || showModalProductExamples.value,
	(isOpen) => {
		if (process.client) {
			document.body.classList.toggle('modal-open', isOpen)
		}
	},
)

onBeforeUnmount(() => {
	if (process.client) {
		document.body.classList.remove('modal-open')
	}
})
</script>

<style scoped>
.catalog-detail {
	gap: 1.5rem;
}
.catalog-detail h2 {
	font-weight: 700;
	font-size: clamp(1.5rem, 1rem + 1.2vw, 2.2rem);
	letter-spacing: 0.01em;
	color: #0f172a;
}
.slider-content {
	margin: 1.75rem 0 1rem 0;
	padding: 1.5rem 1rem 1rem;
	border-radius: 20px;
	background: #ffffff;
	box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
}
.main-swiper {
	border-radius: 16px;
}
.slide-center {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 20rem;
	padding: 1rem 2.5rem;
}
.catalog-item-card-image {
	max-width: 26rem;
	max-height: 22rem;
	width: 100%;
	border-radius: 12px;
	object-fit: contain;
	display: block;
}
.else-flex {
	align-items: center;
	justify-content: center;
	min-height: 18rem;
}
.thumbs-row {
	display: flex;
	gap: 0.5rem;
	margin-top: 0.75rem;
	justify-content: center;
	flex-wrap: wrap;
}
.thumb-item {
	cursor: pointer;
	border: 2px solid transparent;
	border-radius: 10px;
	overflow: hidden;
	opacity: 0.45;
	transition: opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.thumb-item.active {
	opacity: 1;
	border-color: #38bdf8;
	box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
}
.thumb-item:hover {
	opacity: 0.8;
}
.thumb-image {
	width: 5.5rem;
	height: 4rem;
	object-fit: contain;
	display: block;
	background: #f8fafc;
	padding: 0.25rem;
}

.catalog-ig-buttons {
	margin: 0 -0.75rem;
	gap: 0.75rem;
}
.catalog-ig-buttons .btn {
	flex-grow: 1;
	margin: 0 0.75rem;
	padding: 0.9rem 1.6rem;
	border-radius: 999px;
	border: none;
	font-weight: 600;
	font-size: 0.95rem;
	letter-spacing: 0.02em;
	color: #ffffff;
	background: linear-gradient(135deg, #38bdf8, #2fc1ff);
	box-shadow: 0 10px 24px rgba(56, 189, 248, 0.35);
	transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.catalog-ig-buttons .btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 14px 30px rgba(56, 189, 248, 0.45);
	filter: brightness(1.03);
}
.buttons-section.catalog-ig-buttons {
	margin: 1.25rem -0.75rem;
}

.details {
	margin: 1rem 0;
	padding: 1.5rem;
	border-radius: 24px;
	background: #f8fafc;
	box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.15);
}
.details-select {
	justify-content: flex-start;
	gap: 0.75rem;
}
.details-select-item {
	transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
	cursor: pointer;
	text-align: center;
	padding: 0.75rem 1rem;
	align-items: center;
	margin: 0;
	width: 220px;
	border-radius: 16px;
	background: #ffffff;
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}
.details-select-item img {
	width: 44px;
	height: 44px;
}
.details-select-item:hover {
	transform: translateY(-1px);
	box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
}
.details-select-item-choice {
	color: #0f172a;
	background: #e0f2fe;
	box-shadow: 0 10px 24px rgba(56, 189, 248, 0.25);
}
.details-select-item-choice:hover {
	background: #dbeafe;
}

.desktop-section {
	display: flex;
}
.mobile-section {
	display: none;
}

.details-select-settings {
	margin: 2rem 0 0 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.details-select-settings-item {
	background: #ffffff;
	border-radius: 14px;
	padding: 0.75rem 1rem;
	box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
}
.details-select-settings-item h4 {
	margin: 0.25rem 0 0.5rem 0;
	font-weight: 600;
	color: #0f172a;
}

.details-select-video {
	margin: 2rem 0 0 0;
	width: 100%;
}
.details-select-video-item {
	width: 100%;
	margin-bottom: 1.25rem;
	border-radius: 18px;
	overflow: hidden;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
}
.video-player {
	border-radius: 18px;
}

.details-select-products {
	margin: 2rem 0 0 0;
	flex-wrap: wrap;
	gap: 1rem;
}
.details-select-products-item {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	flex-grow: 1;
	padding: 1rem;
	text-align: center;
	width: 20%;
	border-radius: 18px;
	background: #ffffff;
	box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.details-select-products-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
}
.details-select-products-item:hover .hidden-item {
	opacity: 1;
	transform: translateY(0);
}
.details-select-products-item img {
	align-self: center;
	max-width: 10rem;
	width: 100%;
}
.details-select-products-item h4 {
	font-weight: 600;
	margin: 0 0 0.5rem 0;
	color: #0f172a;
}

.details-select-inventory {
	margin: 2rem 0 1rem 0;
}
.details-select-inventory-item {
	position: relative;
	flex-grow: 1;
	height: 15rem;
	text-align: center;
	justify-content: space-between;
	align-items: center;
	margin: 1rem;
	padding: 1.25rem 2rem;
	border-radius: 20px;
	background: #ffffff;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.details-select-inventory-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 30px rgba(15, 23, 42, 0.14);
}
.details-select-inventory-item:hover .hidden-item {
	opacity: 1;
	transform: translateY(0);
}
.details-select-inventory-item h4 {
	margin: 0;
	font-weight: 600;
	color: #0f172a;
}
.details-select-inventory-item img {
	max-height: 9rem;
}

.title-padding {
	padding: 0 0.5rem;
	margin: 0.5rem 0 0 0;
}
.details-select-packet {
	margin-top: 1.5rem;
	flex-wrap: wrap;
	justify-content: flex-start;
	gap: 1rem;
}
.details-select-packet-item {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	text-align: center;
	width: 20%;
	flex-grow: 1;
	border-radius: 18px;
	background: #ffffff;
	box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.details-select-packet-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
}
.details-select-packet-item h4 {
	font-weight: 600;
	margin-top: 0;
	color: #0f172a;
}

.solution-intro {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	align-items: center;
	padding: 2rem;
	border-radius: 20px;
	background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
	margin-bottom: 1.5rem;
}
.solution-intro-text h3 {
	font-weight: 700;
	font-size: 1.25rem;
	color: #0f172a;
	margin: 0 0 0.75rem 0;
}
.solution-intro-text p {
	color: #475569;
	line-height: 1.6;
	margin: 0;
}
.solution-intro-image {
	display: flex;
	align-items: center;
	justify-content: center;
}
.solution-intro-image img {
	width: 100%;
	max-width: 400px;
	max-height: 260px;
	object-fit: contain;
	border-radius: 14px;
	filter: drop-shadow(0 8px 20px rgba(15, 23, 42, 0.1));
}
.details-select-solution {
	margin: 2rem 0 1rem 0;
	overflow: hidden;
}
.details-select-solution-item {
	position: relative;
	text-align: center;
	justify-content: center;
	align-items: center;
	margin: 1rem;
	padding: 1.25rem 2rem;
	border-radius: 20px;
	background: #ffffff;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.details-select-solution-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 30px rgba(15, 23, 42, 0.14);
}
.details-select-solution-item:hover .hidden-item {
	opacity: 1;
	transform: translateY(0);
}
.details-select-solution-item h4 {
	margin-top: 0;
	font-weight: 600;
	color: #0f172a;
}

.main-swiper :deep(.swiper-button-next),
.main-swiper :deep(.swiper-button-prev) {
	color: #38bdf8;
	background: rgba(255, 255, 255, 0.95);
	width: 32px;
	height: 32px;
	border-radius: 999px;
	border: 1px solid rgba(56, 189, 248, 0.25);
	box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
	transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.main-swiper :deep(.swiper-button-next:hover),
.main-swiper :deep(.swiper-button-prev:hover) {
	background: #ffffff;
	transform: scale(1.06);
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.18);
}
.main-swiper :deep(.swiper-button-next::after),
.main-swiper :deep(.swiper-button-prev::after) {
	font-size: 11px;
	font-weight: 600;
}
.main-swiper :deep(.swiper-button-next svg),
.main-swiper :deep(.swiper-button-prev svg) {
	width: 50%;
	height: 50%;
}

/* Стрелки и пагинация для слайдеров оборудования и решений */
.details-select-inventory :deep(.swiper-button-next),
.details-select-inventory :deep(.swiper-button-prev),
.details-select-solution :deep(.swiper-button-next),
.details-select-solution :deep(.swiper-button-prev) {
	color: #38bdf8;
	background: rgba(255, 255, 255, 0.95);
	width: 32px;
	height: 32px;
	border-radius: 999px;
	border: 1px solid rgba(56, 189, 248, 0.25);
	box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
	transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.details-select-inventory :deep(.swiper-button-next:hover),
.details-select-inventory :deep(.swiper-button-prev:hover),
.details-select-solution :deep(.swiper-button-next:hover),
.details-select-solution :deep(.swiper-button-prev:hover) {
	background: #ffffff;
	transform: scale(1.06);
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.18);
}
.details-select-inventory :deep(.swiper-button-next::after),
.details-select-inventory :deep(.swiper-button-prev::after),
.details-select-solution :deep(.swiper-button-next::after),
.details-select-solution :deep(.swiper-button-prev::after) {
	font-size: 11px;
	font-weight: 600;
}
.details-select-inventory :deep(.swiper-pagination),
.details-select-solution :deep(.swiper-pagination) {
	position: relative;
	margin-top: 1.25rem;
	bottom: auto;
}
.details-select-inventory :deep(.swiper-pagination-bullet-active),
.details-select-solution :deep(.swiper-pagination-bullet-active) {
	background: #38bdf8;
}

@media (max-width: 1220px) {
	.desktop-section.details-select {
		flex-wrap: wrap;
		gap: 1rem 1rem;
		justify-content: space-evenly;
	}
}
@media (max-width: 980px) {
	.desktop-section {
		display: none;
	}
	.mobile-section {
		display: flex;
	}
	.details {
		padding: 0.75rem;
		margin: 0 0 1rem 0;
	}
	.slide-center {
		min-height: 12rem;
		padding: 0.5rem 2rem;
	}
	.catalog-item-card-image {
		max-width: 16rem;
		max-height: 14rem;
	}
	.thumb-image {
		width: 4rem;
		height: 3rem;
	}
	.thumbs-row {
		gap: 0.35rem;
	}
	.buttons-section.catalog-ig-buttons {
		margin: 0.75rem -0.25rem;
	}
	.buttons-section.catalog-ig-buttons .btn {
		padding: 0.75rem 0.5rem;
		margin: 0 0.25rem;
		font-weight: 600;
		font-size: 12px;
	}
	.mobile-section.details-select {
		display: block;
		margin: 0;
	}
	.details-select-mobile-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem;
		margin: 0;
	}
	.mobile-section .details-select-item {
		width: 100%;
		align-self: stretch;
		margin: 0;
		padding: 0.5rem 0.5rem;
		box-sizing: border-box;
	}
	.mobile-section .details-select-item p {
		font-size: 12px;
		line-height: 1.2;
	}
	.mobile-section .details-select-item img {
		display: none;
	}
	.title-brand {
		margin: 0;
	}
	.details-select-settings {
		grid-template-columns: 1fr;
		margin: 1rem 0.25rem;
	}
	.details-select-video {
		margin: 1rem 0;
	}
	.details-select-products {
		gap: 0.75rem;
		margin: 1rem 0 0 0;
	}
	.details-select-products-item {
		margin: 0.25rem 0;
		width: 45%;
	}
	.details-select-products-item h4 {
		font-weight: 600;
		font-size: 12px;
	}
	.details-select-inventory {
		margin: 2rem 0.5rem 0 0.5rem;
	}
	.details-select-inventory-item {
		height: 13rem;
		margin: 0.5rem;
		padding: 1rem 1.5rem;
	}
	.details-select-inventory-item h4 {
		font-weight: 600;
		font-size: 12px;
	}
	.details-select-packet {
		margin: 0;
	}
	.details-select-packet-item {
		width: 45%;
		margin: 0.25rem 0;
	}
	.details-select-packet-item h4 {
		font-weight: 600;
		font-size: 12px;
	}
	.details-select-packet-item img {
		max-width: 7rem;
		width: 100%;
	}
	.solution-intro {
		grid-template-columns: 1fr;
		padding: 1.25rem;
		gap: 1.25rem;
	}
	.solution-intro-image {
		display: none;
	}
	.details-select-solution {
		margin: 2rem 0.5rem 0 0.5rem;
	}
	.details-select-solution-item {
		height: 16rem;
		margin: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
	}
	.details-select-solution-item h4 {
		font-weight: 600;
		font-size: 12px;
	}
	.details-select-solution-item img {
		max-width: 10rem;
		width: 100%;
	}
}
@media (max-width: 420px) {
	.details-select-mobile-grid {
		grid-template-columns: 1fr;
	}
}
</style>
