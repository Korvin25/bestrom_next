<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="modelValue" class="modal-background" @click.self="closeModal">
				<div class="modal-window card-shadow">
					<!-- Кнопка закрытия -->
					<button class="close-button" type="button" aria-label="Закрыть" @click="closeModal">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>

					<!-- Заголовок -->
					<h2 class="modal-title">{{ modalTitle }}</h2>

					<!-- Контент модалки -->
					<div class="modal-content">
						<!-- Логотип -->
						<div v-if="entity.logo" class="modal-logo">
							<NuxtImg
								:src="resolveImage(entity.logo)"
								:alt="entity.alt || modalTitle"
								fit="contain"
								background="ffffff"
								width="200"
								height="120" />
						</div>

						<!-- Описание -->
						<div v-if="modalDescription" class="modal-description" v-html="modalDescription"></div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

// Универсальный тип для партнеров и клиентов
interface Entity {
	id: number | string
	name?: string
	name_en?: string
	logo?: string
	alt?: string
	description?: string
	description_en?: string
}

// Props и emits
const props = defineProps<{
	modelValue: boolean
	entity: Entity
}>()

const emit = defineEmits<{
	'update:modelValue': [value: boolean]
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

// Вычисляемые свойства для заголовка и описания
const modalTitle = computed(() => {
	return language.value === 'RU'
		? props.entity.name || ''
		: props.entity.name_en || props.entity.name || ''
})

const modalDescription = computed(() => {
	return language.value === 'RU'
		? props.entity.description || ''
		: props.entity.description_en || props.entity.description || ''
})

const closeModal = () => {
	emit('update:modelValue', false)
}

// Блокировка прокрутки при открытии модалки
watch(() => props.modelValue, (isOpen) => {
	if (isOpen) {
		document.body.classList.add('modal-open')
	} else {
		document.body.classList.remove('modal-open')
	}
})

// Закрытие по ESC
onMounted(() => {
	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && props.modelValue) {
			closeModal()
		}
	}
	document.addEventListener('keydown', handleEscape)
	onUnmounted(() => {
		document.removeEventListener('keydown', handleEscape)
		document.body.classList.remove('modal-open')
	})
})
</script>

<style scoped>
/* Фон модалки */
.modal-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(15, 23, 42, 0.7);
	backdrop-filter: blur(4px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	padding: 1rem;
	overflow-y: auto;
}

/* Окно модалки */
.modal-window {
	position: relative;
	background: #ffffff;
	border-radius: 24px;
	padding: 1.5rem 2rem;
	max-width: 700px;
	width: 100%;
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
	box-shadow: 0 20px 60px rgba(15, 23, 42, 0.3);
}

/* Кнопка закрытия */
.close-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 40px;
	height: 40px;
	border: none;
	background: rgba(15, 23, 42, 0.05);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #475569;
	transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
	z-index: 10;
}

.close-button:hover {
	background: rgba(14, 165, 233, 0.1);
	color: #0ea5e9;
	transform: rotate(90deg);
}

.close-button:active {
	transform: rotate(90deg) scale(0.95);
}

/* Заголовок */
.modal-title {
	margin: 0 0 2rem 0;
	font-size: 1.75rem;
	font-weight: 700;
	color: #2fc1ff;
	text-align: center;
}

/* Контент */
.modal-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

/* Логотип */
.modal-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	background: #ffffff;
	border-radius: 12px;
	border: 1px solid rgba(15, 23, 42, 0.08);
}

.modal-logo img {
	max-width: 100%;
	height: auto;
	object-fit: contain;
}

/* Описание */
.modal-description {
	color: #475569;
	font-size: 1rem;
	line-height: 1.6;
}

.modal-description :deep(p) {
	margin: 0 0 1rem 0;
}

.modal-description :deep(p:last-child) {
	margin-bottom: 0;
}

.modal-description :deep(a) {
	color: #0ea5e9;
	text-decoration: none;
	transition: color 0.2s ease;
}

.modal-description :deep(a:hover) {
	color: #0284c7;
	text-decoration: underline;
}

/* Анимация модалки */
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-active .modal-window,
.modal-leave-active .modal-window {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal-window,
.modal-leave-to .modal-window {
	transform: scale(0.95);
	opacity: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
	.modal-window {
		padding: 2rem 1.5rem;
		max-height: 95vh;
	}

	.modal-title {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.modal-content {
		gap: 1rem;
	}

	.close-button {
		width: 36px;
		height: 36px;
	}
}
</style>

<style>
/* Глобальные стили для блокировки прокрутки */
body.modal-open {
	overflow: hidden;
}
</style>
