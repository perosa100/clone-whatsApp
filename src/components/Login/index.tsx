import React from 'react'

import './styles.css'
import Api from '../../Api'

interface LoginProps {
  onReceive?: any
}
const Login: React.FC<LoginProps> = ({ onReceive }: LoginProps) => {
  const handleFacebookLogin = async () => {
    let result = await Api.fbPopup()
    if (result) {
      onReceive(result.user)
    } else {
      alert('erro')
    }
  }
  return (
    <div className="login">
      <button onClick={handleFacebookLogin}>logar com facebook</button>
    </div>
  )
}

export default Login
