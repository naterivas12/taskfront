// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// compatibilityDate: "2024-11-01",
	// devtools: { enabled: true },
	modules: ["nuxt-apollo"],

	apollo: {
		clients: {
			default: {
				httpEndpoint: "http://localhost:4000/graphql",
			},
		},
	} as any,
	build: {
		transpile: ["@vue/apollo-composable"],
	},
	css: [
		"bootstrap/dist/css/bootstrap.min.css",
		"bootstrap-icons/font/bootstrap-icons.css",
	],
	
	vite: {
		define: {
			"process.env.DEBUG": false,
		},
	},
});