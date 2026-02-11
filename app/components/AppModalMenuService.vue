<template>
	<div class="modal-background">
		<div class="close-background" @click="$emit('close')" />
		<div class="modal-window card-shadow flex-column">
			<button class="close-button" type="button" aria-label="Закрыть" @click="$emit('close')">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<h2 v-if="switchContent">
				{{ language === 'RU' ? 'Сервисное обслуживание' : 'Service maintenance' }}
			</h2>
			<h2 v-else>
				{{ language === 'RU' ? 'Заказ запчастей' : 'Parts order' }}
			</h2>
			<div class="service-buttons flex-row">
				<button :class="!switchContent ? 'btn-disabled' : 'btn'" @click="switchContent = true">
					{{ language === 'RU' ? 'ВЫЗОВ СПЕЦИАЛИСТА' : 'CALL A SPECIALIST' }}
				</button>
				<button :class="switchContent ? 'btn-disabled' : 'btn'" @click="switchContent = false">
					{{ language === 'RU' ? 'ЗАКАЗ ЗАПЧАСТЕЙ' : 'ORDERING SPARE PARTS' }}
				</button>
			</div>

			<section v-if="switchContent" class="form-call flex-column">
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
				<label for="model">{{ language === 'RU' ? 'Модель оборудования' : 'Equipment model' }}</label>
				<input
					id="model"
					v-model="inputModel"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'БЕСТРОМ - 420С' : 'BESTROM-420S'" />

				<label for="number-model">{{ language === 'RU' ? 'Заводской номер' : 'Factory number' }}</label>
				<input
					id="number-model"
					v-model="inputSerialNumber"
					type="text"
					class="input"
					placeholder="420С2801" />

				<p>{{ language === 'RU' ? 'Вид обслуживания' : 'Service type' }}</p>
				<div class="__select" :data-state="active ? 'active' : ''" @click="active = !active">
					<div :class="active ? 'active' : ''" class="__select__title">{{ inputServiceType }}</div>
					<div class="__select__content">
						<input id="singleSelect0" class="__select__input" type="radio" name="singleSelect" checked />
						<label
							for="singleSelect0"
							class="__select__label"
							@click="
								selectOption(language === 'RU' ? 'Пуско-наладочные работы' : 'Commissioning works')
							">
							{{ language === 'RU' ? 'Пуско-наладочные работы' : 'Commissioning works' }}
						</label>
						<input id="singleSelect1" class="__select__input" type="radio" name="singleSelect" />
						<label
							for="singleSelect1"
							class="__select__label"
							@click="selectOption(language === 'RU' ? 'Гарантийное обслуживание' : 'Warranty service')">
							{{ language === 'RU' ? 'Гарантийное обслуживание' : 'Warranty service' }}
						</label>
						<input id="singleSelect2" class="__select__input" type="radio" name="singleSelect" />
						<label
							for="singleSelect2"
							class="__select__label"
							@click="selectOption(language === 'RU' ? 'Сервисное обслуживание' : 'Service maintenance')">
							{{ language === 'RU' ? 'Сервисное обслуживание' : 'Service maintenance' }}
						</label>
						<input id="singleSelect3" class="__select__input" type="radio" name="singleSelect" />
						<label for="singleSelect3" class="__select__label" @click="selectOption(language === 'RU' ? 'Другое' : 'Other')">
							{{ language === 'RU' ? 'Другое' : 'Other' }}
						</label>
					</div>
				</div>

				<label for="date">
					{{
						language === 'RU'
							? 'Желаемая дата прибытия специалиста'
							: 'Desired date of arrival of the specialist'
					}}
				</label>
				<input
					id="date"
					v-model="inputDate"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Сегодня' : 'Today'" />
				<div class="checkbox-container">
					<input id="agreement" v-model="agreement" type="checkbox" />
					<label for="agreement">
						{{ language === 'RU' ? 'Согласен на ' : 'I agree to the ' }}
						<NuxtLink to="/politic">
							{{ language === 'RU' ? 'обработку персональных данных' : 'processing of personal data' }}
						</NuxtLink>
					</label>
				</div>
				<button class="call btn" :disabled="!agreement" @click="sendPostSpecialist">
					{{ language === 'RU' ? 'ОТПРАВИТЬ' : 'SEND' }}
				</button>
				<h4 v-if="statusSendSpecialist.length > 0" class="send-status">{{ statusSendSpecialist }}</h4>
			</section>

			<section v-else class="form-call flex-column">
				<label for="companyParts">{{ language === 'RU' ? 'Компания' : 'Company' }}</label>
				<input
					id="companyParts"
					v-model="inputCompany"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'БЕСТРОМ' : 'BESTROM'" />
				<label for="fioParts">{{ language === 'RU' ? 'Ф.И.О' : 'Full name' }}</label>
				<input
					id="fioParts"
					v-model="inputName"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'Иван Иванович' : 'Ivan Ivanovich'" />
				<label for="telephoneParts">{{ language === 'RU' ? 'Телефон' : 'Telephone' }}</label>
				<input
					id="telephoneParts"
					v-model="inputTelephone"
					type="text"
					class="input"
					placeholder="89199966203" />
				<label for="emailParts">E-mail</label>
				<input
					id="emailParts"
					v-model="inputEmail"
					type="text"
					class="input"
					placeholder="partner@thedimension.com" />
				<label for="modelParts">{{ language === 'RU' ? 'Модель оборудования' : 'Equipment model' }}</label>
				<input
					id="modelParts"
					v-model="inputModel"
					type="text"
					class="input"
					:placeholder="language === 'RU' ? 'БЕСТРОМ - 420С' : 'BESTROM-420S'" />
				<label for="number-model">{{ language === 'RU' ? 'Заводской номер' : 'Factory number' }}</label>
				<input
					id="number-model"
					v-model="inputSerialNumber"
					type="text"
					class="input"
					placeholder="420С2801" />

				<p>{{ language === 'RU' ? 'Наименование запчасти' : 'Part name' }}</p>
				<div class="flex-row call-inputs">
					<input v-model.trim="inputDetailValue" type="text" class="input" placeholder="0253121" />
					<div class="add-btn" @click="pushInput">{{ language === 'RU' ? 'Добавить' : 'Add' }}</div>
				</div>

				<transition-group name="modal">
					<div v-for="input in inputsDetails" :key="input.id" class="flex-row call-inputs">
						<input type="text" class="input" :value="input.content" readonly />
						<div class="del-btn" @click="removeInput(input.id)">
							{{ language === 'RU' ? 'Удалить' : 'Remove' }}
						</div>
					</div>
				</transition-group>

				<p>
					{{
						language === 'RU'
							? 'Вложение (Добавьте фото интересующей Вас детали)'
							: 'Attachment (Add a photo of the detail you are interested in)'
					}}
				</p>
				<div class="flex-row call-inputs">
					<input id="file" ref="fileRef" class="input-file" type="file" name="file" @change="handleFileUpload" />
				</div>

				<div class="radio-type flex-row">
					<input
						id="delivery-choice-1"
						v-model="radioCatalogSelect"
						class="custom-radio"
						name="delivery-choice"
						type="radio"
						value="Доставка" />
					<label for="delivery-choice-1">{{ language === 'RU' ? 'Доставка' : 'Delivery' }}</label>
					<input
						id="delivery-choice-2"
						v-model="radioCatalogSelect"
						class="custom-radio"
						name="delivery-choice"
						type="radio"
						value="Самовывоз" />
					<label for="delivery-choice-2">{{ language === 'RU' ? 'Самовывоз' : 'Self-pickup' }}</label>
				</div>
				<input
					v-if="radioCatalogSelect === 'Доставка'"
					id="address"
					v-model="inputAddress"
					type="text"
					class="input"
					:placeholder="
						language === 'RU'
							? 'г. Красногорск, Ильинское шоссе, д.15'
							: 'Krasnogorsk, Ilyinskoe highway, 15'
					" />
				<label for="comment">{{ language === 'RU' ? 'Комментарий' : 'Comment' }}</label>
				<textarea id="comment" v-model="inputComment" class="textarea" />
				<div class="checkbox-container">
					<input id="agreementParts" v-model="agreementParts" type="checkbox" />
					<label for="agreementParts">
						{{ language === 'RU' ? 'Согласен на ' : 'I agree to the ' }}
						<NuxtLink to="/politic">
							{{ language === 'RU' ? 'обработку персональных данных' : 'processing of personal data' }}
						</NuxtLink>
					</label>
				</div>
				<button class="call btn" :disabled="!agreementParts" @click="sendPostParts">
					{{ language === 'RU' ? 'ОТПРАВИТЬ' : 'SEND' }}
				</button>
				<h4 v-if="statusSendParts.length > 0" class="send-status">{{ statusSendParts }}</h4>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'
