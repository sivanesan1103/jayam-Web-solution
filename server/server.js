import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001


app.use(cors())
app.use(express.json())

const ORDERS_FILE = path.join(__dirname, 'orders.json')

async function initOrdersFile() {
  try {
    await fs.access(ORDERS_FILE)
  } catch {
    await fs.writeFile(ORDERS_FILE, JSON.stringify([]))
    console.log('Created orders.json file')
  }
}


app.get('/api/orders', async (req, res) => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    const orders = JSON.parse(data)
    res.json(orders)
  } catch (error) {
    console.error('Error reading orders:', error)
    res.status(500).json({ error: 'Failed to read orders' })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = req.body
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    const orders = JSON.parse(data)
    orders.unshift(newOrder)
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
    res.json({ success: true, order: newOrder })
  } catch (error) {
    console.error('Error saving order:', error)
    res.status(500).json({ error: 'Failed to save order' })
  }
})

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    const orders = JSON.parse(data)
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status } : o
    )
    await fs.writeFile(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2))
    res.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({ error: 'Failed to update order' })
  }
})


initOrdersFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
