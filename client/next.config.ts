import nextPwa from "next-pwa";

const nextConfig = nextPwa({
  dest: "public", // Service Worker will be generated in "public" folder
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
})({
  // reactStrictMode: true,
});

export default nextConfig;
