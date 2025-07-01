import axios from "axios";
import React, { useState } from "react"
import "../styles/Settings.css"
import { useAuthGuard } from "../hooks/useAuthGuard";

export const Settings = () =>{

  useAuthGuard();
    const [nickname, setNickname] = useState('');
    const [nicknameMessage, setNicknameMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [profileUrl, setProfileUrl] = useState('');
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const [activeTab, setActiveTab] = useState<'profilePicture' | 'usernameChange' | 'passwordChange'>('profilePicture');


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
        <div className="settings-container">
      <div className="settings-sidebar">
        <button
          className={`settings-sidebar-button ${activeTab === 'profilePicture' ? 'settings-sidebar-button-active' : ''}`}
          onClick={() => setActiveTab('profilePicture')}
        >
          Profile Picture
        </button>
        <button
          className={`settings-sidebar-button ${activeTab === 'usernameChange' ? 'settings-sidebar-button-active' : ''}`}
          onClick={() => setActiveTab('usernameChange')}
        >
          Username Change
        </button>
        <button
          className={`settings-sidebar-button ${activeTab === 'passwordChange' ? 'settings-sidebar-button-active' : ''}`}
          onClick={() => setActiveTab('passwordChange')}
        >
          Password Change
        </button>
      </div>
      <div className="settings-main-content">
        {activeTab === 'profilePicture' && (
          <form onSubmit={handleSaveUrl} className="settings-form">
            <h3 className="settings-subtitle">Set Profile Picture URL</h3>
            <input
              type="url"
              placeholder="Paste image URL"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="settings-input"
              required
            />
            <button type="submit" className="settings-button">Save</button>
            {previewUrl && (
              <div className="settings-preview">
                <img src={previewUrl} alt="preview" className="settings-preview-image" />
              </div>
            )}
            {message && <p className="settings-message">{message}</p>}
          </form>
        )}
        {activeTab === 'usernameChange' && (
          <form onSubmit={handleNicknameChange} className="settings-form">
            <h3 className="settings-subtitle">Change Nickname</h3>
            <input
              type="text"
              placeholder="New nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="settings-input"
            />
            <button type="submit" className="settings-button">Update Nickname</button>
            {nicknameMessage && <p className="settings-message">{nicknameMessage}</p>}
          </form>
        )}
        {activeTab === 'passwordChange' && (
          <form onSubmit={handlePasswordChange} className="settings-form">
            <h3 className="settings-subtitle">Change Password</h3>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="settings-input"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="settings-input"
            />
            <button type="submit" className="settings-button">Update Password</button>
            {passwordMessage && <p className="settings-message">{passwordMessage}</p>}
          </form>
        )}
      </div>
    </div>
    )
}