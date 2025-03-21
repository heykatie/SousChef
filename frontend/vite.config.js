// import { defineConfig } from 'vite';
// import eslintPlugin from 'vite-plugin-eslint';
// import react from '@vitejs/plugin-react';

// export default defineConfig((mode) => ({
// 	plugins: [
// 		react(),
// 		eslintPlugin({
// 			lintOnStart: true,
// 			failOnError: mode === 'production',
// 		}),
// 	],
// 	server: {
// 		open: true,
// 		proxy: {
// 			'/api': {
// 				target: 'http://localhost:8000',
// 				changeOrigin: true,
// 				secure: true,
// 			},
// 		},
// 	},
// 	build: {
// 		// chunkSizeWarningLimit: 700,
// 		rollupOptions: {
// 			output: {
// 				manualChunks(id) {
// 					if (id.includes('node_modules')) {
// 						if (id.includes('react')) return 'react-vendor';
// 						if (id.includes('lodash')) return 'lodash-vendor';
// 						if (id.includes('axios')) return 'axios-vendor';
// 						return 'vendor';
// 					}
// 				},
// 			},
// 		},
// 	},
// }));

import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig((mode) => ({
	base: '/',
	plugins: [
		react(),
		eslintPlugin({
			lintOnStart: true,
			failOnError: mode === 'production',
		}),
	],
	server: {
		// port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: true,
			},
		},
	},
}));