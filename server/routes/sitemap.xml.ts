export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event)
	const baseUrl = config.public.siteUrl || 'https://bestrom.ru'

	const staticRoutes = [
		'/',
		'/about',
		'/about/history',
		'/news',
		'/cutting',
		'/jobs',
		'/partners',
		'/clients',
		'/catalog',
		'/politic',
		'/requisites',
		'/sitemap',
	]

	const [news, products] = await Promise.all([
		$fetch<any[]>(`${config.public.apiBase}news/`).catch(() => []),
		$fetch<any[]>(`${config.public.apiBase}product/`).catch(() => []),
	])

	const dynamicRoutes = [
		...news.map((item) => `/news/${item.slug}`),
		...products.map((item) => `/catalog/machine/${item.slug}`),
	]

	const urls = [...staticRoutes, ...dynamicRoutes]
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		urls.map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`).join('\n') +
		`\n</urlset>`

	event.node.res.setHeader('Content-Type', 'application/xml')
	return xml
})
