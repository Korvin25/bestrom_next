<template>
	<div v-if="page" class="cutting-page">
		<!-- Тип пакета -->
		<section v-if="packets.length > 0" id="packetType" class="section">
			<h2 class="section-title">{{ language === 'RU' ? 'Тип пакета' : 'Package type' }}</h2>

			<!-- Мобильная сетка -->
			<div class="packet-mobile">
				<div class="packet-mobile-grid">
					<div
						v-for="packet in activePackets"
						:key="packet.essid"
						:class="{ active: checkType === packet.essid }"
						class="packet-card packet-card--mobile"
						@click="selectType(packet.essid)">
						<NuxtImg
							class="packet-card-image-mobile"
							:src="resolveImage(packet.img)"
							:alt="packet.alt"
							fit="contain"
							background="ffffff" />
						<p class="packet-card-name">{{ language === 'RU' ? packet.name : packet.name_en }}</p>
					</div>
				</div>
			</div>

			<!-- Десктопная сетка -->
			<div class="packet-desktop">
				<div class="packet-grid">
					<div
						v-for="packet in activePackets"
						:key="packet.essid"
						:class="{ active: checkType === packet.essid }"
						class="packet-card"
						@click="selectType(packet.essid)">
						<h3 class="packet-card-title">{{ language === 'RU' ? packet.name : packet.name_en }}</h3>
						<NuxtImg
							class="packet-card-image"
							:src="resolveImage(packet.img)"
							:alt="packet.alt"
							fit="contain"
							background="ffffff"
							width="160"
							height="120" />
					</div>
				</div>
			</div>
		</section>

		<!-- Тип шва -->
		<section v-if="packetsSeams.length > 0" id="packetSeam" class="section">
			<h2 class="section-title">{{ language === 'RU' ? 'Тип шва' : 'Seam type' }}</h2>
			<div class="seam-grid">
				<div
					v-for="seam in packetsSeams"
					:key="seam.essid"
					:class="{ active: checkSeam === seam.essid }"
					class="seam-card"
					@click="selectSeam(seam.essid)">
					<NuxtImg
						class="seam-card-image"
						:src="resolveImage(seam.img)"
						:alt="seam.alt"
						fit="contain"
						background="ffffff"
						width="140"
						height="100" />
					<p class="seam-card-name">{{ language === 'RU' ? seam.name : seam.name_en }}</p>
				</div>
			</div>
		</section>

		<!-- Кнопка подбора -->
		<div class="action-row">
			<button class="action-btn btn" type="button" @click="routerPush">
				{{ language === 'RU' ? 'Подобрать' : 'Pick up' }}
			</button>
		</div>

		<!-- Блоки страницы -->
		<PageBlocks
			v-if="page.blocks?.length"
			:blocks="page.blocks"
			:language="language"
			:media-base="mediaBase" />

		<!-- Модальные окна -->
		<Transition name="modal">
			<AppModalCuttingAlert
				v-if="modalAlert.show"
				:text="modalAlert.text"
				@close="modalAlert.show = false" />
		</Transition>
		<Transition name="modal">
			<AppModalCuttingPickUp
				v-if="showModalCuttingPickUp"
				@close="showModalCuttingPickUp = false" />
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

// --- Типы ---
interface PacketItem {
	essid: number
	name: string
	name_en?: string
	img?: string
	alt?: string
	active?: boolean
}

interface SeamItem {
	essid: number
	name: string
	name_en?: string
	img?: string
	alt?: string
}

interface PageData {
	title?: string
	title_en?: string
	description?: string
	description_en?: string
	seo_title?: string
	seo_title_en?: string
	seo_description?: string
	seo_description_en?: string
	blocks?: any[]
}

// --- Сторы ---
const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)
const config = useRuntimeConfig()
const router = useRouter()

