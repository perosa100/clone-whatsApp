import React, { useEffect, useState } from 'react'

import './styles.css'
import { ChatListProps } from '../../App'

interface ChatProps {
  onClick: () => void
  active: boolean
  data: ChatListProps
}

const ChatListItem: React.FC<ChatProps> = ({
  onClick,
  active,
  data
}: ChatProps) => {
  const [time, setTime] = useState('')
  useEffect(() => {
    if (Number(data.lastMessageDate) > 0) {
      let d = new Date(data.lastMessageDate.seconds * 1000)
      let hours = d.getHours()
      let minutes = d.getMinutes()

      setTime(
        `${hours < 10 ? String(hours).padStart(2, '0') : hours}:${
          minutes < 10 ? String(minutes).padStart(2, '0') : minutes
        }`
      )
    }
  }, [data.lastMessageDate])
  return (
    <div className={`chatListItem ${active ? 'active' : ''}`} onClick={onClick}>
      <img className="chatListItem-avatar" src={data.image} alt="avatar" />
      <div className="chatListItem-lines">
        <div className="chatListItem-line">
          <div className="chatListItem-name">{data.title}</div>
          <div className="chatListItem-date">{time}</div>
        </div>

        <div className="chatListItem-line">
          <div className="charListItem-lastMsg">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatListItem
