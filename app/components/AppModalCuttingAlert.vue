<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<h2 class="alert-text">{{ text }}</h2>
		</div>
	</div>
</template>

<script setup lang="ts">
defineEmits(['close'])

defineProps({
	text: {
		type: String,
		default: '',
	},
})
</script>

<style scoped>
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

.alert-text {
	font-size: 1.5rem;
	align-self: center;
	text-align: center;
}
.close-mobile {
	display: none;
}
.close-desktop {
	display: block;
}
@media (max-width: 980px) {
	.close-mobile {
		display: block;
	}
	.close-desktop {
		display: none;
	}
}
</style>