// --- Получение данных страницы, пакетов и швов (SSR) ---
const { data: pageData } = await useFetch<PageData[]>(`${config.public.apiBase}page/5/`)
const { data: packetsData } = await useFetch<any[]>(`${config.public.apiBase}packets/`)
const { data: packetsSeamsData } = await useFetch<any[]>(`${config.public.apiBase}packetseams/`)

const page = computed<PageData | null>(() => pageData.value?.[0] ?? null)
useSeoFromPage(page, language)

const packets = computed(() => packetsData.value || [])
const packetsSeams = computed(() => packetsSeamsData.value || [])

const mediaBase = computed(() => serverMedia.value || config.public.mediaBase)

// --- Вспомогательные функции ---
const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${mediaBase.value}${src.replace(/^\//, '')}`
}

// --- Активные пакеты (только с active === true) ---
const activePackets = computed<PacketItem[]>(() =>
	(packets.value as PacketItem[]).filter((p) => p.active),
)

// --- Состояние выбора ---
const checkType = ref(0)
const checkSeam = ref(0)
const showModalCuttingPickUp = ref(false)
const modalAlert = ref({
	show: false,
	text: '',
})

// --- Блокировка прокрутки при открытии модалки ---
watch(showModalCuttingPickUp, (isOpen) => {
	if (import.meta.client) {
		document.body.classList.toggle('modal-open', isOpen)
	}
})

// --- Плавная прокрутка к элементу ---
const smoothScrollTo = (elementId: string) => {
	if (!import.meta.client) return
	const el = document.getElementById(elementId)
	if (el) {
		const top = el.getBoundingClientRect().top + window.scrollY - 80
		window.scrollTo({ top, behavior: 'smooth' })
	}
}

// --- Выбор типа пакета ---
const selectType = (essid: number) => {
	checkType.value = essid
	nextTick(() => smoothScrollTo('packetSeam'))
}

// --- Выбор типа шва с валидацией ---
const selectSeam = (essid: number) => {
	if (checkType.value === 0) {
		modalAlert.value.text =
			language.value === 'RU'
				? 'Сначала выберите тип пакета!!!'
				: 'First select the type of package !!!'
		modalAlert.value.show = true
		smoothScrollTo('packetType')
	} else {
		checkSeam.value = essid
	}
}

// --- Навигация с валидацией ---
const routerPush = () => {
	if (checkType.value === null) {
		showModalCuttingPickUp.value = true
	} else if (checkType.value !== 0 && checkSeam.value !== 0) {
		router.push(`/cutting/${checkType.value}/${checkSeam.value}`)
		if (import.meta.client) {
			window.scrollTo(0, 0)
		}
	} else if (checkType.value === 0) {
		modalAlert.value.text =
			language.value === 'RU'
				? 'Сначала выберите тип пакета!!!'
				: 'First select the type of package !!!'
		modalAlert.value.show = true
		smoothScrollTo('packetType')
	} else if (checkSeam.value === 0) {
		modalAlert.value.text =
			language.value === 'RU'
				? 'Сначала выберите тип шва!!!'
				: 'First select the type of seam !!!'
		modalAlert.value.show = true
		smoothScrollTo('packetSeam')
	}
}

const { setBreadcrumbs } = useBreadcrumbs()

const updateBreadcrumbs = () => {
	setBreadcrumbs([
		{ label: language.value === 'RU' ? 'Главная' : 'Home', to: '/' },
		{ label: language.value === 'RU' ? 'Раскрой пакета' : 'Package cutting', to: '/cutting' },
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
.cutting-page {
	width: 100%;
	gap: 1.5rem;
	display: flex;
	flex-direction: column;
}

/* --- Секции: отступ для фиксированной шапки при скролле --- */
#packetType,
#packetSeam {
	scroll-margin-top: 6rem;
	padding-top: 1rem;
}

/* --- Заголовки секций --- */
.section-title {
	font-weight: 700;
	font-size: clamp(1.5rem, 1rem + 1.2vw, 2.2rem);
	letter-spacing: 0.01em;
	color: #2fc1ff;
	margin: 0 0 1.25rem 0;
}

/* --- Сетка типов пакетов (десктоп) --- */
.packet-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 1rem;
}

/* --- Карточка пакета --- */
.packet-card {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	text-align: center;
	padding: 1.25rem 1rem;
	border-radius: 18px;
	background: #ffffff;
	border: 1px solid rgba(15, 23, 42, 0.06);
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.packet-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
	border-color: rgba(56, 189, 248, 0.25);
}
.packet-card.active {
	background: #ffffff;
	border-color: #38bdf8;
	border-width: 1px;
	transform: translateY(-3px);
}
.packet-card.active:hover {
	box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2), 0 12px 50px rgba(56, 189, 248, 0.25);
}
.packet-card-title {
	font-weight: 600;
	font-size: 0.95rem;
	color: #2fc1ff;
	margin: 0 0 0.75rem 0;
	line-height: 1.3;
}
.packet-card-image {
	max-width: 100%;
	height: auto;
	object-fit: contain;
	display: block;
}
.packet-card-name {
	font-weight: 600;
	font-size: 0.85rem;
	color: #475569;
	margin: 0.75rem 0 0 0;
	line-height: 1.3;
	word-break: break-word;
	overflow-wrap: break-word;
}

/* --- Сетка типов швов --- */
.seam-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 1rem;
}

