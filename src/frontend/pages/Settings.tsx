import axios from "axios";
import React, { useEffect, useState } from "react"
import "../styles/Settings.css"
import { useAuthGuard } from "../hooks/useAuthGuard";
import { usePurchaseHistory } from "../hooks/usePurchaseHistory";

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

    const [balance, setBalance] = useState<number | null> (null);

    const [activeTab, setActiveTab] = useState<'profilePicture' | 'usernameChange' | 'passwordChange' | 'addBalance' | 'purchaseHistory'>('profilePicture');

    const {cartHistory, loading: cartLoading} = usePurchaseHistory(activeTab)

    useEffect(() => {
      const fetchBalance = async () => {
        try {
          const res = await axios.get('http://localhost:4000/api/auth/profile', {
            withCredentials: true,
          });
          setBalance(res.data.balance);
        } catch (err) {
          console.error("Failed to fetch balance");
        }
      };

      if (activeTab === 'addBalance') {
        fetchBalance();
      }
    }, [activeTab]);

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

    const addBalanceChange = async(e: React.FormEvent) =>{
      e.preventDefault();

      try{
        const res = await axios.post('http://localhost:4000/api/user/addBalance', {}, {withCredentials: true});
        setBalance(res.data.balance || "balance updated");
        setMessage(res.data.message)
      }catch(err: any){
        setMessage(err.response?.data?.message || "Failed to add balance")
      }
    }

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
        <button 
          className={`settings-sidebar-button ${activeTab === 'addBalance' ? 'settings-sidebar-button-active' : ''}`}
          onClick={() => setActiveTab('addBalance')}
        >
          Add Balance  
        </button>
         <button 
          className={`settings-sidebar-button ${activeTab === 'purchaseHistory' ? 'settings-sidebar-button-active' : ''}`}
          onClick={() => setActiveTab('purchaseHistory')}
        >
          Purchase History   
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
        {activeTab === 'addBalance' && (
          <form onSubmit={addBalanceChange} className="settings-form">
            <h2><strong>Current balance: {balance}.00 $</strong></h2>
            <button type="submit" className="settings-button">
              Add 10$ to Balance
            </button>
          </form>
        )}
        {activeTab === 'purchaseHistory' && (
          <div className="purchase-history-container">
            <h2 className="purchase-history-title">
              Your Purchase History
            </h2>
            {cartLoading ? (
              <p className="purchase-history-loading">
                Loading...
              </p>
            ) : cartHistory.length === 0 ? (
              <p className="purchase-history-empty">
                No purchases found.
              </p>
            ) : (
              cartHistory.map((cart, index) => (
                <div key={index} className="purchase-entry">
                  <div className="purchase-header" onClick={(e) => {
                    const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                  }}>
                    <h3 className="purchase-id">
                      Purchase #{cart.purchase_id}
                    </h3>
                    <p className="purchase-total">
                      Total: ${cart.books_isbn13.length * 5}
                    </p>
                  </div>
                  <div className="purchase-dropdown">
                    <p className="purchase-books">
                      <strong>Books ISBN-13:</strong> {cart.books_isbn13.join(', ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    )
}