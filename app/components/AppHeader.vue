<template>
	<header class="header">
		<div class="header-container flex-row">
			<NuxtLink class="header-title" to="/">
				<img class="logo-img" src="/assets/bestrom_logo.png" alt="bestrom logo" />
				<h1>{{ language === 'RU' ? 'БЕСТРОМ' : 'BESTROM' }}</h1>
			</NuxtLink>
			<div class="header-actions flex-row">
				<button class="call btn" @click="showModalMenuContactsCall = true">
					{{ language === 'RU' ? 'ЗАКАЗАТЬ ЗВОНОК' : 'ORDER A CALL' }}
				</button>
				<button class="call btn" @click="showModalMenuContactsQuestion = true">
					{{ language === 'RU' ? 'ЗАДАТЬ ВОПРОС' : 'ASK A QUESTION' }}
				</button>
				<button class="lang-toggle" type="button" @click="toggleLanguage">
					<img class="lang-icon" src="/assets/language-world.png" alt="language" />
					<span>{{ language }}</span>
				</button>
			</div>
		</div>
	</header>
	<transition-group name="modal">
		<AppModalMenuContactsCall
			v-if="showModalMenuContactsCall"
			@close="showModalMenuContactsCall = false" />
		<AppModalMenuContactsQuestion
			v-if="showModalMenuContactsQuestion"
			@close="showModalMenuContactsQuestion = false" />
	</transition-group>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppModalMenuContactsCall from '~/components/AppModalMenuContactsCall.vue'
import AppModalMenuContactsQuestion from '~/components/AppModalMenuContactsQuestion.vue'
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const { language } = storeToRefs(appStore)
const { toggleLanguage } = appStore

const showModalMenuContactsCall = ref(false)
const showModalMenuContactsQuestion = ref(false)

const lockBody = (isLocked: boolean) => {
	if (process.client) {
		document.body.classList.toggle('modal-open', isLocked)
	}
}

watch(showModalMenuContactsCall, (val) => lockBody(val))
watch(showModalMenuContactsQuestion, (val) => lockBody(val))
</script>

<style scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9997;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(15, 23, 42, 0.08);
	box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
	border-radius: 0;
	overflow: hidden;
}
.header::before {
	content: '';
	position: absolute;
	inset: 0;
	background: rgba(255, 255, 255, 0.65);
	-webkit-backdrop-filter: blur(16px);
	backdrop-filter: blur(16px);
	z-index: 0;
}
.header-container {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	padding: 0.65rem 24px;
	box-sizing: border-box;
}
.header-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	text-decoration: none;
	color: inherit;
	position: static;
}
.header-title h1 {
	margin: 0;
	font-size: 1.25rem;
	letter-spacing: 0.08em;
	color: #0f172a;
}
.logo-img {
	width: 36px;
	height: 36px;
}
.header-actions {
	align-items: center;
	gap: 0.6rem;
	margin-left: auto;
}
.header .btn {
	font-size: 13px;
	width: 200px;
	height: 40px;
	border-radius: 999px;
	background: linear-gradient(135deg, #2fc1ff 0%, #4dd4ff 100%);
	box-shadow: 0 10px 20px rgba(47, 193, 255, 0.35);
	transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.header .btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 14px 26px rgba(47, 193, 255, 0.4);
	background: linear-gradient(135deg, #22b2ee 0%, #2fc1ff 100%);
}
.header .btn:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.5);
	outline-offset: 3px;
}
.lang-toggle {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	border: 1px solid rgba(47, 193, 255, 0.35);
	background: rgba(255, 255, 255, 0.9);
	padding: 0.4rem 0.75rem;
	height: 40px;
	border-radius: 999px;
	cursor: pointer;
	font-weight: 600;
	color: #2fc1ff;
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
}
.lang-toggle:hover {
	transform: translateY(-1px);
	border-color: rgba(47, 193, 255, 0.6);
	box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
}
.lang-toggle:focus-visible {
	outline: 3px solid rgba(47, 193, 255, 0.45);
	outline-offset: 3px;
}
.lang-icon {
	width: 20px;
	height: 20px;
}
@media (min-width: 981px) and (max-width: 1360px) {
	.header-container {
		padding-left: calc(24px + 72px);
		padding-right: 24px;
	}
}
@media (max-width: 980px) {
	.header .btn {
		display: none;
	}
	.header-container {
		padding: 0.5rem max(0.5rem, env(safe-area-inset-right)) 0.5rem
			max(0.5rem, env(safe-area-inset-left));
		border-radius: 0;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.header-title {
		min-width: 0;
		gap: 0.5rem;
	}
	.header-title h1 {
		font-size: 1rem;
		letter-spacing: 0.05em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.header-actions {
		margin-left: 0;
		flex-shrink: 0;
		gap: 0.35rem;
		margin-right: 0.25rem;
	}
	.lang-toggle {
		padding: 0.3rem 0.5rem;
		height: 34px;
	}
	.lang-icon {
		width: 16px;
		height: 16px;
	}
}
@media (max-width: 520px) {
	.header-title h1 {
		display: none;
	}
	.header-container {
		padding: 0.4rem max(0.4rem, env(safe-area-inset-right)) 0.4rem
			max(0.4rem, env(safe-area-inset-left));
	}
	.lang-toggle {
		padding: 0.25rem 0.45rem;
		height: 32px;
	}
}
</style>