/* --- Карточка шва --- */
.seam-card {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	text-align: center;
	padding: 1.25rem 1rem;
	border-radius: 18px;
	background: #ffffff;
	border: 1px solid rgba(15, 23, 42, 0.06);
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.seam-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
	border-color: rgba(56, 189, 248, 0.25);
}
.seam-card.active {
	background: #ffffff;
	border-color: #38bdf8;
	border-width: 1px;
	transform: translateY(-3px);
}
.seam-card.active:hover {
	box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2), 0 12px 50px rgba(56, 189, 248, 0.25);
}
.seam-card-image {
	max-width: 100%;
	height: auto;
	object-fit: contain;
	display: block;
}
.seam-card-name {
	font-weight: 600;
	font-size: 0.85rem;
	color: #475569;
	margin: 0.75rem 0 0 0;
	line-height: 1.3;
}

/* --- Кнопка действия --- */
.action-row {
	display: flex;
	justify-content: center;
	padding: 0.5rem 0;
}
.action-btn {
	padding: 0.9rem 2.5rem;
	border-radius: 999px;
	border: none;
	font-weight: 600;
	font-size: 1.1rem;
	letter-spacing: 0.02em;
	color: #ffffff;
	background: linear-gradient(135deg, #38bdf8, #2fc1ff);
	box-shadow: 0 10px 24px rgba(56, 189, 248, 0.35);
	transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.action-btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 14px 30px rgba(56, 189, 248, 0.45);
	filter: brightness(1.03);
}

/* --- Мобильная сетка пакетов --- */
.packet-mobile-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
}
.packet-card--mobile {
	padding: 0.5rem 0.4rem !important;
	min-width: 0;
}
.packet-card-image-mobile {
	width: 100%;
	height: auto;
	max-height: 70px;
	object-fit: contain;
	display: block;
}

/* --- Десктоп / мобайл переключение --- */
.packet-desktop {
	display: block;
}
.packet-mobile {
	display: none;
}

@media (max-width: 980px) {
	.cutting-page {
		gap: 1rem;
	}
	.packet-desktop {
		display: none;
	}
	.packet-mobile {
		display: block;
	}
	.section-title {
		margin: 0 0 0.75rem 0;
	}
	.seam-grid {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}
	.packet-card,
	.seam-card {
		padding: 1rem 0.75rem;
	}
	.action-btn {
		width: 100%;
		font-size: 1rem;
	}
}

@media (max-width: 675px) {
	.seam-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}
	.packet-card-name,
	.seam-card-name {
		font-size: 0.75rem;
	}
	.packet-card-title {
		font-size: 0.8rem;
	}
	.packet-mobile-grid {
		gap: 0.5rem;
	}
}
</style>