import { usePageStore } from '~/stores/page'

defineEmits(['close'])

const appStore = useAppStore()
const pageStore = usePageStore()
const { language } = storeToRefs(appStore)

const statusSendSpecialist = ref('')
const statusSendParts = ref('')
const switchContent = ref(true)
const active = ref(false)
const radioCatalogSelect = ref('Доставка')
const inputServiceType = ref(language.value === 'RU' ? 'Пуско-наладочные работы' : 'Commissioning works')
const inputDetailValue = ref('')
const inputsDetails = ref<{ id: number; content: string }[]>([])
const inputFile = ref<File | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)

const inputCompany = ref('')
const inputName = ref('')
const inputTelephone = ref('')
const inputEmail = ref('')
const inputModel = ref('')
const inputDate = ref('')
const inputComment = ref('')
const inputSerialNumber = ref('')
const inputAddress = ref('')
const agreement = ref(true)
const agreementParts = ref(false)

onMounted(() => {
	pageStore.loadPage(1)
})

const handleFileUpload = () => {
	inputFile.value = fileRef.value?.files?.[0] || null
}

const sendPostParts = async () => {
	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length > 0 &&
		inputCompany.value.length > 0 &&
		inputModel.value.length > 0 &&
		inputSerialNumber.value.length > 0
	) {
		if (radioCatalogSelect.value === 'Доставка' && inputAddress.value.length === 0) {
			alert(language.value === 'RU' ? 'Введите адрес доставки!' : 'Enter delivery address!')
			return
		}

		const formData = new FormData()
		formData.append('type', 'Заказ запчастей')
		formData.append('telephone', inputTelephone.value)
		formData.append('email', inputEmail.value)
		formData.append('name', inputName.value)

		let other = `Компания: ${inputCompany.value}, Модель оборудования: ${inputModel.value}, Заводской номер: ${inputSerialNumber.value}, Наименование запчастей: ${inputsDetails.value
			.map((item) => item.content)
			.join(' ')}, ${radioCatalogSelect.value}`
		if (radioCatalogSelect.value === 'Доставка') {
			other += `, Адрес: ${inputAddress.value}`
		}
		other += `, Комментарий: ${inputComment.value}`
		formData.append('other', other)

		if (inputFile.value) {
			formData.append('file', inputFile.value)
		}

		try {
			await $fetch(`${appStore.server}forms/`, {
				method: 'POST',
				body: formData,
			})
			statusSendParts.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Request sent!'
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputFile.value = null
			inputModel.value = ''
			inputSerialNumber.value = ''
			inputsDetails.value = []
			inputAddress.value = ''
			inputComment.value = ''
		} catch (error: any) {
			statusSendParts.value = `${language.value === 'RU' ? 'Ошибка отправки заявки!' : 'Send error!'} ${error}`
			console.error(error)
		}
	} else {
		alert(language.value === 'RU' ? 'Проверьте правильность ввода всех полей!' : 'Check all fields!')
	}
}

