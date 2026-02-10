<template>
	<div v-if="page">
		<section class="section catalog-filters card-shadow">
			<div class="filters-header">
				<p v-if="selectedFilterLabel" class="filters-selected">
					Выбранный фильтр: {{ selectedFilterLabel }}
				</p>
				<button
					v-if="selectedFilter"
					class="filters-toggle"
					type="button"
					:aria-expanded="isFiltersExpanded ? 'true' : 'false'"
					@click="toggleFilters">
					{{ isFiltersExpanded ? 'Скрыть фильтры' : 'Показать фильтры' }}
					<span class="filters-toggle-icon" aria-hidden="true">▼</span>
				</button>
			</div>
			<div class="filter-categories">
				<button
					v-for="category in filters"
					:key="category.id"
					:class="['filter-category', selectedCategory === category.slug ? 'active' : '']"
					@click="selectCategory(category.slug)">
					<span class="filter-category-text">
						{{ language === 'RU' ? category.name : category.name_en || category.name }}
					</span>
				</button>
			</div>
			<div v-if="isFiltersExpanded && selectedFilters.length" class="filter-options">
				<button
					v-for="filter in selectedFilters"
					:key="filter.id"
					:class="['filter-option', selectedFilter === filter.slug ? 'active' : '']"
					@click="selectFilter(filter.slug)">
					<NuxtImg
						v-if="filter.preview_img || filter.img"
						class="filter-option-image"
						:src="resolveImage(filter.preview_img || filter.img)"
						:alt="language === 'RU' ? filter.name : filter.name_en || filter.name"
						width="96"
						height="96" />
					<span class="filter-option-text">
						{{ language === 'RU' ? filter.name : filter.name_en || filter.name }}
					</span>
				</button>
			</div>
		</section>

		<section class="section catalog-grid">
			<NuxtLink v-for="product in computedProducts" :key="product.id" :to="`/catalog/machine/${product.slug}`" class="catalog-card card-shadow">
				<div class="catalog-card-body">
					<div class="catalog-card-text">
						<h3>{{ language === 'RU' ? product.name : product.name_en || product.name }}</h3>
						<div
							v-if="getProductType(product)"
							class="catalog-card-type"
							v-html="getProductType(product)" />
						<div class="catalog-card-divider"></div>
						<div
							class="catalog-card-description"
							v-html="language === 'RU' ? product.mini_description || product.description : product.mini_description_en || product.description_en || product.description" />
						<span class="catalog-card-action">
							{{ language === 'RU' ? 'ПОДРОБНЕЕ' : 'READ MORE' }}
						</span>
					</div>
					<div class="catalog-card-media">
						<NuxtImg
							v-for="(slide, index) in getProductSlides(product)"
							:key="slide?.id || slide?.img || index"
							:class="['catalog-card-image', { active: index === getProductSlideIndex(product) }]"
							:src="resolveImage(getSlideImage(slide))"
							:alt="getSlideAlt(product, slide)"
							width="420"
							height="320" />
						<div
							v-if="getProductSlides(product).length > 1"
							class="catalog-card-dots"
							aria-hidden="true">
							<span
								v-for="(slide, index) in getProductSlides(product)"
								:key="slide?.id || slide?.img || index"
								:class="['catalog-card-dot', { active: index === getProductSlideIndex(product) }]" />
						</div>
					</div>
				</div>
			</NuxtLink>
		</section>
		<section v-if="showNoProductsForm" class="section catalog-empty">
			<div class="catalog-empty-card card-shadow">
				<h2>{{ language === 'RU' ? 'Отправьте нам вашу заявку' : 'Send us your application' }}</h2>
				<section class="form-call flex-column">
					<label for="company">{{ language === 'RU' ? 'Компания' : 'Company' }}</label>
					<input
						id="company"
						v-model="inputCompany"
						type="text"
						class="input"
						:placeholder="language === 'RU' ? 'БЕСТРОМ' : 'BESTROM'" />
					<label for="fio">{{ language === 'RU' ? 'Ф.И.О' : 'Full name' }}</label>
					<input
						id="fio"
						v-model="inputName"
						type="text"
						class="input"
						:placeholder="language === 'RU' ? 'Иван Иванович' : 'Ivan Ivanovich'" />
					<label for="telephone">{{ language === 'RU' ? 'Телефон' : 'Telephone' }}</label>
					<input
						id="telephone"
						v-model="inputTelephone"
						type="text"
						class="input"
						placeholder="89199966203" />
					<label for="email">E-mail</label>
					<input
						id="email"
						v-model="inputEmail"
						type="text"
						class="input"
						placeholder="partner@thedimension.com" />
					<label for="product">{{ language === 'RU' ? 'Продукт' : 'Product' }}</label>
					<input
						id="product"
						v-model="inputProduct"
						type="text"
						class="input"
						:placeholder="language === 'RU' ? 'Фисташки' : 'Pistachio'" />
					<label for="weight">{{ language === 'RU' ? 'Дозировка' : 'Dosage' }}</label>
					<input
						id="weight"
						v-model="inputDosage"
						type="text"
						class="input"
						:placeholder="language === 'RU' ? '100г' : '100g'" />
					<label for="speed">
						{{ language === 'RU' ? 'Требуемая производительность' : 'Required performance' }}
					</label>
					<input
						id="speed"
						v-model="inputPerformance"
						type="text"
						class="input"
						:placeholder="language === 'RU' ? '60 п/м' : '60 p/m'" />
					<p>{{ language === 'RU' ? 'Удобный способ связи' : 'Convenient way of communication' }}</p>
					<div class="call-method flex-row">
						<button
							type="button"
							class="contact-icon"
							:class="inputCommunication === 'WhatsApp' ? 'active' : ''"
							aria-label="WhatsApp"
							@click="inputCommunication = 'WhatsApp'">
							<img src="/assets/whatsapp.png" alt="WhatsApp" />
						</button>
						<button
							type="button"
							class="contact-icon"
							:class="inputCommunication === 'Telegram' ? 'active' : ''"
							aria-label="Telegram"
							@click="inputCommunication = 'Telegram'">
							<img src="/assets/telegram.png" alt="Telegram" />
						</button>
						<button
							type="button"
							class="contact-icon"
							:class="inputCommunication === 'Viber' ? 'active' : ''"
							aria-label="Viber"
							@click="inputCommunication = 'Viber'">
							<img src="/assets/viber.png" alt="Viber" />
						</button>
						<button
							type="button"
							class="contact-icon"
							:class="inputCommunication === 'E-Mail' ? 'active' : ''"
							aria-label="E-Mail"
							@click="inputCommunication = 'E-Mail'">
							<img src="/assets/email.png" alt="E-Mail" />
						</button>
					</div>
					<button class="call btn" @click="sendPost">
						{{ language === 'RU' ? 'ОТПРАВИТЬ ЗАЯВКУ' : 'SEND AN APPLICATION' }}
					</button>
					<h4 v-if="statusSend.length > 0" class="send-status">{{ statusSend }}</h4>
				</section>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts" async>
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAppStore } from '~/stores/app';

