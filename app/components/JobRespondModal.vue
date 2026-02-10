<template>
	<Teleport to="body">
		<Transition name="modal">
			<div class="modal-background" @click.self="$emit('close')">
				<div class="modal-window">
					<!-- Кнопка закрытия -->
					<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>

					<div class="modal-content-wrapper">
						<h2 class="modal-title">
							{{ language === 'RU' ? 'Отправьте нам вашу заявку' : 'Send us your application' }}
						</h2>

						<form class="form-call" @submit.prevent="sendPost">
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

							<p class="communication-title">
								{{ language === 'RU' ? 'Удобный способ связи' : 'Convenient way of communication' }}
							</p>
							<div class="call-method">
								<button
									type="button"
									class="contact-icon"
									:class="{ active: inputCommunication === 'WhatsApp' }"
									aria-label="WhatsApp"
									@click="inputCommunication = 'WhatsApp'">
									<img src="/assets/whatsapp.png" alt="WhatsApp" />
								</button>
								<button
									type="button"
									class="contact-icon"
									:class="{ active: inputCommunication === 'Telegram' }"
									aria-label="Telegram"
									@click="inputCommunication = 'Telegram'">
									<img src="/assets/telegram.png" alt="Telegram" />
								</button>
								<button
									type="button"
									class="contact-icon"
									:class="{ active: inputCommunication === 'Viber' }"
									aria-label="Viber"
									@click="inputCommunication = 'Viber'">
									<img src="/assets/viber.png" alt="Viber" />
								</button>
								<button
									type="button"
									class="contact-icon"
									:class="{ active: inputCommunication === 'E-Mail' }"
									aria-label="E-Mail"
									@click="inputCommunication = 'E-Mail'">
									<img src="/assets/email.png" alt="E-Mail" />
								</button>
							</div>

							<p class="resume-title">{{ language === 'RU' ? 'Прикрепить резюме' : 'Attach resume' }}</p>
							<div class="file-input-wrapper">
								<input id="file" ref="fileInput" type="file" name="file" @change="handleFileUpload" />
							</div>

							<div class="checkbox-container">
								<input type="checkbox" id="agreement" v-model="agreement" />
								<label for="agreement">
									{{ language === 'RU' ? 'Согласен на ' : 'I agree to the ' }}
									<NuxtLink to="/politic" target="_blank">
										{{ language === 'RU' ? 'обработку персональных данных' : 'processing of personal data' }}
									</NuxtLink>
								</label>
							</div>

							<button class="call btn" type="submit" :disabled="!agreement || isLoading">
								{{ isLoading ? (language === 'RU' ? 'Отправка...' : 'Sending...') : (language === 'RU' ? 'ОТПРАВИТЬ ЗАЯВКУ' : 'SEND AN APPLICATION') }}
							</button>

							<h4 v-if="statusSend.length > 0" class="send-status" :class="{ error: isError }">{{ statusSend }}</h4>
						</form>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '~/stores/app';

const props = defineProps<{
	jobName: string
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

const appStore = useAppStore()
const { language } = storeToRefs(appStore)
const config = useRuntimeConfig()

const inputCompany = ref('')
const inputName = ref('')
const inputTelephone = ref('')
const inputEmail = ref('')
const inputCommunication = ref('')
const inputFile = ref<File | null>(null)
const agreement = ref(true)
const statusSend = ref('')
const isError = ref(false)
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.files && target.files.length > 0) {
		inputFile.value = target.files[0] || null
	}
}

const sendPost = async () => {
	statusSend.value = ''
	isError.value = false

	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length !== 0 &&
		inputCompany.value.length !== 0 &&
		inputCommunication.value.length !== 0
	) {
		isLoading.value = true
		const formData = new FormData()
		formData.append('type', 'Заявка на вакансию')
		formData.append('telephone', inputTelephone.value)
		formData.append('email', inputEmail.value)
		formData.append('name', inputName.value)
		formData.append(
			'other',
			'Вакансия: ' +
				props.jobName +
				', Компания: ' +
				inputCompany.value +
				', Удобный способ связи: ' +
				inputCommunication.value,
		)
		if (inputFile.value) {
			formData.append('file', inputFile.value)
		}

		try {
			await $fetch(`${config.public.apiBase}forms/`, {
				method: 'POST',
				body: formData,
			})
			statusSend.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Application sent successfully!'
			// Reset form
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputFile.value = null
			inputCommunication.value = ''
			if (fileInput.value) fileInput.value.value = ''
		} catch (error) {
			isError.value = true
			statusSend.value = language.value === 'RU' 
				? 'Ошибка отправки заявки! Попробуйте позже.' 
				: 'Error sending application! Try again later.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	} else {
		alert(language.value === 'RU' ? 'Проверьте правильность ввода всех полей!' : 'Check if all fields are correct!')
	}
}
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

