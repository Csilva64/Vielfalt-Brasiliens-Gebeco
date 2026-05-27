import { useState, useEffect, useRef } from 'react'

const LANGS = {
  de: {
    placeholder: 'Stellen Sie eine Frage zur Reise...',
    welcome: 'Herzlich willkommen! Ich bin Ihr persönlicher Reiseassistent für **Die Vielfalt Brasiliense**.\n\nIch begleite Sie auf Ihrer **15-tägigen Brasilien-Reise** — von den Iguaçu-Wasserfällen durch den Amazonas bis nach Rio de Janeiro und Salvador.\n\n**Wie kann ich dir heute helfen?**',
    suggestions: ['Tagesablauf anzeigen', 'Hotels und Unterkünfte', 'Was ist inbegriffen?', 'Flugdetails', 'Amazonas-Programm', 'Reiseleiter-Kontakte'],
    sysLang: 'Antworte IMMER auf Deutsch. Sei freundlich, präzise und enthusiastisch. Nutze Emojis sparsam.',
  },
  pt: {
    placeholder: 'Faça uma pergunta sobre a viagem...',
    welcome: 'Olá! Bem-vindo ao assistente de viagem da **Die Vielfalt Brasiliense**!\n\nEstou aqui para ajudá-lo durante os **15 dias pelo Brasil** — das Cataratas do Iguaçu à Amazônia, de Rio de Janeiro a Salvador.\n\n**Como posso te ajudar hoje?**',
    suggestions: ['Ver roteiro dia a dia', 'Hotéis e hospedagens', 'O que está incluído?', 'Detalhes dos voos', 'Programa na Amazônia', 'Contatos dos guias'],
    sysLang: 'Responda SEMPRE em português brasileiro. Seja amigável, preciso e entusiasmado. Use emojis com moderação.',
  },
  en: {
    placeholder: 'Ask a question about the trip...',
    welcome: "Welcome! I'm your personal travel assistant for **Die Vielfalt Brasiliense**.\n\nI'm here to help throughout your **15-day Brazil journey** — from Iguaçu Falls through the Amazon to Rio de Janeiro and Salvador.\n\n**How can I help you today?**",
    suggestions: ['Show daily itinerary', 'Hotels & accommodation', "What's included?", 'Flight details', 'Amazon programme', 'Guide contacts'],
    sysLang: 'ALWAYS respond in English. Be friendly, precise and enthusiastic. Use emojis sparingly.',
  },
}

const TRIP = `OPERATOR: OPCO Tours | opcotours.com | +5521-97565-5173 | carlos@opcotours.com
DURATION: 15 days/14 nights | GROUP: 2-14 pax | AIRLINE: LATAM Airlines (LA)

ITINERARY:
Day 1 - OVERNIGHT FLIGHT Frankfurt->Sao Paulo: LA8071 FRA 21:40->GRU 04:50
Day 2 - FOZ DO IGUACU: LA3200 GRU 07:50->IGU 09:35. Transfer->Recanto Cataratas Thermas Resort. Caipirinha welcome drink. Brazilian side waterfalls (2.5km walkways). Hubby eSIM 1GB (get code from reception).
Day 3 - FOZ DO IGUACU: Argentine side waterfalls. Free time/pool.
Day 4 - MANAUS: Checkout. LA3879 IGU 15:00->GRU 16:45. LA3562 GRU 18:55->MAO 21:55. Check-in Blue Tree Premium Manaus. Guide Manaus: Peter Hagnauer +5592994300840
Day 5 - AMAZON JUNGLE LODGE: Checkout Blue Tree. Transfer->Porto de Manaus. Speedboat->Amazon Village Jungle Lodge ~70min (past Meeting of Waters). Welcome drink. Canoe igapo. Piranha fishing. Sunset on river.
Day 6 - AMAZON: Breakfast. Jungle trek flora/fauna. Visit Caboclo family. Canoe Acajatuba Village community. Night boat tour.
Day 7 - MANAUS: Breakfast lodge. Speedboat back. Check-in Blue Tree. Lunch. City tour + Teatro Amazonas.
Day 8 - RIO DE JANEIRO: Checkout. LA3469 MAO 11:25->GRU 16:25. LA3874 GRU 17:45->GIG 18:45. Check-in Hilton Rio Copacabana. Guide Rio: Henrik Karsten +5521964660288
Day 9 - RIO: City tour: Sugarloaf Mountain, Sambodrome. Free afternoon. Optional: Walking tour downtown+caipirinha Santa Teresa. Dinner tip: Churrascaria Palace (walking distance).
Day 10 - RIO: Optional Corcovado/Christ Redeemer (38m, 7 Wonders) EUR 125. Cog railway Tijuca Forest. Optional Samba Show EUR 120.
Day 11 - SALVADOR: Checkout Hilton. LA3672 GIG 08:50->SSA 10:50. Check-in Novotel Salvador Rio Vermelho. Guide Salvador: Markus Priller +5571999962088
Day 12 - SALVADOR: Half-day historical city tour, Pelourinho. Optional Bahia by Night Show incl. dinner EUR 130.
Day 13 - SALVADOR: Free day. Optional Cachoeira incl. lunch EUR 165. Farewell dinner with guide.
Day 14 - OVERNIGHT RETURN: Checkout. LA3355 SSA 17:55->GRU 20:30. LA8070 GRU 23:45->FRA 16:25 (next day).
Day 15 - ARRIVAL FRANKFURT.

HOTELS:
1. Recanto Cataratas Thermas Resort & Convention - Foz do Iguacu (Days 2-4), 2 nights, breakfast
2. Blue Tree Premium Manaus - Manaus (Day 4 + Days 7-8), breakfast
3. Amazon Village Jungle Lodge - Amazon (Days 5-7), 2 nights, full board + all activities. Mosquito nets, fan, hot shower, hammock veranda, pool, bar, restaurant, 24h reception, ~30km from Manaus
4. Hilton Rio de Janeiro Copacabana - Rio (Days 8-11), 3 nights, breakfast
5. Novotel Salvador Rio Vermelho - Salvador (Days 11-14), 3 nights. Restaurant, bar, gym, tennis, sauna. Near: Porto da Barra beach, fish market.

INCLUDED: All accommodation, breakfast all hotels, full board+activities at Jungle Lodge, all excursions+transfers, German-speaking local guides, caipirinha welcome drink Foz, Hubby eSIM 1GB, lunches 2 days Manaus

NOT INCLUDED: Drinks, personal expenses, flights+airport taxes, visa, optional excursions.

OPTIONAL EXCURSIONS: Corcovado EUR 125 | Samba Show EUR 120 | Bahia by Night incl. dinner EUR 130 | Cachoeira incl. lunch EUR 165

GUIDES: Foz: Jandir Both +5545991040951 | Manaus city: Peter Hagnauer +5592994300840 | Lodge: Rosalina Fernandes +5592993363882 | Rio: Henrik Karsten +5521964660288 | Salvador: Markus Priller +5571999962088

AMAZON TIPS: Pack: light rain jacket, sturdy shoes, sunglasses, binoculars, flashlight, insect repellent, sunscreen, swimwear, personal medicine. Speedboat ~70min no AC. Dry season (Sep-Dec): possible hotter weather. Wet season (Jan-Aug): higher water = better wildlife viewing. Bring cash (Brazilian Real). Tips appreciated. Guide contact: Always available 24h.`

