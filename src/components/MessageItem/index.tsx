import React, { useEffect, useState } from 'react'

import './styles.css'

type dataProps = {
  body: string
  author: string
  date: {
    seconds: any
  }
}

export type UserProps = {
  id: string
  avatar: string
  name: string
}
interface Props {
  data: dataProps
  user: UserProps
}

const MessageItem: React.FC<Props> = ({ data, user }: Props) => {
  const [time, setTime] = useState('')

  useEffect(() => {
    if (Number(data.date) > 0) {
      let d = new Date(data.date.seconds * 1000)
      let hours = d.getHours()
      let minutes = d.getMinutes()

      setTime(
        `${hours < 10 ? String(hours).padStart(2, '0') : hours}:${
          minutes < 10 ? String(minutes).padStart(2, '0') : minutes
        }`
      )
    }
  }, [data.date])
  return (
    <div
      className="messageLine"
      style={{
        justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'
      }}
    >
      <div
        className="messageItem"
        style={{
          backgroundColor: user.id === data.author ? '#dcf8c6' : '#fff'
        }}
      >
        <div className="messageText">{data.body}</div>
        <div className="messageDate">{time}</div>
      </div>
    </div>
  )
}

export default MessageItem