const sendPostSpecialist = async () => {
	if (
		(inputTelephone.value.length > 10 || (inputEmail.value.includes('@') && inputEmail.value.length > 6)) &&
		inputName.value.length > 0 &&
		inputCompany.value.length > 0 &&
		inputModel.value.length > 0 &&
		inputDate.value.length > 0
	) {
		const formData = new FormData()
		formData.append('type', 'Вызов специалиста')
		formData.append('telephone', inputTelephone.value)
		formData.append('email', inputEmail.value)
		formData.append('name', inputName.value)
		formData.append(
			'other',
			`Компания: ${inputCompany.value}, Модель оборудования: ${inputModel.value}, Заводской номер: ${inputSerialNumber.value}, Вид обслуживания: ${inputServiceType.value}, Желаемая дата прибытия специалиста: ${inputDate.value}`,
		)

		try {
			await $fetch(`${appStore.server}forms/`, {
				method: 'POST',
				body: formData,
			})
			statusSendSpecialist.value = language.value === 'RU' ? 'Заявка успешно отправлена!' : 'Request sent!'
			inputCompany.value = ''
			inputTelephone.value = ''
			inputName.value = ''
			inputEmail.value = ''
			inputModel.value = ''
			inputSerialNumber.value = ''
			inputDate.value = ''
		} catch (error: any) {
			statusSendSpecialist.value = `${language.value === 'RU' ? 'Ошибка отправки заявки!' : 'Send error!'} ${error}`
			console.error(error)
		}
	} else {
		alert(language.value === 'RU' ? 'Проверьте правильность ввода всех полей!' : 'Check all fields!')
	}
}

const selectOption = (item: string) => {
	inputServiceType.value = item
	active.value = !active.value
}

const pushInput = () => {
	if (inputDetailValue.value.trim() !== '') {
		inputsDetails.value.push({
			id: inputsDetails.value.length,
			content: inputDetailValue.value,
		})
	}
	inputDetailValue.value = ''
}