const ERROR_MSGS = {
  de: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie OPCO Tours: carlos@opcotours.com',
  pt: 'Ocorreu um erro. Tente novamente ou contate a OPCO Tours: carlos@opcotours.com',
  en: 'An error occurred. Please try again or contact OPCO Tours: carlos@opcotours.com',
}

function BubbleText({ text }) {
  return (
    <div
      className="bubble"
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>'),
      }}
    />
  )
}

function TypingDots() {
  return (
    <div className="bubble">
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLangState] = useState('de')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const historyRef = useRef([])
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'bot', text: LANGS['de'].welcome }])
    }, 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  function switchLang(l) {
    setLangState(l)
    historyRef.current = []
    setMessages([{ role: 'bot', text: LANGS[l].welcome }])
  }

  async function sendMessage(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    const newHistory = [...historyRef.current, { role: 'user', content: msg }]
    historyRef.current = newHistory

    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      { role: 'bot', typing: true },
    ])

    const sys =
      LANGS[lang].sysLang +
      '\n\nYou are the official travel assistant for "Die Vielfalt Brasiliense" by OPCO Tours. Answer questions accurately based on the trip information below. If something is not in the trip info, say you don\'t have that information but provide the guide or operator contact. Be concise.\n\n' +
      TRIP

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, system: sys }),
      })
      const data = await r.json()
      const reply = data?.content?.[0]?.text
      if (!reply) throw new Error('empty')

      historyRef.current = [...newHistory, { role: 'assistant', content: reply }]
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: reply },
      ])
    } catch {
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: ERROR_MSGS[lang] },
      ])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e) {
    const el = e.target
    setInput(el.value)
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 80) + 'px'
  }

  return (
    <>
      <div className="header">
        <span className="header-flag">🇧🇷</span>
        <h1>Reiseassistent &mdash; <em>Die Vielfalt Brasiliense</em></h1>
        <p>Organisiert von OPCO Tours &middot; 15 Tage &middot; Frankfurt &rarr; Brasilien &rarr; Frankfurt</p>
        <div className="destinos-pills">
          <span className="pill">✈ Frankfurt</span>
          <span className="pill">💧 Foz do Iguaçu</span>
          <span className="pill">🌿 Amazonas</span>
          <span className="pill">🏖 Rio de Janeiro</span>
          <span className="pill">🎭 Salvador</span>
        </div>
        <div className="lang-bar">
          {['de', 'pt', 'en'].map(l => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => switchLang(l)}
            >
              {l === 'de' ? '🇩🇪 Deutsch' : l === 'pt' ? '🇧🇷 Português' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-wrapper">
        <div className="chat-box">
          <div className="messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className={`avatar ${m.role}`}>
                  {m.role === 'bot' ? '🌿' : '👤'}
                </div>
                {m.typing ? <TypingDots /> : <BubbleText text={m.text} />}
              </div>
            ))}
          </div>

          <div className="suggestions">
            {LANGS[lang].suggestions.map(s => (
              <button
                key={s}
                className="sugg-btn"
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="input-area">
          <textarea
            ref={inputRef}
            id="userInput"
            rows={1}
            value={input}
            placeholder={LANGS[lang].placeholder}
            onKeyDown={handleKey}
            onInput={handleInput}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            id="sendBtn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="footer-note">Powered by OPCO Tours &middot; claude.ai</p>
      </div>
    </>
  )
}
