<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<h2>{{ title }}</h2>
			<div class="details-select-products flex-row">
				<div
					v-for="item in productExamples"
					:key="item.id"
					class="details-select-products-item card-shadow">
					<h4>{{ language === 'RU' ? item.name : item.name_en }}</h4>
					<NuxtImg :src="resolveMedia(item.img)" :alt="item.alt" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

defineEmits(['close'])

defineProps({
	title: {
		type: String,
		default: 'Пример продукции',
	},
	productExamples: {
		type: Array as () => any[],
		default: () => [],
	},
})

const appStore = useAppStore()
const { language, serverMedia } = storeToRefs(appStore)

const resolveMedia = (src: unknown) => {
	if (!src || typeof src !== 'string') return '/assets/no-image.jpg'
	if (src.startsWith('http')) return src
	return `${serverMedia.value}${src.replace(/^\//, '')}`
}
</script>

<style scoped>
.modal-background {
	position: fixed;
	inset: 0;
	background: rgba(15, 23, 42, 0.45);
	backdrop-filter: blur(6px);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 0;
	z-index: 10000;
}
.close-background {
	position: absolute;
	inset: 0;
}
.modal-window {
	position: relative;
	z-index: 2;
	width: min(920px, 95vw);
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
	overflow-x: hidden;
	padding: 1.5rem 2rem;
	border-radius: 24px;
	background: #ffffff;
	box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
}
/* Скроллбар в модальном окне */
.modal-window::-webkit-scrollbar {
	width: 8px;
}
.modal-window::-webkit-scrollbar-track {
	background: transparent;
}
.modal-window::-webkit-scrollbar-thumb {
	background: rgba(15, 23, 42, 0.2);
	border-radius: 4px;
}
.modal-window::-webkit-scrollbar-thumb:hover {
	background: rgba(15, 23, 42, 0.3);
}
.modal-window {
	scrollbar-width: thin;
	scrollbar-color: rgba(15, 23, 42, 0.2) transparent;
}
.close-button {
	position: absolute;
	top: 16px;
	right: 16px;
	width: 40px;
	height: 40px;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(15, 23, 42, 0.05);
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

h2 {
	text-align: center;
	font-weight: 700;
	color: #2fc1ff;
	margin: 0 0 1rem 0;
}
.details-select-products {
	margin-top: 1.5rem;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 1rem;
}
.details-select-products-item {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	text-align: center;
	border-radius: 18px;
	background: #ffffff;
	box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.details-select-products-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 18px 34px rgba(15, 23, 42, 0.18);
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
	color: #2fc1ff;
}
@media (max-width: 980px) {
	h2 {
		color: #2fc1ff;
	}
	.modal-window {
		margin: 1rem 0 1.5rem;
		padding: 2rem 1.5rem;
	}
	.close-mobile {
		display: block;
	}
	.close-desktop {
		display: none;
	}
	.details-select-products {
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}
	.details-select-products-item h4 {
		font-size: 12px;
	}
}
</style>
