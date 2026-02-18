<template>
	<nav class="nav flex-row">
		<div class="nav-logo-items flex-column">
			<NuxtLink
				:class="hoverItem === mainLink.id || isActive(mainLink) ? 'img-hover' : ''"
				class="nav-item img"
				to="/"
				@mouseenter="hoverItem = mainLink.id"
				@mouseleave="hoverItem = 0"
				@click="scrollToTop">
				<img class="logo-bestrom" src="/assets/bestrom_logo.png" alt="bestrom logo" />
			</NuxtLink>
			<NuxtLink
				v-for="item in mainLinks.slice(1)"
				:key="item.id"
				:class="hoverItem === item.id || isActive(item) ? 'img-hover' : ''"
				class="nav-item img"
				:to="item.path"
				@mouseenter="hoverItem = item.id"
				@mouseleave="hoverItem = 0"
				@click="scrollToTop">
				<img :src="item.icon" :alt="item.labelRu" />
			</NuxtLink>
			<button
				:class="hoverItem === 14 ? 'img-hover' : ''"
				class="nav-item img"
				type="button"
				@mouseenter="hoverItem = 14"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuService = true">
				<img src="/assets/menu-item-5,8.png" alt="service" />
			</button>
			<button
				:class="hoverItem === 9 ? 'img-hover' : ''"
				class="nav-item img"
				type="button"
				@mouseenter="hoverItem = 9"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuContacts = true">
				<img src="/assets/menu-item-9.png" alt="contacts" />
			</button>
			<button
				:class="hoverItem === 10 ? 'img-hover' : ''"
				class="nav-item img contact-icon"
				type="button"
				@mouseenter="hoverItem = 10"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuApplication = true">
				<img src="/assets/email.png" alt="application" />
			</button>
			<a
				href="https://vk.com/bestrom_official"
				:class="hoverItem === 11 ? 'logo-hover' : ''"
				class="nav-item img logo contact-icon"
				@mouseenter="hoverItem = 11"
				@mouseleave="hoverItem = 0">
				<img class="nav-contact-icon nav-contact-icon--dark" src="/assets/vk.png" alt="VK" />
			</a>
			<a
				href="https://t.me/bestrom_official"
				:class="hoverItem === 12 ? 'logo-hover' : ''"
				class="nav-item img logo contact-icon"
				@mouseenter="hoverItem = 12"
				@mouseleave="hoverItem = 0">
				<img class="nav-contact-icon" src="/assets/telegram.png" alt="Telegram" />
			</a>
			<a
				href="https://rutube.ru/channel/38819375/"
				:class="hoverItem === 13 ? 'logo-hover' : ''"
				class="nav-item img logo contact-icon"
				@mouseenter="hoverItem = 13"
				@mouseleave="hoverItem = 0">
				<img class="nav-contact-icon nav-contact-icon--dark" src="/assets/rutube1.png" alt="Rutube" />
			</a>
		</div>

		<div class="nav-text-items flex-column">
			<NuxtLink
				:class="hoverItem === mainLink.id || isActive(mainLink) ? 'text-hover' : ''"
				class="nav-item text"
				to="/"
				@mouseenter="hoverItem = mainLink.id"
				@mouseleave="hoverItem = 0"
				@click="scrollToTop">
				<p>{{ language === 'RU' ? 'Главная' : 'Main page' }}</p>
			</NuxtLink>
			<NuxtLink
				v-for="item in mainLinks.slice(1)"
				:key="item.id"
				:class="hoverItem === item.id || isActive(item) ? 'text-hover' : ''"
				class="nav-item text"
				:to="item.path"
				@mouseenter="hoverItem = item.id"
				@mouseleave="hoverItem = 0"
				@click="scrollToTop">
				<p>{{ language === 'RU' ? item.labelRu : item.labelEn }}</p>
			</NuxtLink>
			<button
				:class="hoverItem === 14 ? 'text-hover' : ''"
				class="nav-item text"
				type="button"
				@mouseenter="hoverItem = 14"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuService = true">
				<p>{{ language === 'RU' ? 'Сервис' : 'Service' }}</p>
			</button>
			<button
				:class="hoverItem === 9 ? 'text-hover' : ''"
				class="nav-item text"
				type="button"
				@mouseenter="hoverItem = 9"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuContacts = true">
				<p>{{ language === 'RU' ? 'Контакты' : 'Contacts' }}</p>
			</button>
			<button
				:class="hoverItem === 10 ? 'text-hover' : ''"
				class="nav-item text"
				type="button"
				@mouseenter="hoverItem = 10"
				@mouseleave="hoverItem = 0"
				@click="showModalMenuApplication = true">
				<p>{{ language === 'RU' ? 'Оставить заявку' : 'Submit your application' }}</p>
			</button>
			<a
				href="https://vk.com/bestrom_official"
				:class="hoverItem === 11 ? 'text-hover' : ''"
				class="nav-item text"
				@mouseenter="hoverItem = 11"
				@mouseleave="hoverItem = 0">
				<p>ВКонтакте</p>
			</a>
			<a
				href="https://t.me/bestrom_official"
				:class="hoverItem === 12 ? 'text-hover' : ''"
				class="nav-item text"
				@mouseenter="hoverItem = 12"
				@mouseleave="hoverItem = 0">
				<p>Telegram</p>
			</a>
			<a
				href="https://rutube.ru/channel/38819375/"
				:class="hoverItem === 13 ? 'text-hover' : ''"
				class="nav-item text"
				@mouseenter="hoverItem = 13"
				@mouseleave="hoverItem = 0">
				<p>RUTUBE</p>
			</a>
		</div>
	</nav>

	<div class="mobile-nav">
		<div class="mobile-nav-buttons">
			<button class="mobile-nav-buttons-item" type="button" @click="showMobileMenu = true">
				<img class="mobile-icon" src="/assets/menu-burger.png" alt="menu" />
				<span>{{ language === 'RU' ? 'Меню' : 'Menu' }}</span>
			</button>
			<a href="tel:+78005557457" class="mobile-nav-buttons-item">
				<span>{{ language === 'RU' ? 'Позвонить' : 'Call' }}</span>
			</a>
		</div>

		<transition-group name="mobile-menu-modal">
			<nav v-if="showMobileMenu" class="mobile-nav-elements flex-column">
				<button class="close mobile-close" type="button" @click="showMobileMenu = false">
					<img src="/assets/close-mobile-menu.png" alt="close" />
				</button>
				<p class="mobile-menu-title">{{ language === 'RU' ? 'Меню' : 'Menu' }}</p>
				<div class="mobile-menu-footer">
					<a href="https://vk.com/bestrom_official">
						<img class="social-icon" src="/assets/vk.png" alt="VK" />
					</a>
					<a href="https://t.me/bestrom_official">
						<img class="social-icon" src="/assets/telegram.png" alt="Telegram" />
					</a>
					<a href="https://rutube.ru/channel/38819375/">
						<img class="social-icon" src="/assets/rutube1.png" alt="Rutube" />
					</a>
				</div>

				<div class="mobile-menu-nav-items flex-column">
					<NuxtLink
						v-for="item in linkItems"
						:key="item.id"
						:class="['nav-mobile-item', isActive(item) ? 'nav-mobile-item--active' : '']"
						:to="item.path"
						@click="scrollToTop">
						<img class="nav-icon" :src="item.icon" :alt="item.labelRu" />
						{{ language === 'RU' ? item.labelRu : item.labelEn }}
					</NuxtLink>
					<button class="nav-mobile-item" type="button" @click="showModalMenuServiceClick">
						<img class="nav-icon" src="/assets/menu-item-5,8.png" alt="service" />
						{{ language === 'RU' ? 'Сервис' : 'Service' }}
					</button>
					<button class="nav-mobile-item" type="button" @click="showModalMenuContactsClick">
						<img class="nav-icon" src="/assets/menu-item-9.png" alt="contacts" />
						{{ language === 'RU' ? 'Контакты' : 'Contacts' }}
					</button>
					<button class="nav-mobile-item" type="button" @click="showModalMenuApplicationClick">
						<img class="nav-icon" src="/assets/email.png" alt="application" />
						{{ language === 'RU' ? 'Оставить заявку' : 'Submit your application' }}
					</button>
				</div>

				<div class="mobile-menu-nav-bottom">
					<button class="mobile-menu-nav-bottom-item" type="button" @click="showModalMenuApplicationClick">
						<img src="/assets/menu-mobile-call.png" alt="application" />
						<span>{{ language === 'RU' ? 'Заявка' : 'Application' }}</span>
					</button>
					<button class="mobile-menu-nav-bottom-item" type="button" @click="showModalMenuContactsQuestionFunc">
						<img src="/assets/menu-mobile-message.png" alt="message" />
						<span>{{ language === 'RU' ? 'Написать' : 'Write a message' }}</span>
					</button>
					<button class="mobile-menu-nav-bottom-item" type="button" @click="showModalMenuContactsClick">
						<img src="/assets/menu-mobile-contacts.png" alt="contacts" />
						<span>{{ language === 'RU' ? 'Контакты' : 'Contacts' }}</span>
					</button>
				</div>
			</nav>
		</transition-group>
	</div>

	<transition-group name="modal">
		<AppModalMenuApplication
			v-if="showModalMenuApplication"
			@close="showModalMenuApplication = false" />
		<AppModalMenuService v-if="showModalMenuService" @close="showModalMenuService = false" />
		<AppModalMenuContacts
			v-if="showModalMenuContacts"
			@close="showModalMenuContacts = false"
			@call="showModalMenuContactsCallFunc"
			@question="showModalMenuContactsQuestionFunc" />
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
import AppModalMenuApplication from '~/components/AppModalMenuApplication.vue'
import AppModalMenuContacts from '~/components/AppModalMenuContacts.vue'
import AppModalMenuContactsCall from '~/components/AppModalMenuContactsCall.vue'
import AppModalMenuContactsQuestion from '~/components/AppModalMenuContactsQuestion.vue'
import AppModalMenuService from '~/components/AppModalMenuService.vue'
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const { language } = storeToRefs(appStore)

