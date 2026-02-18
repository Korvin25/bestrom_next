<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window contacts card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>

			<div class="header-title">
				<img class="logo-img" src="/assets/bestrom_logo.png" alt="bestrom logo" />
				<h1>{{ language === 'RU' ? 'БЕСТРОМ' : 'BESTROM' }}</h1>
			</div>

			<h3>{{ language === 'RU' ? 'Головной офис' : 'Head Office' }}</h3>

			<div class="flex-row">
				<img class="location-pin" src="/assets/location_pin.png" alt="location" />
				<p v-if="content.length > 0">
					{{
						language === 'RU'
							? findContent('Головной офис')?.text
							: findContent('Головной офис')?.text_en
					}}
				</p>
			</div>
			<iframe
				title="Bestrom map"
				src="https://yandex.ru/map-widget/v1/?lang=ru_RU&amp;scroll=false&amp;um=constructor%3Ab23d25421decd66ecb2e0401df4649a9fbbf12bca068dbbafcf6dde799fd92e3"
				frameborder="0"
				allowfullscreen="true"
				width="100%"
				height="350"
				style="display: block; border-radius: 12px; margin-top: 1rem; min-height: 350px; height: 350px;"></iframe>
			<a class="btn yandex-href" href="https://yandex.ru/maps/?rtext=~55.809879, 37.335034">
				<p>
					{{ language === 'RU' ? 'Построить маршрут в Яндекс.Карты' : 'Build a route in Yandex.Maps' }}
				</p>
			</a>

			<div v-if="content.length > 0" class="main-contacts flex-row">
				<div class="main-contacts-card flex-column">
					<div>
						<h5>{{ language === 'RU' ? 'Общий:' : 'General:' }}</h5>
						<p>{{ findContent('Общий')?.text }}</p>
					</div>
					<div>
						<h5>{{ language === 'RU' ? 'Сервисная служба:' : 'Customer Service:' }}</h5>
						<p>{{ findContent('Сервисная служба')?.text }}</p>
					</div>
					<div>
						<h5>{{ language === 'RU' ? 'Отдел запчастей:' : 'Spare Parts Department:' }}</h5>
						<p>{{ findContent('Отдел запчастей')?.text }}</p>
					</div>
				</div>
				<div class="main-contacts-card flex-column">
					<div>
						<h5>{{ language === 'RU' ? 'Секретарь:' : 'Secretary:' }}</h5>
						<p>{{ findContent('Секретарь')?.text }}</p>
					</div>
					<div>
						<h5>
							{{ language === 'RU' ? 'Коммерческий отдел и отдел продаж:' : 'Commercial and Sales Department:' }}
						</h5>
						<p>{{ findContent('Коммерческий отдел и отдел продаж')?.text }}</p>
					</div>
					<div>
						<h5>{{ language === 'RU' ? 'Отдел снабжения:' : 'Supply Department:' }}</h5>
						<p>{{ findContent('Отдел снабжения')?.text }}</p>
					</div>
				</div>
				<div class="main-contacts-card flex-column">
					<div>
						<h5>{{ language === 'RU' ? 'Бухгалтерия:' : 'Accounting:' }}</h5>
						<p>{{ findContent('Бухгалтерия')?.text }}</p>
					</div>
					<div>
						<h5>E-mail:</h5>
						<p>{{ findContent('E-mail')?.text }}</p>
					</div>
					<div>
						<h5>{{ language === 'RU' ? 'Реквизиты' : 'Requisites' }}:</h5>
						<p>
							<NuxtLink to="/requisites">
								{{ language === 'RU' ? 'Посмотреть реквизиты' : 'View Requisites' }}
							</NuxtLink>
						</p>
					</div>
				</div>
			</div>

			<h3>{{ language === 'RU' ? 'Дилеры' : 'Dealers' }}</h3>
			<div v-if="content.length > 0" class="dilers flex-row">
				<div class="dilers-card">
					<p v-html="dealersRu('Дилеры Сибирь', 'Дилеры Сибирь')" />
				</div>
				<div class="dilers-card">
					<p v-html="dealersRu('Дилеры Беларусь', 'Дилеры Беларусь')" />
				</div>
			</div>

			<h3>{{ language === 'RU' ? 'Социальные сети' : 'Social network' }}</h3>
			<div v-if="content.length > 0" class="social flex-row">
				<a :href="findContent('vk')?.text || 'https://vk.com/bestrom_official'" class="social-logo">
					<img src="/assets/vk.png" alt="VK" />
				</a>
				<a
					:href="findContent('telegram')?.text || 'https://t.me/bestrom_official'"
					class="social-logo">
					<img src="/assets/telegram.png" alt="Telegram" />
				</a>
				<a href="https://rutube.ru/channel/38819375/" class="social-logo">
					<img src="/assets/rutube1.png" alt="Rutube" />
				</a>
			</div>

			<div class="call-buttons flex-row">
				<button class="call btn" @click="$emit('call')">
					{{ language === 'RU' ? 'ЗАКАЗАТЬ ЗВОНОК' : 'ORDER A CALL' }}
				</button>
				<button class="call btn" @click="$emit('question')">
					{{ language === 'RU' ? 'ЗАДАТЬ ВОПРОС' : 'ASK A QUESTION' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'
import { usePageStore } from '~/stores/page'

defineEmits(['close', 'call', 'question'])

const appStore = useAppStore()
const pageStore = usePageStore()
const { language } = storeToRefs(appStore)

type ContentItem = {
	name?: string
	text?: string
	text_en?: string
}

const content = computed<ContentItem[]>(
	() => pageStore.pageId?.[0]?.blocks?.find((block: ContentItem) => block.name === 'contacts')?.contents || [],
)

const findContent = (name: string) => content.value.find((item: ContentItem) => item.name === name)

const dealersRu = (ruName: string, enName: string) => {
	const block = findContent(ruName)
	const text = language.value === 'RU' ? block?.text : block?.text_en
	return (text || '').replaceAll('\n', '<br />')
}

onMounted(() => {
	pageStore.loadPage(1)
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

.header-title {
	margin-top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
	gap: 0.75rem;
}
.logo-img {
	width: 32px;
	height: 32px;
}
.location-pin {
	align-self: center;
	margin-right: 0.5rem;
}
.main-contacts {
	margin: 1rem -1rem 2rem -1rem;
	border-bottom: 2px solid #6a6a6a;
}
.yandex-href {
	width: 90%;
	display: flex;
	align-self: center;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;
	padding: 0.6rem 1.4rem;
	border-radius: 999px;
	background: #f8fbff;
	border: 1px solid rgba(14, 165, 233, 0.2);
	box-shadow: 0 8px 18px rgba(56, 189, 248, 0.16);
	transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.yandex-href:hover {
	transform: translateY(-1px);
	background: #ffffff;
	box-shadow: 0 12px 24px rgba(56, 189, 248, 0.2);
}
.yandex-href p {
	margin: 0;
	font-weight: 600;
	color: #2fc1ff;
}
.main-contacts-card {
	width: 30%;
	justify-content: space-between;
	margin: 1rem 1rem;
}
.main-contacts-card h5 {
	margin: 0;
}
.main-contacts-card p {
	margin: 0.5rem 0 1rem 0;
}
.dilers {
	margin: 2rem -1rem;
	padding-bottom: 2rem;
	border-bottom: 2px solid #6a6a6a;
}
.dilers-card {
	width: 45%;
	margin: 0 1rem;
}
.dilers-card p {
	margin: 0;
}
.social {
	margin: 1rem -1rem;
	justify-content: flex-start;
	padding-bottom: 1rem;
	border-bottom: 2px solid #6a6a6a;
	gap: 0.75rem;
	padding-left: 1rem;
}

.social-logo {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.4rem;
	height: 2.4rem;
	background: #ffffff;
	border: 1px solid rgba(15, 23, 42, 0.12);
	color: #6a6a6a;
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
	border-radius: 12px;
	font-weight: 600;
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease, background 0.16s ease;
}
.social-logo img {
	width: 20px;
	height: 20px;
}
.social-logo:nth-child(3) img {
	width: 24px;
	height: 24px;
}
.social-logo:nth-child(1) img,
.social-logo:nth-child(3) img {
	filter: brightness(0.3) contrast(1.1);
}
.social-logo:hover {
	transform: translateY(-1px);
	border-color: rgba(14, 165, 233, 0.35);
	box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
	background: #ffffff;
}
.call-buttons {
	margin: 0 -1rem 1rem -1rem;
}
.call-buttons .btn {
	margin: 0 1rem;
	flex-grow: 1;
}

@media (max-width: 980px) {
	.main-contacts {
		flex-direction: column;
		border-bottom: 2px solid #2fc1ff;
	}
	.main-contacts-card {
		margin: 0 1rem;
		width: 100%;
	}
	.yandex-href {
		width: 80%;
		padding: 0.5rem 1rem;
	}
	.yandex-href p {
		text-align: center;
	}
	.dilers {
		flex-direction: column;
		border-bottom: 2px solid #2fc1ff;
		padding-bottom: 0;
		margin-bottom: 1rem;
	}
	.dilers-card {
		margin: 0 1rem 1rem 1rem;
		width: 90%;
	}
	.social {
		border-bottom: none;
		margin: 0.5rem -1rem 0 -1rem;
	}
	.call-buttons {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 -1rem;
	}
	.call-buttons .btn {
		margin: 0 1rem 1rem 1rem;
		width: 100%;
	}
}
</style>