/* Окно модалки (стиль как catalog-empty-card) */
.modal-window {
	position: relative;
	background: #ffffff;
	border-radius: 18px;
	width: 100%;
	max-width: 600px;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); /* Тень как в каталоге */
	border: 1px solid rgba(15, 23, 42, 0.08);
}

.modal-content-wrapper {
	padding: 2rem 2.5rem; /* Отступы как в catalog-empty-card */
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
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

/* Заголовок */
.modal-title {
	margin: 0; 
	font-weight: 700;
	font-size: 1.5rem; /* ~ h2 в каталоге, там не задан явно, но обычно h2 большой */
	color: #0f172a; /* Цвет заголовков, если не переопределен. В каталоге h2 цвета не видно но по контексту темный */
	/* В CatalogPage.vue h2 внутри .catalog-empty-card не имеет явных стилей цвета в CSS, значит наследует или дефолт */
}

/* Форма */
.form-call {
	display: flex;
	flex-direction: column;
	gap: 0.75rem; /* Как в CatalogPage.vue */
}

.form-call label {
	font-weight: 500;
	color: #6a6a6a; /* Использовал цвет из предыдущих файлов, в CatalogPage не видно явного цвета лейблов но может быть дефолт */
}

/* Стили Input как в CatalogPage.vue */
.form-call .input {
	padding: 0.55rem 1rem;
	border: 1px solid rgba(15, 23, 42, 0.12);
	border-radius: 14px;
	font-size: 0.95rem;
	background: #ffffff;
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
	transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
	margin: 0;
	width: 100%;
	box-sizing: border-box;
}

.form-call .input:focus {
	outline: none;
	border-color: rgba(14, 165, 233, 0.7);
	background: #ffffff;
	transform: translateY(0);
}

.communication-title,
.resume-title {
	margin: 0.5rem 0 0.2rem 0;
	font-weight: 600;
	color: #475569;
}

/* Стили иконок соцсетей как в CatalogPage.vue */
.call-method {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	justify-content: flex-start;
}

.contact-icon {
	border: 1px solid rgba(15, 23, 42, 0.12);
	background: #ffffff;
	width: 40px;
	height: 40px;
	border-radius: 12px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	padding: 0; /* Сброс паддинга button */
}

.contact-icon img {
	width: 22px;
	height: 22px;
	object-fit: contain;
}

.contact-icon.active {
	border-color: rgba(14, 165, 233, 0.5);
	box-shadow: 0 6px 16px rgba(14, 165, 233, 0.18);
	transform: translateY(-1px);
}

.contact-icon:hover {
	border-color: rgba(15, 23, 42, 0.2);
	box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
}

/* Стили чекбокса */
.checkbox-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
}

.checkbox-container label {
	font-size: 0.9rem;
	color: #6a6a6a;
}

.checkbox-container a {
	color: #0ea5e9; /* blue-500 примерно */
	text-decoration: none;
}

.checkbox-container a:hover {
	text-decoration: underline;
}

/* Стили кнопки отправки как .catalog-empty .call.btn */
.call.btn {
	align-self: flex-start;
	padding: 0.55rem 1.4rem;
	border-radius: 999px;
	background: #38bdf8;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.85rem;
	box-shadow: 0 6px 16px rgba(56, 189, 248, 0.35);
	border: none;
	cursor: pointer;
	text-transform: uppercase;
	margin-top: 1rem;
	transition: transform 0.16s ease, box-shadow 0.16s ease;
	width: auto; /* В каталоге align-self: flex-start, значит не на всю ширину */
}

.call.btn:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 8px 20px rgba(56, 189, 248, 0.45);
}

.call.btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
	box-shadow: none;
}

.send-status {
	margin: 0;
	font-weight: normal;
	margin-bottom: 20px;
	color: #16a34a;
	text-align: center;
}

.send-status.error {
	color: #dc2626;
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

@media (max-width: 640px) {
	.modal-content-wrapper {
		padding: 1.5rem;
	}
	
	.modal-title {
		font-size: 1.25rem;
		text-align: center;
		align-self: center;
	}

	.call.btn {
		width: 100%; /* На мобилках кнопка на всю ширину может быть удобнее */
		text-align: center;
	}
}
</style>