const route = useRoute()

const showMobileMenu = ref(false)
const showModalMenuApplication = ref(false)
const showModalMenuService = ref(false)
const showModalMenuContacts = ref(false)
const showModalMenuContactsCall = ref(false)
const showModalMenuContactsQuestion = ref(false)

const hoverItem = ref(0)

const mainLinks = [
	{ id: 1, path: '/', labelRu: 'Главная', labelEn: 'Main page', icon: '/assets/bestrom_logo.png' },
	{ id: 2, path: '/about', labelRu: 'О компании', labelEn: 'About company', icon: '/assets/menu-item-2.png' },
	{ id: 3, path: '/catalog', labelRu: 'Каталог', labelEn: 'Catalog', icon: '/assets/menu-item-3.png' },
	{ id: 4, path: '/cutting', labelRu: 'Раскрой пакета', labelEn: 'Uncover the package', icon: '/assets/menu-item-4.png' },
	{ id: 5, path: '/news', labelRu: 'Новости', labelEn: 'News', icon: '/assets/menu-item-6.png' },
	{ id: 6, path: '/partners', labelRu: 'Партнеры', labelEn: 'Partners', icon: '/assets/menu-item-7.png' },
	{ id: 7, path: '/clients', labelRu: 'Клиенты', labelEn: 'Clients', icon: '/assets/menu-item-5,8.png' },
	{ id: 8, path: '/jobs', labelRu: 'Вакансии', labelEn: 'Vacancies', icon: '/assets/menu-item-10.png' },
]

