import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import './styles.css'
import { UserProps } from '../MessageItem'
import { ChatListProps, LoginFacebookProps } from '../../App'
import Api from '../../Api'

interface NewChatProps {
  chatList: ChatListProps[]
  user: UserProps
  show: boolean
  setShow: any
}
const NewChat: React.FC<NewChatProps> = ({
  chatList,
  user,
  show,
  setShow
}: NewChatProps) => {
  const [list, setList] = useState<UserProps[]>([])

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        let results = await Api.getContactList(user.id)
        setList(results)
      }
    }
    getList()
  }, [user])
  const handleClose = () => {
    setShow(false)
  }
  const handleNewChat = async (user2: LoginFacebookProps) => {
    await Api.addNewChat(user, user2)

    handleClose()
  }
  return (
    <div
      onClick={handleClose}
      className="newChat"
      style={{ left: show ? 0 : -415 }}
    >
      <div className="newChat-head">
        <div className="newChat-backbutton">
          <ArrowBackIcon style={{ color: '#fff' }} />
        </div>
        <div className="newChat-headtitle">Nova Conversa</div>
      </div>
      <div className="newChat-list">
        {list.map((item, key) => (
          <div
            onClick={() => handleNewChat(item)}
            className="newChat-item"
            key={key}
          >
            <img
              className="newChat-itemavatar"
              src={item.avatar}
              alt={item.name}
            />
            <div className="newChat-itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewChat
