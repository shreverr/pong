import { Hono } from 'hono'

const app = new Hono()

let lastFetch: { ts: string; status: number; ok: boolean } | { ts: string; error: string } | null = null

async function fetchTarget() {
  const url = process.env.CURL_TO
  if (!url) return
  try {
    const res = await fetch(url)
    lastFetch = { ts: new Date().toISOString(), status: res.status, ok: res.ok }
    console.log(await res.json());
    
  } catch (err) {
    lastFetch = { ts: new Date().toISOString(), error: String(err) }
  }
}

fetchTarget()
setInterval(fetchTarget, 5 * 60 * 1000)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', lastFetch })
})

export default app