const mainLink = mainLinks[0] as (typeof mainLinks)[number]
const linkItems = computed(() => mainLinks)

const isActive = (item: { path: string }) => route.path === item.path || route.path.startsWith(item.path + '/')

const scrollToTop = () => {
	showMobileMenu.value = false
	if (process.client) {
		window.scrollTo(0, 0)
	}
}

const lockBody = (isLocked: boolean) => {
	if (process.client) {
		document.body.classList.toggle('modal-open', isLocked)
	}
}

watch(showMobileMenu, (val) => lockBody(val))
watch(showModalMenuApplication, (val) => lockBody(val))
watch(showModalMenuService, (val) => lockBody(val))
watch(showModalMenuContacts, (val) => lockBody(val))
watch(showModalMenuContactsCall, (val) => lockBody(val))
watch(showModalMenuContactsQuestion, (val) => lockBody(val))

const showModalMenuContactsCallFunc = () => {
	showModalMenuContactsCall.value = true
	showModalMenuContacts.value = false
}
const showModalMenuContactsQuestionFunc = () => {
	showModalMenuContactsQuestion.value = true
	showModalMenuContacts.value = false
}
const showModalMenuServiceClick = () => {
	showMobileMenu.value = false
	showModalMenuService.value = true
}
const showModalMenuApplicationClick = () => {
	showMobileMenu.value = false
	showModalMenuApplication.value = true
}
const showModalMenuContactsClick = () => {
	showMobileMenu.value = false
	showModalMenuContacts.value = true
}
</script>

