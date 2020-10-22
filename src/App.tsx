import React, { useEffect, useState } from 'react'
import './app.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import ChatListItem from './components/ChatListItem'
import ChatIntro from './components/ChatIntro'
import ChatWindow from './components/ChatWindow'
import NewChat from './components/NewChat/index'
import Login from './components/Login'
import Api from './Api'

interface ActiveProps {
  chatId?: string
}

export interface ChatListProps {
  chatId: string
  title: string
  author: string
  body: string
  image: string
  lastMessage: string
  lastMessageDate: {
    seconds: any
  }
}

export interface LoginFacebookProps {
  id: string
  name: string
  avatar: string
}

function App() {
  const [chatList, setChatList] = useState<ChatListProps[]>([])
  const [showNewChat, setShowNewChat] = useState<boolean>(false)
  const [activeChat, setActiveChat] = useState<ActiveProps>({})
  const [user, setUser] = useState<LoginFacebookProps>(null)

  useEffect(() => {
    function list() {
      if (user !== null) {
        let unsub = Api.onChatlist(user.id, setChatList)
        return unsub
      }
    }
    list()
  }, [user])

  const handleNewChat = () => {
    setShowNewChat(true)
  }

  const handleLoginData = async (u: any) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    }
    await Api.addUser(newUser)
    setUser(newUser)
  }
  if (user === null) {
    return <Login onReceive={handleLoginData} />
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatList={chatList}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img className="header-avatar" src={user.avatar} alt="avatar" />

          <div className="header-buttons">
            <div className="header-btn">
              <DonutLargeIcon style={{ color: '#919191' }} />
            </div>
            <div className="header-btn">
              <ChatIcon onClick={handleNewChat} style={{ color: '#919191' }} />
            </div>
            <div className="header-btn">
              <MoreVertIcon style={{ color: '#919191' }} />
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search-input">
            <SearchIcon fontSize="small" style={{ color: '#919191' }} />
            <input
              type="search"
              placeholder="Procurar ou começar uma nova conversa"
            />
          </div>
        </div>

        <div className="chatlist">
          {chatList.map((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === chatList[key].chatId}
              onClick={() => setActiveChat(chatList[key])}
            />
          ))}
        </div>
      </div>

      <div className="contentarea">
        {activeChat.chatId !== undefined && (
          <ChatWindow user={user} data={activeChat} />
        )}

        {activeChat.chatId === undefined && <ChatIntro />}
      </div>
    </div>
  )
}

export default App