type FilterOption = {
	id: number | string;
	slug: string;
	name: string;
	name_en?: string;
	preview_img?: string | null;
	img?: string | null;
	image?: string | null;
	alt?: string | null;
};

type FilterCategory = {
	id: number | string;
	slug: string;
	name: string;
	name_en?: string;
	Filters?: FilterOption[];
};

type Slide = {
	id?: number | string;
	img?: string | null;
	preview_img?: string | null;
	image?: string | null;
	alt?: string | null;
};

type ProductSlide = Slide | string;

type Product = {
	id: number | string;
	slug: string;
	name: string;
	name_en?: string;
	mini_description?: string;
	mini_description_en?: string;
	description?: string;
	description_en?: string;
	preview_img?: string | null;
	img?: string | null;
	category_filters?: FilterOption[];
	SliderProd?: ProductSlide[];
	ProductPropertyValue?: Array<{
		id?: number | string;
		name?: string;
		name_en?: string;
		product_property?: {
			name?: string;
			name_en?: string;
		};
	}>;
};

type PageItem = {
	id?: number | string;
	slug?: string;
};

const props = defineProps<{ radioSlug?: string; filterSlug?: string }>()

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()
const router = useRouter()

const { data: pageData } = await useFetch<PageItem[]>(`${config.public.apiBase}page/4/`)
const { data: filtersData } = await useFetch<FilterCategory[]>(`${config.public.apiBase}filters/`)
const { data: productsData } = await useFetch<Product[]>(`${config.public.apiBase}product/`)

const page = computed(() => (pageData.value?.length ? pageData.value[0] : null))

const filters = computed<FilterCategory[]>(() => filtersData.value || [])
const products = computed<Product[]>(() => productsData.value || [])

const selectedCategory = computed(() => props.radioSlug || filters.value?.[0]?.slug || '')
const selectedFilter = computed(() => props.filterSlug || '')
const isFiltersExpanded = ref(!selectedFilter.value)