const removeInput = (id: number) => {
	const index = inputsDetails.value.findIndex((item) => item.id === id)
	if (index !== -1) {
		inputsDetails.value.splice(index, 1)
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
	font-weight: normal;
}
.service-buttons {
	margin: 1rem -1rem;
}
.service-buttons .btn {
	flex-grow: 1;
	width: 100%;
	margin: 0 1rem;
	padding: 0.6rem 1.4rem;
	min-height: 3.2rem;
	border-radius: 999px;
	background: #38bdf8;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.95rem;
	box-shadow: 0 8px 20px rgba(56, 189, 248, 0.35);
	border: none;
	transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.service-buttons .btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 12px 24px rgba(56, 189, 248, 0.45);
	background: #2fc1ff;
}
.btn-disabled {
	flex-grow: 1;
	width: 100%;
	margin: 0 1rem;
	padding: 0.6rem 1.4rem;
	min-height: 3.2rem;
	background: #e2e8f0;
	box-shadow: 0 6px 16px rgba(148, 163, 184, 0.35);
	border: none;
	border-radius: 999px;
	font-family: Montserrat, sans-serif;
	font-style: normal;
	font-weight: 600;
	font-size: 0.95rem;
	line-height: 142%;
	letter-spacing: 0.005em;
	font-feature-settings: 'tnum' on, 'lnum' on;
	color: #64748b;
	cursor: pointer;
	transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.btn-disabled:hover {
	transform: translateY(-1px);
	background: #cbd5f5;
	box-shadow: 0 10px 20px rgba(148, 163, 184, 0.45);
}
.form-call p {
	margin: 0;
}
.form-call .input,
.form-call .textarea {
	margin: 0.5rem 0;
}
.call {
	margin: 1rem 0;
	flex-grow: 1;
	width: 100%;
}
.call-inputs {
	align-items: center;
}
.call-inputs input {
	flex-grow: 1;
	width: 100%;
}
.input-file {
	margin: 0.5rem 0;
}
.add-btn,
.del-btn {
	width: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 14px;
	font-weight: normal;
	min-height: 1rem;
	padding: 0 1rem;
	height: 2rem;
	margin-left: 1rem;
	color: #ffffff;
	border-radius: 999px;
}
.add-btn {
	background-color: #4cc4ff;
}
.del-btn {
	background-color: #ff5454;
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
.radio-type {
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	margin: 0.5rem 0;
}
.radio-type label {
	font-weight: normal;
	font-size: 1rem;
}

.__select {
	position: relative;
	margin: 0.5rem 0;
	box-shadow: inset 0 0 10px -4px rgba(0, 0, 0, 0.25);
	border-radius: 6px;
	border: none;
}
.__select[data-state='active'] .__select__title::before {
	transform: translate(-3px, -50%) rotate(-45deg);
}
.__select[data-state='active'] .__select__title::after {
	transform: translate(3px, -50%) rotate(45deg);
}
.__select[data-state='active'] .__select__content {
	opacity: 1;
}
.__select[data-state='active'] .__select__label + .__select__input + .__select__label {
	max-height: 2rem;
	border-top-width: 1px;
}
.__select__title {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 8px 16px;
	border-radius: 5px;
	cursor: pointer;
}
.__select__title::before,
.__select__title::after {
	content: '';
	position: absolute;
	top: 50%;
	right: 16px;
	display: block;
	width: 10px;
	height: 2px;
	transition: all 0.3s ease-out;
	background-color: #333333;
	transform: translate(-3px, -50%) rotate(45deg);
}
.__select__title::after {
	transform: translate(3px, -50%) rotate(-45deg);
}
.__select__title:hover {
	border-color: #2fc1ff;
}
.__select__title:hover::before,
.__select__title:hover::after {
	background-color: #2fc1ff;
}
.__select__content {
	position: absolute;
	top: 2rem;
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: #ffffff;
	border-radius: 6px;
	border: none;
	box-shadow: inset 0 0 10px -4px rgba(0, 0, 0, 0.25);
	transition: all 0.3s ease-out;
	opacity: 0;
	z-index: 8;
}
.__select__input {
	display: none;
}
.__select__input:checked + label {
	background-color: #dedede;
}
.__select__input:disabled + label {
	opacity: 0.6;
	pointer-events: none;
}
.__select__label {
	display: flex;
	align-items: center;
	height: 2rem;
	max-height: 0;
	padding: 0 1rem;
	transition: all 0.2s ease-out;
	cursor: pointer;
	overflow: hidden;
}
.__select__label + input + .__select__label {
	border-top: 0 solid #c7ccd160;
}
.__select__label:hover {
	background-color: #2fc1ff !important;
	color: #ffffff;
}

.checkbox-container a {
	color: #2fc1ff;
}
@media (max-width: 980px) {
	h2 {
		align-self: center;
		text-align: center;
		color: #6a6a6a;
	}
	.service-buttons {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 0 1rem 0;
	}
	.service-buttons .btn {
		font-size: 16px;
		margin: 0.5rem 1rem;
		min-height: 3.5rem;
	}
	.btn-disabled {
		font-size: 16px;
		min-height: 3.5rem;
		margin: 0.5rem 1rem;
	}
	.modal-window {
		padding: 1.5rem 1rem;
		margin: 0 0.75rem;
		width: auto;
		align-self: center;
		max-height: calc(100vh - 4rem);
	}
	.__select__title {
		align-items: normal;
	}
}
</style>
