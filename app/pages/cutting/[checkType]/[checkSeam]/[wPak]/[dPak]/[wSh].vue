<template>
	<div v-if="objectType && objectSeam" class="result-cutting-page">
		<!-- Заголовки параметров -->
		<section class="info-header">
			<h2>
				{{ language === 'RU' ? 'Пакет' : 'Package' }} — "{{ language === 'RU' ? objectType.name : objectType.name_en }}"
			</h2>
			<h2 class="info-header-sub">
				{{ language === 'RU' ? 'Шов' : 'Seam' }} — "{{ language === 'RU' ? objectSeam.name : objectSeam.name_en }}"
			</h2>
			<h2 class="info-header-sub">
				{{ language === 'RU' ? 'Ширина пакета (A):' : 'Package width (A):' }}
				"{{ wPak }}{{ language === 'RU' ? 'мм' : 'mm' }}"
			</h2>
			<h2 v-if="hasDepth" class="info-header-sub">
				{{ language === 'RU' ? 'Глубина пакета (B):' : 'Package depth (B):' }}
				"{{ dPak }}{{ language === 'RU' ? 'мм' : 'mm' }}"
			</h2>
			<h2 class="info-header-sub">
				{{ language === 'RU' ? 'Ширина шва (S):' : 'Seam width (S):' }}
				"{{ wSh }}{{ language === 'RU' ? 'мм' : 'mm' }}"
			</h2>
		</section>

		<!-- Схема раскроя (изображение с сервера) -->
		<section class="scheme-card">
			<img
				v-if="resultImageUrl"
				class="scheme-image"
				:src="resultImageUrl"
				alt="Схема раскроя" />
		</section>

		<!-- Кнопки действий -->
		<div class="buttons-row">
			<button class="nav-btn nav-btn--back" type="button" @click="goBack">
				{{ language === 'RU' ? 'Назад' : 'Back' }}
			</button>
			<button class="nav-btn nav-btn--action" type="button" @click="printPage">
				{{ language === 'RU' ? 'Напечатать' : 'Print' }}
			</button>
			<a :href="resultImageUrl" download target="_blank" class="nav-btn nav-btn--action">
				{{ language === 'RU' ? 'Сохранить' : 'Save' }}
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'

// --- Типы ---
interface PacketItem {
	essid: number | string
	name: string
	name_en?: string
}

interface SeamItem {
	essid: number | string
	name: string
	name_en?: string
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
}

// --- Сторы и конфиг ---
const appStore = useAppStore()
const { language, serverRaskroy } = storeToRefs(appStore)
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// --- Получение данных страницы, пакетов и швов (SSR) ---
const { data: pageData } = await useFetch<PageData[]>(`${config.public.apiBase}page/5/`)
const { data: packetsData } = await useFetch<any[]>(`${config.public.apiBase}packets/`)
const { data: packetsSeamsData } = await useFetch<any[]>(`${config.public.apiBase}packetseams/`)

const page = computed<PageData | null>(() => pageData.value?.[0] ?? null)
useSeoFromPage(page, language)

const packets = computed(() => packetsData.value || [])
const packetsSeams = computed(() => packetsSeamsData.value || [])

// --- Параметры маршрута ---
const checkType = computed(() => route.params.checkType as string)
const checkSeam = computed(() => route.params.checkSeam as string)
const wPak = computed(() => route.params.wPak as string)
const dPak = computed(() => route.params.dPak as string)
const wSh = computed(() => route.params.wSh as string)

// --- Поиск объектов типа и шва ---
const objectType = computed<PacketItem | undefined>(() =>
	(packets.value as PacketItem[]).find((e) => String(e.essid) === String(checkType.value)),
)
const objectSeam = computed<SeamItem | undefined>(() =>
	(packetsSeams.value as SeamItem[]).find((e) => String(e.essid) === String(checkSeam.value)),
)

// --- Типы без глубины (B) ---
const FLAT_TYPES = [1, 3, 6, 8]
const hasDepth = computed(() => !FLAT_TYPES.includes(Number(checkType.value)))

// --- URL изображения раскроя с сервера ---
const raskroyBase = computed(() => serverRaskroy.value || config.public.raskroyBase)

const resultImageUrl = computed(() => {
	const base = `${raskroyBase.value}service/raskroy-paketov/cp${checkType.value}_i.php`
	if (hasDepth.value) {
		return `${base}?w_pak=${wPak.value}&d_pak=${dPak.value}&w_sh=${wSh.value}&sh=${checkSeam.value}`
	}
	return `${base}?w_pak=${wPak.value}&w_sh=${wSh.value}&sh=${checkSeam.value}`
})

// --- Навигация ---
const goBack = () => {
	router.push(`/cutting/${checkType.value}/${checkSeam.value}`)
}

// --- Печать ---
const printPage = () => {
	if (import.meta.client) {
		window.print()
	}
}
</script>

<style scoped>
.result-cutting-page {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

/* --- Заголовки --- */
.info-header {
	padding-top: 1rem;
}
.info-header h2 {
	margin: 0 0 0.5rem 0;
	color: #2fc1ff;
}
.info-header-sub {
	margin-top: 0 !important;
}

/* --- Схема в карточке (стиль slider-content из каталога) --- */
.scheme-card {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1.5rem 1rem;
	border-radius: 20px;
	background: #ffffff;
	box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
}
.scheme-image {
	max-width: 100%;
	height: auto;
	object-fit: contain;
	display: block;
}

/* --- Кнопки действий (стиль из каталога) --- */
.buttons-row {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	padding: 1rem 0;
}
.nav-btn {
	padding: 0.9rem 2.5rem;
	border-radius: 999px;
	border: none;
	font-weight: 600;
	font-size: 1.1rem;
	letter-spacing: 0.02em;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.nav-btn--action {
	color: #ffffff;
	background: linear-gradient(135deg, #38bdf8, #2fc1ff);
	box-shadow: 0 10px 24px rgba(56, 189, 248, 0.35);
}
.nav-btn--action:hover {
	transform: translateY(-1px);
	box-shadow: 0 14px 30px rgba(56, 189, 248, 0.45);
	filter: brightness(1.03);
}
.nav-btn--back {
	color: #475569;
	background: #ffffff;
	border: 2px solid rgba(15, 23, 42, 0.1);
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}
.nav-btn--back:hover {
	transform: translateY(-1px);
	box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
	border-color: rgba(56, 189, 248, 0.3);
}

/* --- Адаптив --- */
@media (max-width: 980px) {
	.result-cutting-page {
		gap: 0.5rem;
	}
	.scheme-card {
		padding: 1rem 0.5rem;
		border-radius: 16px;
	}
	.scheme-image {
		width: 100%;
	}
	.buttons-row {
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.nav-btn {
		flex: 1;
		font-size: 1rem;
		padding: 0.8rem 1.25rem;
	}
}

/* --- Стили для печати --- */
@media print {
	.buttons-row {
		display: none;
	}
}
</style>