const selectedFilters = computed<FilterOption[]>(() => {
	const category = filters.value.find((item) => item.slug === selectedCategory.value)
	return category?.Filters || []
})
const selectedFilterLabel = computed(() => {
	if (!selectedFilter.value) return ''
	const currentFilter = selectedFilters.value.find((item: any) => item.slug === selectedFilter.value)
	if (!currentFilter) return ''
	return language.value === 'RU'
		? currentFilter.name
		: currentFilter.name_en || currentFilter.name
})
const defaultSeoTitle = computed(() =>
	language.value === 'RU' ? 'Каталог оборудования | BESTROM' : 'Equipment catalog | BESTROM'
)
const defaultSeoDescription = 'Широкий выбор промышленного оборудования для пищевой промышленности'
const seoTitle = computed(() =>
	selectedFilterLabel.value ? `${selectedFilterLabel.value} | ${defaultSeoTitle.value}` : defaultSeoTitle.value
)
const seoDescription = computed(() => defaultSeoDescription)

useSeoMeta({
	title: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
})

const computedProducts = computed<Product[]>(() => {
	let tempProducts = products.value.slice()
	if (selectedFilter.value) {
		tempProducts = tempProducts.filter((product) => {
			if (Array.isArray(product.category_filters)) {
				return product.category_filters.some((filter) => filter.slug === selectedFilter.value)
			}
			return false
		})
	}
	return tempProducts
})
const showNoProductsForm = computed(
	() => Array.isArray(productsData.value) && computedProducts.value.length === 0
)

const inputCompany = ref('')
const inputName = ref('')
const inputTelephone = ref('')
const inputEmail = ref('')
const inputProduct = ref('')
const inputDosage = ref('')
const inputPerformance = ref('')
const inputCommunication = ref('')
const statusSend = ref('')

const sendPost = async () => {
	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length > 0 &&
		inputProduct.value.length > 0 &&
		inputCompany.value.length > 0 &&
		inputDosage.value.length > 0 &&
		inputPerformance.value.length > 0
	) {
		try {
			await $fetch(`${appStore.server}forms/`, {
				method: 'POST',
				body: {
					type: 'Заявка',
					telephone: inputTelephone.value,
					email: inputEmail.value,
					name: inputName.value,
					other: `Компания: ${inputCompany.value}, Продукт: ${inputProduct.value}, Дозировка: ${inputDosage.value}, Производительность: ${inputPerformance.value}, Удобный способ связи: ${inputCommunication.value}`,
				},
			})
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputProduct.value = ''
			inputDosage.value = ''
			inputPerformance.value = ''
			inputCommunication.value = ''
			statusSend.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Request sent!'
		} catch (error: any) {
			statusSend.value = `${language.value === 'RU' ? 'Ошибка отправки заявки!' : 'Send error!'} ${error}`
			console.error(error)
		}
	} else {
		alert(language.value === 'RU' ? 'Проверьте правильность ввода всех полей!' : 'Check all fields!')
	}
}

const sliderIndexes = ref<Record<string, number>>({})
const sliderIntervalId = ref<number | null>(null)

const normalizeSlide = (slide: ProductSlide): Slide =>
	typeof slide === 'string' ? { img: slide } : slide

const getProductSlides = (product: Product): Slide[] => {
	if (Array.isArray(product?.SliderProd) && product.SliderProd.length > 0) {
		return product.SliderProd.map(normalizeSlide)
	}
	if (product?.preview_img || product?.img) {
		return [{ id: `single-${product.id}`, img: product.preview_img || product.img }]
	}
	return []
}

const getSlideImage = (slide: Slide) => {
	if (!slide) return ''
	return slide.img || slide.preview_img || slide.image || ''
}

const getSlideAlt = (product: Product, slide: Slide) => {
	if (slide.alt) return slide.alt
	return language.value === 'RU' ? product?.name : product?.name_en || product?.name || ''
}

const getProductSlideIndex = (product: Product) => {
	const key = String(product?.id ?? '')
	return sliderIndexes.value[key] ?? 0
}

const tickProductSlides = () => {
	if (!computedProducts.value?.length) return
	const nextIndexes: Record<string, number> = { ...sliderIndexes.value }

	computedProducts.value.forEach((product) => {
		const slides = product?.SliderProd
		if (Array.isArray(slides) && slides.length > 1) {
			const key = String(product.id)
			const current = nextIndexes[key] ?? 0
			nextIndexes[key] = (current + 1) % slides.length
		}
	})

	sliderIndexes.value = nextIndexes
}

watch(
	computedProducts,
	(items) => {
		const nextIndexes: Record<string, number> = {}
		items.forEach((product) => {
			const key = String(product?.id ?? '')
			if (!key) return
			nextIndexes[key] = sliderIndexes.value[key] ?? 0
		})
		sliderIndexes.value = nextIndexes
	},
	{ immediate: true }
)

