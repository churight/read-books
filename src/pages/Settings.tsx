import axios from "axios";
import React, { useState } from "react"

export const Settings = () =>{
    const [nickname, setNickname] = useState('');
    const [nicknameMessage, setNicknameMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [profileUrl, setProfileUrl] = useState('');
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');


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

    const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await axios.patch(
        'http://localhost:4000/api/user/profile-picture',
        { profilePicture: profileUrl },
        { withCredentials: true }
        );

        setMessage(res.data.message);
        setPreviewUrl(res.data.profilePicture);
    } catch (err: any) {
        setMessage(err.response?.data?.message || 'Failed to save profile picture URL');
    }
    };

    return (
        <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Settings</h2>
        <form onSubmit={handleSaveUrl}>
            <h3>Set Profile Picture URL</h3>
            <input
                type="url"
                placeholder="Paste image URL"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                required
            />
            <button type="submit">Save</button>

            {previewUrl && (
                <div style={{ marginTop: "1rem" }}>
                <img src={previewUrl} alt="preview" width="150" />
                </div>
            )}

            {message && <p>{message}</p>}
        </form>
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