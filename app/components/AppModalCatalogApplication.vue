<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<h2>{{ language === 'RU' ? 'Отправьте нам вашу заявку' : 'Send us your application' }}</h2>
			<div class="catalog-name flex-row">
				<h2 class="catalog-name-item">{{ nameMachine }}</h2>
				<a href="tel:+78005557457">
					<h2 class="catalog-name-item">+7-800-555-74-57</h2>
				</a>
			</div>
			<section class="form-call flex-column">
				<label for="company">{{ language === 'RU' ? 'Компания' : 'Company' }}</label>
				<input
					id="company"
					v-model="inputCompany"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'БЕСТРОМ' : 'BESTROM'" />
				<label for="fio">{{ language === 'RU' ? 'Ф.И.О' : 'Full name' }}</label>
				<input
					id="fio"
					v-model="inputName"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Иван Иванович' : 'Ivan Ivanovich'" />
				<label for="telephone">{{ language === 'RU' ? 'Телефон' : 'Telephone' }}</label>
				<input
					id="telephone"
					v-model="inputTelephone"
					type="text"
					class="input"
					placeholder="89199966203" />
				<label for="email">E-mail</label>
				<input
					id="email"
					v-model="inputEmail"
					type="text"
					class="input"
					placeholder="partner@thedimension.com" />
				<label for="product">{{ language === 'RU' ? 'Продукт' : 'Product' }}</label>
				<input
					id="product"
					v-model="inputProduct"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Фисташки' : 'Pistachio'" />
				<label for="weight">{{ language === 'RU' ? 'Дозировка' : 'Dosage' }}</label>
				<input
					id="weight"
					v-model="inputDosage"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? '100г' : '100g'" />
				<label for="speed">
					{{ language === 'RU' ? 'Требуемая производительность' : 'Required performance' }}
				</label>
				<input
					id="speed"
					v-model="inputPerformance"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? '60 п/м' : '60 p/m'" />
				<label for="comment">{{ language === 'RU' ? 'Комментарий' : 'Comment' }}</label>
				<textarea id="comment" v-model="inputComment" rows="5" class="textarea" />
				<div class="checkbox-container">
					<input id="agreement" v-model="agreement" type="checkbox" />
					<label for="agreement">
						{{ language === 'RU' ? 'Согласен на ' : 'I agree to the ' }}
						<NuxtLink to="/politic">
							{{ language === 'RU' ? 'обработку персональных данных' : 'processing of personal data' }}
						</NuxtLink>
					</label>
				</div>
				<button class="call btn" type="button" :disabled="!agreement" @click="sendPost">
					{{ language === 'RU' ? 'ОТПРАВИТЬ ЗАЯВКУ' : 'SEND AN APPLICATION' }}
				</button>
				<h4 v-if="statusSend.length > 0" class="send-status">{{ statusSend }}</h4>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'
import { usePageStore } from '~/stores/page'

defineEmits(['close'])

const props = defineProps({
	nameMachine: {
		type: String,
		default: '',
	},
})

const appStore = useAppStore()
const pageStore = usePageStore()
const { language } = storeToRefs(appStore)

const statusSend = ref('')
const inputCompany = ref('')
const inputName = ref('')
const inputTelephone = ref('')
const inputEmail = ref('')
const inputProduct = ref('')
const inputDosage = ref('')
const inputPerformance = ref('')
const inputComment = ref('')
const agreement = ref(true)

onMounted(() => {
	pageStore.loadPage(1)
})

const sendPost = async () => {
	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length > 0 &&
		inputCompany.value.length > 0 &&
		inputProduct.value.length > 0 &&
		inputDosage.value.length > 0 &&
		inputPerformance.value.length > 0
	) {
		try {
			await $fetch(`${appStore.server}forms/`, {
				method: 'POST',
				body: {
					type: `Заявка на машину ${props.nameMachine}`,
					telephone: inputTelephone.value,
					email: inputEmail.value,
					name: inputName.value,
					other: `Компания: ${inputCompany.value}, Продукт: ${inputProduct.value}, Дозировка: ${inputDosage.value}, Производительность: ${inputPerformance.value}, Комментарий: ${inputComment.value}`,
				},
			})
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputProduct.value = ''
			inputDosage.value = ''
			inputPerformance.value = ''
			inputComment.value = ''
			statusSend.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Request sent!'
		} catch (error: any) {
			statusSend.value = `${language.value === 'RU' ? 'Ошибка отправки заявки!' : 'Send error!'} ${error}`
			console.error(error)
		}
	} else {
		alert(language.value === 'RU' ? 'Проверьте правильность ввода всех полей!' : 'Check all fields!')
	}
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
	width: min(720px, 92vw);
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
	overflow-x: hidden;
	padding: 1.5rem 2rem;
	border-radius: 24px;
	background: #ffffff;
	box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
}
/* Скрываем скроллбар в модальном окне */
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

.send-status {
	margin: 0;
	font-weight: 600;
	color: #2fc1ff;
}
a .catalog-name-item {
	font-weight: normal;
}
.catalog-name {
	gap: 1rem;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 0.5rem;
}
.catalog-name-item {
	color: #2fc1ff;
	font-weight: 700;
}
.form-call {
	margin-top: 1rem;
}
.form-call .input,
.form-call .textarea {
	margin: 0.25rem 0 0.5rem 0;
	border-radius: 14px;
	border: 1px solid #e2e8f0;
	padding: 0.75rem 1rem;
	background: #f8fafc;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-call .input:focus,
.form-call .textarea:focus {
	outline: none;
	border-color: #38bdf8;
	box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}
.call {
	margin: 1rem 0;
	flex-grow: 1;
	width: 100%;
	border-radius: 999px;
	background: linear-gradient(135deg, #38bdf8, #2fc1ff);
	color: #ffffff;
	font-weight: 600;
	border: none;
	box-shadow: 0 12px 24px rgba(56, 189, 248, 0.35);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.call:hover {
	transform: translateY(-1px);
	box-shadow: 0 16px 30px rgba(56, 189, 248, 0.45);
}
.checkbox-container a {
	color: #2fc1ff;
}
@media (max-width: 980px) {
	h2 {
		margin: 0;
		color: #2fc1ff;
		text-align: center;
	}
	.catalog-name {
		margin: 0.5rem 0;
		flex-wrap: wrap;
	}
	.catalog-name-item {
		width: 100%;
		font-size: 20px;
		color: #2fc1ff;
		text-align: center;
	}
	.modal-window {
		margin: 1.5rem 0;
		padding: 2rem 1.5rem;
	}
	.close-mobile {
		display: block;
	}
	.close-desktop {
		display: none;
	}
}
</style>