onMounted(() => {
	sliderIntervalId.value = window.setInterval(tickProductSlides, 4000)
})

onBeforeUnmount(() => {
	if (sliderIntervalId.value) {
		window.clearInterval(sliderIntervalId.value)
	}
})

const selectCategory = (slug: string) => {
	router.push(`/catalog/type/${slug}`)
}

const selectFilter = (slug: string) => {
	router.push(`/catalog/type/${selectedCategory.value}/${slug}`)
	isFiltersExpanded.value = false
}

watch(
	() => selectedFilter.value,
	(value) => {
		if (!value) {
			isFiltersExpanded.value = true
		}
	}
)

const toggleFilters = () => {
	isFiltersExpanded.value = !isFiltersExpanded.value
}

const getProductType = (product: Product) => {
	const properties = product?.ProductPropertyValue
	if (!Array.isArray(properties)) return ''
	const typeProperty = properties.find(
		(item) => item?.product_property?.name === 'Тип машины' || item?.product_property?.name_en === 'Machine type'
	)
	if (!typeProperty) return ''
	return language.value === 'RU'
		? typeProperty.name || ''
		: typeProperty.name_en || typeProperty.name || ''
}

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)
const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

// Breadcrumbs
const { setBreadcrumbs } = useBreadcrumbs()

const updateBreadcrumbs = () => {
	const crumbs = [
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Каталог' : 'Catalog', to: '/catalog' }
	]

	if (selectedCategory.value) {
		const category = filters.value.find(c => c.slug === selectedCategory.value)
		if (category) {
			const catName = language.value === 'RU' ? category.name : category.name_en || category.name
			crumbs.push({ label: catName, to: `/catalog/type/${category.slug}` })

			if (selectedFilter.value) {
				const filter = category.Filters?.find(f => f.slug === selectedFilter.value)
				if (filter) {
					const filterName = language.value === 'RU' ? filter.name : filter.name_en || filter.name
					crumbs.push({ label: filterName, to: `/catalog/type/${category.slug}/${filter.slug}` })
				}
			}
		}
	}

	setBreadcrumbs(crumbs)
}

onMounted(() => {
	updateBreadcrumbs()
})

watch([language, selectedCategory, selectedFilter, filters], () => {
	updateBreadcrumbs()
})
</script>

