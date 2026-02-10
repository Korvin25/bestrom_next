<template>
	<div class="hidden-item">
		<div class="hidden-text">
			<p>{{ text }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	text: {
		type: String,
		default: '',
	},
})
</script>

<style scoped>
.hidden-item {
	position: absolute;
	justify-content: center;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 1rem;
	cursor: pointer;
	background: linear-gradient(135deg, rgba(14, 165, 233, 0.9), rgba(59, 130, 246, 0.9));
	backdrop-filter: blur(2px);
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
	border-radius: 16px;
	transition: opacity 0.25s ease, transform 0.25s ease;
	opacity: 0;
	transform: translateY(6px);
}
.hidden-text {
	font-weight: 700;
	font-size: 1rem;
	color: #ffffff;
	display: flex;
	text-align: center;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	letter-spacing: 0.02em;
}
</style>
