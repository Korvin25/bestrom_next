export default defineNuxtPlugin((nuxtApp) => {

    const router = useRouter();

    function initYandexMetrika() {
        (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
            // @ts-ignore
            m[i].l = 1 * new Date();
            for (var j = 0; j < document.scripts.length; j++) {
                var s = document.scripts[j];
                if (s && s.src === r) { return; }
            }
            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        // @ts-ignore
        window.ym(30893886, "init", {
            clickmap: true,
            accurateTrackBounce: true,
            trackLinks: true,
            webvisor: true
        });
    }

    initYandexMetrika();

    router.afterEach((to, from) => {
        // @ts-ignore
        if (typeof window.ym === 'function') {
            // @ts-ignore
            window.ym(30893886, 'hit', to.fullPath);
        }
    });
});