<style scoped>
.catalog-filters {
	padding: 1.5rem;
	margin-top: 2.5rem;
	margin-bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	box-sizing: border-box;
	background: #ffffff;
	border: 1px solid rgba(16, 24, 40, 0.06);
	border-radius: 16px;
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}
.filters-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
}
.filters-selected {
	margin: 0;
	font-size: 0.95rem;
	color: #475569;
}
.filters-toggle {
	border: 0;
	background: transparent;
	color: #0ea5e9;
	font-weight: 600;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0;
}
.filters-toggle-icon {
	font-size: 0.7rem;
	transform: rotate(0deg);
	transition: transform 0.16s ease;
}
.filters-toggle:focus-visible {
	outline: 2px solid rgba(14, 165, 233, 0.45);
	outline-offset: 2px;
}
.filters-toggle[aria-expanded='false'] .filters-toggle-icon {
	transform: rotate(-90deg);
}
.filter-categories,
.filter-options {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 1.25rem;
}
.filter-category,
.filter-option {
	border: 0;
	background: transparent;
	padding: 0;
	cursor: pointer;
	font-size: 0.98rem;
	font-weight: 500;
	color: #6b7280;
	transition: color 0.16s ease;
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
}
.filter-category.active,
.filter-option.active {
	color: #0ea5e9;
	font-weight: 600;
}
.filter-category:hover,
.filter-option:hover {
	color: #1f2937;
}
.filter-category:focus-visible,
.filter-option:focus-visible {
	outline: 2px solid rgba(14, 165, 233, 0.45);
	outline-offset: 2px;
}
.filter-category::before {
	content: '';
	width: 12px;
	height: 12px;
	border-radius: 999px;
	border: 2px solid #cbd5f5;
	background: #ffffff;
	box-sizing: border-box;
	transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
}
.filter-category.active::before {
	border-color: #0ea5e9;
	background: #0ea5e9;
	box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.18);
}
.filter-options {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 1.2rem;
}
.filter-option {
	border: 1px solid rgba(148, 163, 184, 0.45);
	background: #ffffff;
	border-radius: 16px;
	padding: 1rem 0.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.65rem;
	min-height: 150px;
	color: #334155;
	transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease, background 0.16s ease;
}
.filter-option:hover {
	background: #ffffff;
	border-color: rgba(14, 165, 233, 0.35);
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
	transform: translateY(-2px);
}
.filter-option.active {
	background: #ffffff;
	border-color: rgba(14, 165, 233, 0.5);
	box-shadow: 0 12px 26px rgba(14, 165, 233, 0.12);
}
.filter-option-image {
	width: 96px;
	height: 96px;
	object-fit: contain;
}
.filter-option-text {
	font-size: 0.95rem;
	text-align: center;
}
.catalog-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.75rem;
	align-items: stretch;
	width: 100%;
	box-sizing: border-box;
}
.catalog-card {
	padding: 1.5rem 1.75rem;
	border-radius: 18px;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background: #ffffff;
	border: 1px solid rgba(16, 24, 40, 0.06);
	box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	text-decoration: none;
	color: inherit;
	min-height: 240px;
	height: 100%;
	overflow: hidden;
	position: relative;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
}
.catalog-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
	border-color: rgba(14, 165, 233, 0.25);
}
.catalog-card-body {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 1rem;
	flex: 1;
}
.catalog-card-text {
	display: flex;
	flex-direction: column;
	min-height: 170px;
	overflow: visible;
	flex: 1;
}
.catalog-card-text h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.1rem;
	color: #0f172a;
}
.catalog-card-divider {
	width: 100%;
	height: 1px;
	background: rgba(14, 165, 233, 0.35);
	margin: 0.35rem 0 0.75rem;
}
.catalog-card-description {
	margin: 0 0 1rem 0;
	color: #475569;
	font-size: 0.95rem;
	line-height: 1.4;
	opacity: 1;
	visibility: visible;
}
.catalog-card-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem 1.2rem;
	border-radius: 999px;
	background: #38bdf8;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.85rem;
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.35);
	margin-top: auto;
}
.catalog-card-description p {
	margin: 0 0 0.6rem 0;
}
.catalog-card-description p:last-child {
	margin-bottom: 0;
}
.catalog-card-media {
	position: relative;
	display: grid;
	place-items: center;
	min-height: 240px;
	height: 240px;
	flex: 0 0 240px;
	order: -1;
	overflow: hidden;
}
.catalog-card-dots {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 12px;
	display: flex;
	justify-content: center;
	gap: 6px;
}
.catalog-card-dot {
	width: 6px;
	height: 6px;
	border-radius: 999px;
	background: rgba(15, 23, 42, 0.25);
}
.catalog-card-dot.active {
	background: rgba(14, 165, 233, 0.9);
}
.catalog-card-image {
	grid-area: 1 / 1;
	margin: auto;
	width: 100%;
	height: auto;
	max-height: 240px;
	object-fit: contain;
	opacity: 0;
	transform: translateY(6px) scale(0.98);
	transition: opacity 0.45s ease, transform 0.45s ease;
}
.catalog-card-image.active {
	opacity: 1;
	transform: translateY(0) scale(1);
}
.catalog-empty {
	margin-top: 2rem;
}
.catalog-empty-card {
	padding: 2rem 2.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	border-radius: 18px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}
.form-call {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.form-call .input {
	padding: 0.55rem 1rem;
	border: 1px solid rgba(15, 23, 42, 0.12);
	border-radius: 14px;
	font-size: 0.95rem;
	background: #ffffff;
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
	transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
	margin: 0;
}
.form-call .input:focus {
	outline: none;
	border-color: rgba(14, 165, 233, 0.7);
	background: #ffffff;
	transform: translateY(0);
}
.call-method {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	justify-content: flex-start;
}
.contact-icon {
	border: 1px solid rgba(15, 23, 42, 0.12);
	background: #ffffff;
	width: 40px;
	height: 40px;
	border-radius: 12px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}
.contact-icon img {
	width: 22px;
	height: 22px;
	object-fit: contain;
}
.contact-icon.active {
	border-color: rgba(14, 165, 233, 0.5);
	box-shadow: 0 6px 16px rgba(14, 165, 233, 0.18);
	transform: translateY(-1px);
}
.contact-icon:hover {
	border-color: rgba(15, 23, 42, 0.2);
	box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
}
.catalog-empty .call.btn {
	align-self: flex-start;
	padding: 0.55rem 1.4rem;
	border-radius: 999px;
	background: #38bdf8;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.85rem;
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.35);
	border: none;
	cursor: pointer;
}
@media (max-width: 900px) {
	.catalog-card-body {
		gap: 0.85rem;
	}
}
@media (max-width: 980px) {
	.catalog-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}
}
@media (max-width: 640px) {
	.catalog-grid {
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
}
</style>
