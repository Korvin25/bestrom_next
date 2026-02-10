<template>
	<div class="page-blocks">
		<section v-for="block in blocks" :key="block.id || block.name" class="page-block card-shadow">
			<template v-if="isYoutubeBlock(block)">
				<div v-for="content in block.contents || []" :key="content.id" class="page-block-video">
					<iframe
						v-if="videoSrc(content)"
						class="page-block-iframe"
						:src="videoSrc(content)"
						title="About video"
						frameborder="0"
						allow="clipboard-write; autoplay; fullscreen; picture-in-picture"
						allowfullscreen />
				</div>
			</template>
			<template v-else>
				<h1 v-if="isHistoryBlock(block)">{{ historyTitle(block) }}</h1>
				<h3 v-else>{{ blockTitle(block) }}</h3>
				<div class="page-block-contents">
					<div v-for="content in block.contents || []" :key="content.id" class="page-block-content">
						<div class="page-block-text">
							<h4 v-if="shouldShowContentTitle(block, content)">{{ contentTitle(content) }}</h4>
							<p v-html="contentText(content)" />
						</div>
						<div
							v-if="contentFiles(content).length"
							class="page-block-media"
							:class="{ 'page-block-media--single': contentFiles(content).length === 1 }">
							<NuxtImg
								v-if="contentFiles(content).length === 1 && firstContentFile(content)"
								class="page-block-image"
								:src="firstContentFile(content)?.src"
								:alt="firstContentFile(content)?.alt || contentTitle(content)"
								width="640"
								height="420"
								loading="lazy" />
							<div v-else class="page-block-gallery">
								<NuxtImg
									v-for="fileItem in contentFiles(content)"
									:key="fileItem.src"
									class="page-block-gallery-image"
									:src="fileItem.src"
									:alt="fileItem.alt || contentTitle(content)"
									width="140"
									height="140"
									loading="lazy" />
							</div>
						</div>
					</div>
				</div>
			</template>
		</section>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	blocks: any[]
	language: 'RU' | 'EN'
	mediaBase: string
}>()

type FileSource = string | { file?: string; alt?: string } | Array<string | { file?: string; alt?: string }>

const resolveImage = (src: unknown) => {
	if (!src || typeof src !== 'string') return ''
	if (src.startsWith('http')) return src
	return `${props.mediaBase}${src.replace(/^\//, '')}`
}

const blockTitle = (block: any) => {
	if (props.language === 'RU') {
		return block.verbose_name || block.title || block.name || ''
	}
	return block.verbose_name_en || block.title_en || block.name_en || block.title || block.name || block.verbose_name || ''
}

const contentTitle = (content: any) => {
	if (props.language === 'RU') return content.name || ''
	return content.name_en || content.name || ''
}

const shouldShowContentTitle = (block: any, content: any) => {
	if (isHistoryBlock(block)) return false
	const title = contentTitle(content).trim()
	const blockLabel = blockTitle(block).trim()
	if (!title) return false
	return title.toLowerCase() !== blockLabel.toLowerCase()
}

const contentText = (content: any) => {
	const raw = props.language === 'RU' ? content.text : content.text_en || content.text
	return typeof raw === 'string' ? raw : ''
}

const isYoutubeBlock = (block: any) => block?.name === 'youtube'
const isHistoryBlock = (block: any) => ['history', 'advanced-history'].includes(block?.name)

const historyTitle = (block: any) => {
	const firstContent = block?.contents?.[0]
	if (firstContent) {
		return contentTitle(firstContent)
	}
	return blockTitle(block)
}

const videoSrc = (content: any) => {
	const raw = contentText(content).trim()
	if (!raw) return ''
	if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
		try {
			const url = new URL(raw)
			const id = url.searchParams.get('v') || (url.hostname.includes('youtu.be') ? url.pathname.slice(1) : '')
			return id ? `https://www.youtube.com/embed/${id}` : raw
		} catch {
			return raw
		}
	}
	return `https://rutube.ru/play/embed/${raw}`
}

const contentFiles = (content: any) => {
	const file = content?.file as FileSource | undefined
	if (!file) return []
	const filesArray = Array.isArray(file) ? file : [file]
	return filesArray
		.map((entry) => {
			if (typeof entry === 'string') {
				const src = resolveImage(entry)
				return src ? { src, alt: '' } : null
			}
			if (entry && typeof entry === 'object' && 'file' in entry) {
				const src = resolveImage(entry.file)
				return src ? { src, alt: entry.alt || '' } : null
			}
			return null
		})
		.filter(Boolean) as Array<{ src: string; alt: string }>
}

const firstContentFile = (content: any) => contentFiles(content)[0] || null
</script>

<style scoped>
.page-blocks {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 2rem;
}
.page-block {
	padding: 1.5rem;
}
.page-block-contents {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}
.page-block-content {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 1.5rem;
	align-items: center;
}
.page-block-media {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.page-block-media--single {
	border-radius: 12px;
	overflow: hidden;
}
.page-block-image {
	width: 100%;
	max-height: 360px;
	height: auto;
	border-radius: 12px;
	object-fit: cover;
	display: block;
}
.page-block-gallery {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	gap: 1rem;
	align-items: center;
}
.page-block-gallery-image {
	width: 100%;
	max-height: 140px;
	height: auto;
	border-radius: 12px;
	object-fit: contain;
	background: #fff;
}
.page-block-video {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}
.page-block-iframe {
	width: 100%;
	min-height: 320px;
	border-radius: 16px;
	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
}
@media (max-width: 980px) {
	.page-block-content {
		grid-template-columns: 1fr;
	}
	.page-block-media--single {
		justify-content: stretch;
	}
	.page-block-image {
		max-height: none;
	}
}
</style>
