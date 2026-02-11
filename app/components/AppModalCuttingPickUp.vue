<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<h2>{{ language === 'RU' ? 'Подобрать раскрой' : 'Select cutting' }}</h2>
			<section class="form-call flex-column">
				<label for="cutting-company">{{ language === 'RU' ? 'Компания' : 'Company' }}</label>
				<input
					id="cutting-company"
					v-model="inputCompany"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'БЕСТРОМ' : 'BESTROM'" />
				<label for="cutting-fio">{{ language === 'RU' ? 'Ф.И.О' : 'Full name' }}</label>
				<input
					id="cutting-fio"
					v-model="inputName"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Иван Иванович' : 'Ivan Ivanovich'" />
				<label for="cutting-telephone">{{ language === 'RU' ? 'Телефон' : 'Telephone' }}</label>
				<input
					id="cutting-telephone"
					v-model="inputTelephone"
					type="text"
					class="input"
					placeholder="89199966203" />
				<label for="cutting-email">E-mail</label>
				<input
					id="cutting-email"
					v-model="inputEmail"
					type="text"
					class="input"
					placeholder="partner@thedimension.com" />
				<label for="cutting-product">{{ language === 'RU' ? 'Продукт' : 'Product' }}</label>
				<input
					id="cutting-product"
					v-model="inputProduct"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Фисташки' : 'Pistachio'" />
				<label for="cutting-weight">{{ language === 'RU' ? 'Дозировка' : 'Dosage' }}</label>
				<input
					id="cutting-weight"
					v-model="inputDosage"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? '100г' : '100g'" />
				<label for="cutting-speed">
					{{ language === 'RU' ? 'Требуемая производительность' : 'Required performance' }}
				</label>
				<input
					id="cutting-speed"
					v-model="inputPerformance"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? '60 п/м' : '60 p/m'" />
				<label for="cutting-comment">{{ language === 'RU' ? 'Комментарий' : 'Comment' }}</label>
				<textarea id="cutting-comment" v-model="inputComment" rows="5" class="textarea" />
				<div class="checkbox-container">
					<input id="cutting-agreement" v-model="agreement" type="checkbox" />
					<label for="cutting-agreement">
						{{ language === 'RU' ? 'Согласен на ' : 'I agree to the ' }}
						<NuxtLink to="/politic">
							{{ language === 'RU' ? 'обработку персональных данных' : 'processing of personal data' }}
						</NuxtLink>
					</label>
				</div>
				<button class="call btn" type="button" :disabled="!agreement" @click="sendPost">
					{{ language === 'RU' ? 'ОТПРАВИТЬ' : 'TO SEND' }}
				</button>
				<h4 v-if="statusSend.length > 0" class="send-status">{{ statusSend }}</h4>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

defineEmits(['close'])

const appStore = useAppStore()
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

const sendPost = async () => {
	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length > 0 &&
		inputProduct.value.length > 0 &&
		inputCompany.value.length > 0 &&
		inputDosage.value.length > 0 &&
		inputPerformance.value.length > 0
	) {
		try {
			await $fetch(`${appStore.server}forms/`, {
				method: 'POST',
				body: {
					type: 'Подобрать раскрой',
					telephone: inputTelephone.value,
					email: inputEmail.value,
					name: inputName.value,
					other: `Компания: ${inputCompany.value}, Продукт: ${inputProduct.value}, Дозировка: ${inputDosage.value}, Производительность: ${inputPerformance.value}, Комментарий: ${inputComment.value}`,
				},
			})
			statusSend.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Request sent!'
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputProduct.value = ''
			inputDosage.value = ''
			inputPerformance.value = ''
			inputComment.value = ''
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

.send-status {
	margin: 0;
	font-weight: 600;
	color: #2fc1ff;
}
.form-call {
	margin-top: 1rem;
}
.form-call .input,
.form-call .textarea {
	margin: 0.35rem 0 0.75rem 0;
}
.call {
	margin: 1rem 0;
	flex-grow: 1;
	width: 100%;
}
.checkbox-container a {
	color: #2fc1ff;
}
.close-mobile {
	display: none;
}
.close-desktop {
	display: block;
}
.modal-window {
	position: relative;
	padding: 1.5rem 2rem;
	justify-content: flex-start;
	width: 50%;
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
	border-radius: 24px;
	background: #ffffff;
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
.modal-background {
	position: fixed;
	z-index: 9999;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(106, 106, 106, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem 0;
}

@media (max-width: 980px) {
	h2 {
		align-self: center;
		text-align: center;
		color: #2fc1ff;
	}
	.close-mobile {
		display: block;
	}
	.close-desktop {
		display: none;
	}
	.modal-window {
		padding: 1.5rem 1rem;
		margin: 0 0.75rem;
		width: calc(100% - 1.5rem);
		align-self: center;
		max-height: calc(100vh - 4rem);
	}
}
</style>
