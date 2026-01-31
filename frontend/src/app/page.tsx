'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState('З’єднуємось із SavageMood...')

  useEffect(() => {
    fetch('http://localhost:8080/')
        .then(res => res.json())
        .then(data => setStatus(data.message))
        .catch(() => setStatus('Помилка: Бекенд не відповідає ❌'))
  }, [])

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h1>{status}</h1>
      </div>
  )
}