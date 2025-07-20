import React from 'react'
import { assets } from '../assets/assets'
import Chatlabel from './Chatlabel'
import { useState, useEffect } from 'react'
import { db, auth } from '../config/firebase'
import { logout } from '../config/auth'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Sidebar = ({ expand, setexpand, onnewchat, onselectchat, currentchatid }) => {
  const [chat, setchat] = useState([])
  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setchat([])
      return
    }

    const q = query(collection(db, 'chats'), where('userId', '==', user.uid), orderBy('lastUpdatedAt', 'desc'))   
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      });
      setchat(fetchedChats);
    }, (error) => {
      console.error("Error fetching chats:", error);
    });

    return () => {
      unsubscribe();
    }
  }, [user]) 

  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, { title: newTitle });
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const messagesQuery = query(collection(db, 'messages'), where('chatId', '==', chatId));
      const messagesSnapshot = await onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docs.forEach(async (messageDoc) => {
          await deleteDoc(doc(db, 'messages', messageDoc.id));
        });
      });
      messagesSnapshot();

      await deleteDoc(doc(db, 'chats', chatId));

      if (currentchatid === chatId) {
        onnewchat();
      }

    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }
  return (
    <div className={`flex flex-col justify-between bg-[#E6F0FF] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? 'p-3 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
      <div>
        <div className={`flex ${expand ? 'flex-row justify-between mr-4' : 'flex-col items-center gap-6'}`}>
          {expand ? <p className='logo text-4xl font-semibold'>YapYap</p> : <img className='w-10' src="logo.png" alt="" />}

          <div onClick={() => expand ? setexpand(false) : setexpand(true)} className='group relative flex items-center justify-center hover:bg-[#7cbdff] transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
            <img src={assets.menu_icon} alt="" className='md:hidden w-7' />
            <img src={expand ? assets.close_sidebar_icon : assets.open_sidebar_icon} alt="" className='hidden md:block w-7' />

            <div className={`absolute w-max ${expand ? 'left-1/2 -translate-x-1/2 top-8' : '-top-12 left-0'} opacity-0 group-hover:opacity-100 transition bg-secondary text-text text-sm px-3 pt-2 rounded-lg shadow-lg pointer-events-none`}>
              {expand ? 'Close Sidebar ' : 'Open Sidebar'}
              <div className={`w-3 h-3 absoulute rotate-45 ${expand ? 'left-1/2 -top-1.5 -translate-x-1/2' : 'left-4 -bottom-1.5'}`}></div>
            </div>
          </div>
        </div>

        <button onClick={onnewchat} className={`mt-8 flex items-center justify-center cursor-pointer ${expand ? 'bg-[#A5D8FF] hover:bg-[#7cbdff] rounded-2xl gap-2 p-3 w-max' : 'group relative h-9 w-9 mx-auto hover:bg-[#7cbdff] rounded-lg'}`}>
          <img className={expand ? 'w-6' : 'w-7'} src={expand ? assets.new_chat_icon : assets.new_chat_icon} alt="" />
          <div className='absolute w-max -top-9 -right-12 opacity-0 group-hover:opacity-100 transition bg-secondary text-text text-sm px-3 p-1 rounded-lg shadow-lg pointer-events-none'> New Chat</div>
          {/* <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div> */}
          {expand && <p className='text-black text font-medium'>New Chat</p>}
        </button>

        <div className={`mt-8 text-black text-sm ${expand ? 'block' : 'hidden'}`}>
          <p className='my-1'>Chats</p>
          {console.log("Rendering chats, chat array length:", chat.length)}
          {console.log("Chat array:", chat)}
          {chat.length > 0 ? (chat.map(chatitem => (
            <Chatlabel
              key={chatitem.id}
              chat={chatitem}
              onselectchat={onselectchat}
              currentchatid={currentchatid}
              onrenamechat={handleRenameChat}
              ondeletechat={handleDeleteChat}
            />
          ))) : (
            <p className='text-black text-xs px-2'>No recent chats.</p>
          )}
        </div>
      </div>

      <div className={` flex absolute bottom-[60px] gap-2 items-center transition-all duration-300 h-9 px-1 rounded-lg md:hidden`}>
        <img className='w-8 rounded-full object-cover' src={user?.photoURL || assets.profile_icon} alt="" />
        {expand && (<span className='text-sm'>{user?.displayName || 'User'}</span>)}
      </div>

      <div onClick={handlelogout} className={` flex items-center hover:bg-[#7cbdff] transition-all duration-300 h-9 px-3 rounded-lg ${expand ? '' : 'relative group'}`}>
        <div className={` cursor-pointer ${expand ? 'flex gap-2' : 'm-2'}`}>
          <img className={expand ? 'w-6' : 'w-7 justify-center'} src={assets.logout_icon} alt="" />
          {expand && <p>Logout</p>}
        </div>
        <div className='absolute w-max -top-9 -right-5 opacity-0 group-hover:opacity-100 transition bg-secondary text-text text-sm p-2.5 rounded-lg shadow-lg pointer-events-none'>
          {expand ? '' : <p>Logout</p>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
