export default {
  async fetch(request, env) {
    // The Cloudflare Pages asset handler will serve static assets
    return env.ASSETS.fetch(request)
  },
}
