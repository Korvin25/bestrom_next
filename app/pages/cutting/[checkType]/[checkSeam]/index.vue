<template>
	<div v-if="objectType && objectSeam" class="unique-cutting-page">
		<!-- Заголовки: тип пакета и шва -->
		<section class="info-header">
			<h2>
				{{ language === 'RU' ? 'Пакет' : 'Package' }} — "{{ language === 'RU' ? objectType.name : objectType.name_en }}"
			</h2>
			<h2 class="info-header-seam">
				{{ language === 'RU' ? 'Шов' : 'Seam' }} — "{{ language === 'RU' ? objectSeam.name : objectSeam.name_en }}"
			</h2>
		</section>

		<!-- Схема пакета в карточке -->
		<section class="scheme-card">
			<img
				v-if="schemeImage"
				class="scheme-image"
				:src="schemeImage"
				alt="Схема пакета" />
		</section>

		<!-- Размеры пакета -->
		<section class="dimensions-section">
			<h2>{{ language === 'RU' ? 'Размеры пакета' : 'Package dimensions' }}</h2>

			<div class="dimensions-card">
				<!-- Ряд 1: Поля ввода в одну строку -->
				<div class="dimensions-row">
					<div class="dimension-field">
						<span class="dimension-label">
							{{ language === 'RU' ? 'Ширина пакета (A), мм:' : 'Package width (A), mm:' }}
						</span>
						<input
							v-model.number="wPak"
							class="input dimension-input"
							type="number"
							placeholder="100"
							step="10" />
					</div>

					<div v-if="hasDepth" class="dimension-field">
						<span class="dimension-label">
							{{ language === 'RU' ? 'Глубина пакета (B), мм:' : 'Package depth (B), mm:' }}
						</span>
						<input
							v-model.number="dPak"
							class="input dimension-input"
							type="number"
							placeholder="50"
							step="10" />
					</div>

					<div class="dimension-field">
						<span class="dimension-label">
							{{ language === 'RU' ? 'Ширина шва (S):' : 'Seam width (S):' }}
						</span>
						<div class="seam-options">
							<label
								v-for="option in seamWidthOptions"
								:key="option.value"
								class="seam-option"
								:class="{ active: wSh === option.value }">
								<input
									v-model="wSh"
									type="radio"
									name="w_sh"
									:value="option.value"
									class="seam-option-input" />
								<span class="seam-option-text">
									{{ language === 'RU' ? option.labelRu : option.labelEn }}{{ language === 'RU' ? 'мм' : 'mm' }}
								</span>
							</label>
						</div>
					</div>
				</div>

				<!-- Ряд 2: Справочная информация -->
				<div class="dimensions-row">
					<div v-if="hasDepth" class="info-block">
						<p>
							{{ language === 'RU' ? 'Глубина пакета' : 'Package depth' }}
							<b>B</b> —
							{{ language === 'RU' ? 'не более 110мм' : 'no more than 110mm' }}
						</p>
						<p>
							{{ language === 'RU' ? 'Сумма ширины и глубины' : 'Sum of width and depth' }}
							<b>A + B</b> —
							{{ language === 'RU' ? 'от 60мм до 600мм' : 'from 60mm to 600mm' }}
						</p>
						<p>
							{{ language === 'RU' ? 'Соотношение ширины и глубины' : 'Width to depth ratio' }}
							<b>A / B</b> —
							{{ language === 'RU' ? 'от 1.2 до 4.45' : 'from 1.2 to 4.45' }}
						</p>
					</div>
					<div v-else class="info-block">
						<p>{{ language === 'RU' ? 'от 60мм до 600мм' : 'from 60mm to 600mm' }}</p>
					</div>

					<div class="info-block">
						<p>{{ language === 'RU' ? 'Рекомендуемая ширина шва' : 'Recommended seam width' }}</p>
						<template v-if="isPlPr">
							<p>{{ language === 'RU' ? 'для форматов до F100 — 12,5мм' : 'for formats up to F100 — 12.5mm' }}</p>
							<p>{{ language === 'RU' ? 'с F100 до F220 — 15мм' : 'from F100 to F220 — 15mm' }}</p>
							<p>{{ language === 'RU' ? 'с F220 до F280 — 20мм' : 'from F220 to F280 — 20mm' }}</p>
							<p>{{ language === 'RU' ? 'с F280 и больше — 25мм' : 'with F280 and more — 25mm' }}</p>
						</template>
						<template v-else>
							<p>{{ language === 'RU' ? 'для форматов до F100 — 15мм' : 'for formats up to F100 — 15mm' }}</p>
							<p>{{ language === 'RU' ? 'с F100 до F220 — 20мм' : 'from F100 to F220 — 20mm' }}</p>
							<p>{{ language === 'RU' ? 'с F220 до F280 — 25мм' : 'from F220 to F280 — 25mm' }}</p>
							<p>{{ language === 'RU' ? 'с F280 и больше — 30мм' : 'with F280 and more — 30mm' }}</p>
						</template>
					</div>
				</div>

				<!-- Ряд 3: Результат валидации -->
				<div class="validation-row">
					<template v-if="hasDepth">
						<span class="validation-item">
							B = <span :class="dPak <= 110 ? 'val-ok' : 'val-err'">{{ dPak }}</span>
						</span>
						<span class="validation-item">
							A + B = {{ language === 'RU' ? 'Формат' : 'Format' }}
							<span :class="sumAB >= 60 && sumAB <= 600 ? 'val-ok' : 'val-err'">F{{ sumAB }}</span>
						</span>
						<span class="validation-item">
							A / B =
							<span :class="ratioAB >= 1.2 && ratioAB <= 4.45 ? 'val-ok' : 'val-err'">
								{{ ratioAB.toFixed(2) }}
							</span>
						</span>
					</template>
					<template v-else>
						<span class="validation-item">
							A = {{ language === 'RU' ? 'Формат' : 'Format' }}
							<span :class="wPak >= 60 && wPak <= 600 ? 'val-ok' : 'val-err'">F{{ wPak }}</span>
						</span>
					</template>
				</div>
			</div>
		</section>

		<!-- Кнопки навигации -->
		<div class="buttons-row">
			<button class="nav-btn nav-btn--back" type="button" @click="goBack">
				{{ language === 'RU' ? 'Назад' : 'Back' }}
			</button>
			<button class="nav-btn nav-btn--next" type="button" @click="goNext">
				{{ language === 'RU' ? 'Дальше' : 'Next' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSeoFromPage } from '~/composables/useSeoFromPage'
import { useAppStore } from '~/stores/app'
import { usePacketsStore } from '~/stores/packets'

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
const packetsStore = usePacketsStore()
const { language } = storeToRefs(appStore)
const { packets, packetsSeams } = storeToRefs(packetsStore)
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// --- SEO ---
const { data: pageData } = await useFetch<PageData[]>(`${config.public.apiBase}page/5/`)
const page = computed<PageData | null>(() => pageData.value?.[0] ?? null)
useSeoFromPage(page, language)

// --- Параметры маршрута ---
const checkType = computed(() => route.params.checkType as string)
const checkSeam = computed(() => route.params.checkSeam as string)

// --- Загрузка данных ---
onMounted(async () => {
	if (packets.value.length === 0) {
		await packetsStore.loadPackets()
	}
	if (packetsSeams.value.length === 0) {
		await packetsStore.loadPacketsSeams()
	}
})

// --- Поиск объектов типа и шва ---
const objectType = computed<PacketItem | undefined>(() =>
	(packets.value as PacketItem[]).find((e) => String(e.essid) === String(checkType.value)),
)
const objectSeam = computed<SeamItem | undefined>(() =>
	(packetsSeams.value as SeamItem[]).find((e) => String(e.essid) === String(checkSeam.value)),
)

// --- Типы, для которых НЕТ глубины (B) ---
const FLAT_TYPES = [1, 3, 6, 8]
const hasDepth = computed(() => !FLAT_TYPES.includes(Number(checkType.value)))

// --- Схема пакета ---
const schemeImage = computed(() => `/assets/p${checkType.value}h_${checkSeam.value}.png`)

// --- Состояние формы ---
const wPak = ref(100)
const dPak = ref(50)
const wSh = ref('20')

// --- Тип шва pl/pr ---
const isPlPr = computed(() => ['pl', 'pr'].includes(String(checkSeam.value).toLowerCase()))

// --- Опции ширины шва ---
const seamWidthOptions = computed(() => {
	if (isPlPr.value) {
		return [
			{ value: '12.5', labelRu: '12,5', labelEn: '12.5' },
			{ value: '15', labelRu: '15', labelEn: '15' },
			{ value: '20', labelRu: '20', labelEn: '20' },
			{ value: '25', labelRu: '25', labelEn: '25' },
		]
	}

	return [
		{ value: '15', labelRu: '15', labelEn: '15' },
		{ value: '20', labelRu: '20', labelEn: '20' },
		{ value: '25', labelRu: '25', labelEn: '25' },
		{ value: '30', labelRu: '30', labelEn: '30' },
	]
})

// --- Вычисления для валидации ---
const sumAB = computed(() => wPak.value + dPak.value)
const ratioAB = computed(() => (dPak.value > 0 ? wPak.value / dPak.value : 0))

// --- Навигация ---
const goBack = () => {
	router.push('/cutting')
}

const goNext = () => {
	if (hasDepth.value) {
		router.push(`/cutting/${checkType.value}/${checkSeam.value}/${wPak.value}/${dPak.value}/${wSh.value}`)
	} else {
		router.push(`/cutting/${checkType.value}/${checkSeam.value}/${wPak.value}/d_pak/${wSh.value}`)
	}
}
</script>

<style scoped>
.unique-cutting-page {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

/* --- Заголовки --- */
.info-header {
	padding-top: 2rem;
}
.info-header h2 {
	margin: 0 0 0.5rem 0;
	color: #0f172a;
}
.info-header-seam {
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
	max-height: 22rem;
	height: auto;
	object-fit: contain;
	display: block;
}

/* --- Секция размеров --- */
.dimensions-section {
	scroll-margin-top: 6rem;
}
.dimensions-section h2 {
	color: #0f172a;
}

/* --- Основная карточка (стиль details из каталога) --- */
.dimensions-card {
	padding: 1.5rem;
	border-radius: 24px;
	background: #f8fafc;
	box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.15);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* --- Ряды внутри карточки --- */
.dimensions-row {
	display: flex;
	gap: 0.75rem;
}

/* --- Поля ввода --- */
.dimension-field {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem 1.25rem;
	border-radius: 16px;
	background: #ffffff;
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}
.dimension-label {
	font-weight: 600;
	font-size: 0.88rem;
	color: #475569;
	white-space: nowrap;
}
.dimension-input {
	width: 100%;
}

/* --- Радиокнопки ширины шва --- */
.seam-options {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}
.seam-option {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.4rem 0.85rem;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, 0.1);
	background: #ffffff;
	cursor: pointer;
	transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.seam-option:hover {
	border-color: rgba(56, 189, 248, 0.4);
	box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1);
	transform: translateY(-1px);
}
.seam-option.active {
	border-color: #38bdf8;
	background: #e0f2fe;
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.2);
	transform: translateY(-1px);
}
.seam-option-input {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}
.seam-option-text {
	font-weight: 600;
	font-size: 0.85rem;
	color: #334155;
}
.seam-option.active .seam-option-text {
	color: #0369a1;
}

