<template>
	<div>
		<AppNavMenu />
		<AppHeader />
		<main class="main-content flex-column">
			<div class="container section">
				<Breadcrumbs />
			</div>
			<slot />
		</main>
		<AppFooter />
	</div>
</template>

<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue';
import AppHeader from '~/components/AppHeader.vue';
import AppNavMenu from '~/components/AppNavMenu.vue';
</script>