<style scoped>
.logo-bestrom {
	width: 2rem;
	height: 2rem;
	max-width: none;
	display: block;
}
.nav {
	position: fixed;
	left: 0;
	top: 70px;
	bottom: 0;
	align-items: center;
	min-height: 600px;
	background: transparent;
	z-index: 9996;
}
.nav-logo-items {
	justify-content: space-around;
	align-items: center;
	height: 100%;
	padding: 0 0.5rem;
	background: #ffffff;
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}
.nav-logo-items:hover + .nav-text-items {
	width: 12rem;
	padding: 0 2rem 0 0;
	transform: scaleX(1);
	pointer-events: auto;
}
.nav-text-items {
	align-items: flex-start;
	justify-content: space-around;
	height: 100%;
	width: 0;
	padding: 0;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	transform: scaleX(0);
	transform-origin: 0 0;
	pointer-events: none;
}
.nav-text-items:hover {
	width: 12rem;
	padding: 0 2rem 0 0;
	transform: scaleX(1);
	pointer-events: auto;
}
.nav-text-items .nav-item {
	box-shadow: none;
}
.nav-item {
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f8fafc;
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
	border-radius: 14px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.nav-item.text {
	margin-left: 1rem;
	text-decoration: none;
	background: transparent;
	border-radius: 12px;
	padding: 0.35rem 0.5rem;
	color: #6a6a6a;
}
.nav-item.text.text-hover {
	transform: translateX(2px);
	background: rgba(47, 193, 255, 0.12);
}
.nav-item:hover {
	cursor: pointer;
}
.nav-item.img {
	width: 2.6rem;
	height: 2.6rem;
}
.nav-item.img.img-hover {
	background: rgba(47, 193, 255, 0.18);
	border-color: rgba(14, 165, 233, 0.35);
	transform: translateY(-1px);
	box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
}
.nav-item.img:not(.logo) img {
	filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.18));
}
.nav-item.img:not(.contact-icon):hover {
	background: #ffffff;
	border-color: rgba(14, 165, 233, 0.25);
	box-shadow: 0 12px 22px rgba(56, 189, 248, 0.22);
}
.nav-item.img.logo {
	border-radius: 50%;
}
.nav-item.img.contact-icon {
	background: #ffffff;
	border: 1px solid rgba(15, 23, 42, 0.12);
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
	width: 2.4rem;
	height: 2.4rem;
}
.nav-item.img.contact-icon:hover {
	border-color: rgba(14, 165, 233, 0.35);
	box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
}
.nav-item.img.contact-icon .nav-contact-icon {
	width: 20px;
	height: 20px;
}
.nav-item.img.contact-icon .nav-contact-icon--dark {
	width: 24px;
	height: 24px;
}
.nav-item.img.logo.contact-icon {
	border-radius: 12px;
}
.nav-contact-icon--dark {
	filter: brightness(0.3) contrast(1.1);
}
.nav-item p {
	font-size: 16px;
	margin: 0.5rem 0;
}
.nav-social {
	margin-top: auto;
	gap: 0.5rem;
	font-size: 12px;
}
.mobile-nav {
	display: none;
}