/* --- Блоки справочной информации --- */
.info-block {
	flex: 1;
	padding: 1rem 1.25rem;
	border-radius: 16px;
	background: #ffffff;
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
	font-size: 0.88rem;
	color: #475569;
	line-height: 1.7;
}
.info-block p {
	margin: 0 0 0.15rem 0;
}
.info-block b {
	color: #0f172a;
	font-weight: 700;
}

/* --- Ряд валидации --- */
.validation-row {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 1rem 1.25rem;
	border-radius: 16px;
	background: #ffffff;
	box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}
.validation-item {
	font-weight: 600;
	font-size: 0.95rem;
	color: #334155;
}
.val-ok {
	color: #0284c7;
	font-weight: 700;
}
.val-err {
	color: #ef4444;
	font-weight: 700;
}

/* --- Кнопки навигации (стиль из каталога) --- */
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
	transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.nav-btn--next {
	color: #ffffff;
	background: linear-gradient(135deg, #38bdf8, #2fc1ff);
	box-shadow: 0 10px 24px rgba(56, 189, 248, 0.35);
}
.nav-btn--next:hover {
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
	.unique-cutting-page {
		gap: 0.5rem;
	}
	.scheme-card {
		padding: 1rem 0.5rem;
		border-radius: 16px;
	}
	.scheme-image {
		max-height: 16rem;
	}
	.dimensions-card {
		padding: 0.75rem;
		border-radius: 18px;
	}
	.dimensions-row {
		flex-direction: column;
		gap: 0.5rem;
	}
	.dimension-field {
		padding: 0.75rem 1rem;
		border-radius: 14px;
	}
	.info-block {
		padding: 0.75rem 1rem;
		border-radius: 14px;
	}
	.validation-row {
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 14px;
		text-align: center;
	}
	.buttons-row {
		gap: 0.75rem;
	}
	.nav-btn {
		flex: 1;
		font-size: 1rem;
		padding: 0.8rem 1.25rem;
	}
}

@media (max-width: 630px) {
	.seam-options {
		gap: 0.35rem;
	}
	.seam-option {
		padding: 0.35rem 0.65rem;
	}
	.seam-option-text {
		font-size: 0.8rem;
	}
}
</style>
