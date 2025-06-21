import axios from "axios";
import React, { useState } from "react"

export const Settings = () =>{
    const [nickname, setNickname] = useState('');
    const [nicknameMessage, setNicknameMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleNicknameChange = async (e: React.FormEvent) =>{
        e.preventDefault();
        setNicknameMessage('');

        try{
            const res = await axios.patch('http://localhost:4000/api/user/nickname', {nickname}, {withCredentials:true});

            setNicknameMessage(res.data.message);
        } catch (err:any){
            setNicknameMessage(err.response?.data?.message)
        }
    }

        const handlePasswordChange = async (e: React.FormEvent) =>{
        e.preventDefault();
        setPasswordMessage('');

        try{
            const res = await axios.patch('http://localhost:4000/api/user/password', {currentPassword, newPassword}, {withCredentials:true});

            setPasswordMessage(res.data.message);
        } catch (err:any){
            setPasswordMessage(err.response?.data?.message)
        }
    }


    return (
        <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Settings</h2>

      <form onSubmit={handleNicknameChange} style={{ marginBottom: '2rem' }}>
        <h3>Change Nickname</h3>
        <input
          type="text"
          placeholder="New nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button type="submit">Update Nickname</button>
        {nicknameMessage && <p>{nicknameMessage}</p>}
      </form>

      <form onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button type="submit">Update Password</button>
        {passwordMessage && <p>{passwordMessage}</p>}
      </form>
    </div>
    )
}