@media (max-width: 980px) {
	.nav {
		display: none;
	}
	.mobile-nav {
		width: 100%;
		height: 100%;
		display: block;
	}
	.mobile-nav-buttons {
		z-index: 9998;
		position: fixed;
		bottom: 0.75rem;
		left: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.35rem;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 999px;
		box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}
	.mobile-nav-buttons-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(0deg, #24b5ff 0%, #6be1ff 52%, #b0f0ff 100%);
		border: none;
		box-shadow: 0 10px 20px rgba(47, 193, 255, 0.35);
		border-radius: 999px;
		padding: 0.6rem 1rem;
		color: #ffffff;
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.02em;
		transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
	}
	.mobile-nav-buttons-item:active {
		transform: translateY(1px);
		box-shadow: 0 6px 12px rgba(47, 193, 255, 0.25);
	}
	.mobile-nav-buttons-item:focus-visible {
		outline: 3px solid rgba(47, 193, 255, 0.5);
		outline-offset: 2px;
	}
.mobile-icon {
	width: 20px;
	height: 20px;
	filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.2));
}
	.mobile-nav-elements {
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		justify-content: flex-start;
		background-color: #ffffff;
		padding: 2.5rem 1.5rem 1.5rem;
	}
	.mobile-close {
		border: none;
		background: #ffffff;
	padding: 0;
	}
	.mobile-menu-title {
		text-align: center;
		font-weight: 600;
		font-size: 18px;
		line-height: 142%;
	}
	.mobile-menu-nav-items {
		margin-top: 1rem;
		gap: 0.75rem;
	}
	.nav-mobile-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		text-align: left;
		background: #f8fafc;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 16px;
		box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
		color: inherit;
		font-size: 16px;
		transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	}
	.nav-mobile-item--active {
		border-color: rgba(47, 193, 255, 0.45);
		box-shadow: 0 10px 22px rgba(47, 193, 255, 0.18);
		background: linear-gradient(90deg, rgba(47, 193, 255, 0.14), rgba(47, 193, 255, 0.04));
	}
	.nav-mobile-item--active .nav-icon {
		border-color: rgba(47, 193, 255, 0.45);
		box-shadow: 0 8px 18px rgba(47, 193, 255, 0.2);
	}
	.nav-mobile-item:active {
		transform: translateY(1px);
		box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
	}
	.nav-icon {
		width: 24px;
		height: 24px;
		background: #ffffff;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 12px;
		padding: 0.35rem;
		box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
	}
	.mobile-menu-nav-bottom {
		margin-top: clamp(1rem, 3vh, 2rem);
		padding-bottom: 1rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.mobile-menu-nav-bottom-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 0.5rem;
		background: #ffffff;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 16px;
		box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
		font-size: 12px;
		font-weight: 600;
		color: #334155;
		transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	}
	.mobile-menu-nav-bottom-item:active {
		transform: translateY(1px);
		box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
	}
	.mobile-menu-nav-bottom-item img {
		width: 24px;
		height: 24px;
	}
	.mobile-menu-footer {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		padding: 1.25rem 0 0;
	}
	.mobile-menu-footer a {
		width: 44px;
		height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		background: #ffffff;
		border: 1px solid rgba(15, 23, 42, 0.08);
		box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
		transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	}
	.mobile-menu-footer a:active {
		transform: translateY(1px);
		box-shadow: 0 6px 12px rgba(15, 23, 42, 0.1);
	}
	.social-icon {
		width: 22px;
		height: 22px;
		filter: brightness(0.45) contrast(1.2);
	}
	.mobile-menu-modal-enter-active {
		animation: mobile-menu-modal-in 0.4s;
	}
	.mobile-menu-modal-leave-active {
		animation: mobile-menu-modal-in 0.4s reverse;
	}
	@keyframes mobile-menu-modal-in {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0%);
		}
	}
}
</style>
