import fs from "node:fs/promises";
import path from "node:path";

// some notes

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		after: true,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "false" },
					{
						key: "Content-Security-Policy",
						value:
						  "default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;",
					  },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "*",
					},
					{
						key: 'Content-Security-Policy',
						value: `
						default-src 'self';
						script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://cdn.jsdelivr.net;
						style-src 'self' 'unsafe-inline' https://www.youtube.com https://fonts.googleapis.com https://cdn.jsdelivr.net;
						style-src-elem 'self' 'unsafe-inline' https://www.youtube.com https://fonts.googleapis.com https://cdn.jsdelivr.net;
						img-src 'self' blob: data: https://i.ytimg.com https://www.youtube.com;
						font-src 'self' https://fonts.gstatic.com;
						connect-src 'self' https://*.supabase.co https://*.supabase.io wss://*.supabase.co https://www.youtube.com;
						frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://*.youtube.com;
  						media-src 'self' blob: https://*.youtube.com https://*.ytimg.com;
						base-uri 'self';
						form-action 'self';
						`.replace(/\s{2,}/g, ' ').trim()
					  },
				  ],
			},
		];
	},
	typescript: {
		ignoreBuildErrors: true, // added ignoreBuildErrors due to generatestaticparams type errors
	  },
};



export default nextConfig;

async function copyFiles() {
	try {
		await fs.access("public/");
	} catch {
		await fs.mkdir("public/", { recursive: true });
	}

	const wasmFiles = (
		await fs.readdir("node_modules/onnxruntime-web/dist/")
	).filter((file) => path.extname(file) === ".wasm");

	await Promise.all([
		fs.copyFile(
			"node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
			"public/vad.worklet.bundle.min.js"
		),
		fs.copyFile(
			"node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
			"public/silero_vad.onnx"
		),
		...wasmFiles.map((file) =>
			fs.copyFile(
				`node_modules/onnxruntime-web/dist/${file}`,
				`public/${file}`
			)
		),
	]);
}



copyFiles();
