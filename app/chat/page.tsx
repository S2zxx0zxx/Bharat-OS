import { Metadata } from 'next'
import { ChatInterface } from '@/components/chat/ChatInterface'

export const metadata: Metadata = {
  title: 'BharatOS Chat — AI Legal, Govt & More',
  description:
    'BharatOS AI chat: Apne sawaal poochein — legal, sarkari yojana, health, finance, kheti, padhai. Hindi/Hinglish mein turant jawab.',
}

export default function ChatPage() {
  return <ChatInterface />
}
