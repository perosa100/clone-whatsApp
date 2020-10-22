import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'

import MessageItem from '../../components/MessageItem'
import SearchIcon from '@material-ui/icons/Search'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import CloseIcon from '@material-ui/icons/Close'
import SendIcon from '@material-ui/icons/Send'
import MicIcon from '@material-ui/icons/Mic'

import './styles.css'
import Api from '../../Api'

const ChatWindow = ({ user, data }) => {
  const body = useRef()
  let recognition = null

  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition()
  }

  const [emojiOpen, setEmojiOpen] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])

  const handleEmojiClick = (e, emojiObject) => {
    e.preventDefault()
    setText(text + emojiObject.emoji)
  }

  const handleOpenEmoji = () => {
    setEmojiOpen(true)
  }
  const handleCloseEmoji = () => {
    setEmojiOpen(false)
  }
  const handleMicClick = () => {
    console.log(SpeechRecognition)

    if (recognition !== null) {
      recognition.onstart = () => {
        setListening(true)
      }
      recognition.onend = () => {
        setListening(false)
      }

      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript)
      }

      recognition.start()
    }
  }

  const handleOnkeyup = (event) => {
    if (event.keyCode === 13) {
      handleSendClick()
    }
  }

  const handleSendClick = () => {
    function updateContact() {
      if (text !== '') {
        Api.sendMessage(data, user.id, 'text', text, users)
        console.log(data)
        setText('')
        setEmojiOpen(false)
      }
    }
    updateContact()
  }

  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      //funcão para jogar os items para biaxo na conversa
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight
    }
  }, [list])

  useEffect(() => {
    setList([])
    let unsub = Api.onChatContent(data.chatId, setList, setUsers)
    return unsub
  }, [data.chatId])
  return (
    <div className="chatWindow">
      <div className="chatWindow-header">
        <div className="chatWindow-headerinfo">
          <img className="chatWindow-avatar" src={data.image} alt="avatar" />
          <div className="chatWindow-name">{data.title}</div>
        </div>

        <div className="chatWindow-headerbuttons">
          <div className="chatWindows-btn">
            <SearchIcon fontSize="small" style={{ color: '#919191' }} />
          </div>

          <div className="chatWindows-btn">
            <AttachFileIcon fontSize="small" style={{ color: '#919191' }} />
          </div>

          <div className="chatWindows-btn">
            <MoreVertIcon fontSize="small" style={{ color: '#919191' }} />
          </div>
        </div>
      </div>
      <div className="chatWindow-body" ref={body}>
        {list?.map((item, key) => (
          <MessageItem key={key} data={item} user={user} />
        ))}
      </div>

      <div
        className="chatWindow-emojiarea"
        style={{ height: emojiOpen ? '200px' : '0px' }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          disableSearchBar
          disableSkinTonePicker
        />
      </div>

      <div className="chatWindow-footer">
        <div className="chatWindow-pre">
          <div
            className="chatWindows-btn"
            onClick={handleCloseEmoji}
            style={{ width: emojiOpen ? 40 : 0 }}
          >
            <CloseIcon fontSize="small" style={{ color: '#919191' }} />
          </div>

          <div className="chatWindows-btn" onClick={handleOpenEmoji}>
            <InsertEmoticonIcon
              fontSize="small"
              style={{ color: emojiOpen ? '#009688' : '#919191' }}
            />
          </div>
        </div>

        <div className="chatWindow-inputarea">
          <input
            type="text"
            placeholder="Digite uma mensagem"
            className="chatWindow-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleOnkeyup}
          />
        </div>
        <div className="chatWindow-pos">
          {text === '' && (
            <div onClick={handleMicClick} className="chatWindows-btn">
              <MicIcon
                fontSize="small"
                style={{ color: listening ? '#126ece' : '#919191' }}
              />
            </div>
          )}

          {text !== '' && (
            <div onClick={handleSendClick} className="chatWindows-btn">
              <SendIcon fontSize="small" style={{ color: '#919191' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
