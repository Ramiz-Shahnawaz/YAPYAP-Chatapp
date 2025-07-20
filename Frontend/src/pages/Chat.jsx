import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import Sidebar from '../components/Sidebar'
import Promptbox from '../components/Promptbox'
import { db, auth } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Message from '../components/Message';
import { Airesponse } from '../services/AI';
import '../index.css'

const Chat = () => {

  const [expand, setexpand] = useState(false)
  const [messages, setmessages] = useState([])
  const [isloading, setisloading] = useState(false)
  const [currentchatid, setcurrentchatid] = useState(null)

  useEffect(() => {

    let unsubscribe;
    if (currentchatid) {
      const q = query(
        collection(db, 'messages'), where('chatId', '==', currentchatid), orderBy('createdAt', 'asc')
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            role: data.uid === auth.currentUser?.uid ? 'user' : 'assistant',
            content: data.text,
            imageUrl: data.imageUrl,
            ...data
          };
        });
        setmessages(msgs);
      });
    } else {
      setmessages([]);
    }
    return () => unsubscribe && unsubscribe(); 
  }, [currentchatid]);

  const handleSend = async (prompt, imageFile = null) => {
    if (!prompt.trim() && !imageFile) return;

    setisloading(true);
    let imageUrl = null;
    let chatidtouse = currentchatid;

    try {

      if (imageFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${auth.currentUser.uid}/${imageFile.name}_${Date.now()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (!chatidtouse) {
        const newchatref = await addDoc(collection(db, 'chats'), {
          userId: auth.currentUser.uid,
          title: prompt.substring(0, 30) + (prompt.length > 10 ? '...' : ''),
          createdAt: serverTimestamp(),
          lastUpdatedAt: serverTimestamp(),
        });
        chatidtouse = newchatref.id;
        setcurrentchatid(newchatref.id); 
      } else {
        const chatRef = doc(db, 'chats', chatidtouse);
        await updateDoc(chatRef, {
          lastUpdatedAt: serverTimestamp(),
        });
      }

      await addDoc(collection(db, 'messages'), {
        chatId: chatidtouse,
        text: prompt,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        uid: auth.currentUser.uid,
        user: {
          name: auth.currentUser.displayName || 'User',
          avatar: auth.currentUser.photoURL || assets.profile_icon
        }
      });

      const airesponse = await Airesponse(prompt, imageFile);
      await addDoc(collection(db, 'messages'), {
        chatId: chatidtouse,
        text: airesponse,
        createdAt: serverTimestamp(),
        uid: 'assistant',
        user: {
          name: 'Assistant',
          avatar: assets.profile_icon
        }
      })

      const chatRef = doc(db, 'chats', chatidtouse);
      await updateDoc(chatRef, {
        lastUpdatedAt: serverTimestamp(),
      });

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setisloading(false);
    }
  };

  const handlenewchat = ()=>{
    setcurrentchatid(null)
    setmessages([])
    setisloading(false)
  }

  const handleselectchat = (chatid)=>{
    setcurrentchatid(chatid)
  }

  const regenerateMessage = (index) => {
    const messageToRegenerate = messages[index - 1]; 
    Airesponse(messageToRegenerate.content).then(newContent => {
      setmessages([
        ...messages,
        { role: 'assistant', content: newContent }
      ]);
    });
  };

  return (
    <div className='bg-[#F8FAFF]'>
      <div className='flex h-screen'>
        <Sidebar expand={expand} setexpand={setexpand} onnewchat={handlenewchat} onselectchat={handleselectchat} currentchatid={currentchatid}/>
        <div className='flex-1 flex flex-col pb-8 relative'>
          <div className='md:hidden absolute px-2 top-4 flex items-center justify-between w-full' onClick={handlenewchat}>
            <img onClick={() => (expand ? setexpand(false) : setexpand(true))} className='rotate-180' src={assets.menu_icon} alt="" />
            <img src={assets.new_chat_icon} alt="" />
          </div>

          <div className='absolute top-4 right-4 hidden md:block'>
            <img src={auth.currentUser?.photoURL || assets.profile_icon} alt="" className='w-10 h-10 rounded-full border border-gray-300 object-cover' />
          </div>

          {messages.length === 0 && !currentchatid ? (
            <div className='flex flex-1 flex-col items-center justify-center w-full'>
              <div className='flex items-center gap-2 mb-[-25px]'>
                <img src="logo.png" alt="" className='h-[100px]' />
                <p className='text-2xl font-medium'>Welcome to YAPYAP</p>
              </div>
              <p className='text-base mt-2 mb-4'>What can I help you with ?</p>
              <div className='w-full max-w-2xl'>
                <Promptbox isloading={isloading} setisloading={setisloading} onSend={handleSend} compactMode={false}/>
              </div>
            </div>
          ) : (
            <>
              <div className='flex-1 flex flex-col items-center mt-3 overflow-y-auto w-full'>
                {messages.map((msg, idx) => (
                  <Message key={idx} role={msg.role} content={msg.content} imageUrl={msg.imageUrl} onRegenerate={msg.role === 'assistant' ? () => regenerateMessage(idx) : undefined}/>
                ))}
                {isloading && (
                  <div className='flex gap-4 max-w-3xl w-full py-3'>
                    <img src="logo.png" alt="" className='h-9 w-9 p-1 rounded-full'/>
                    <div className='loader flex items-center justify-center gap-1'>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite',}}></div>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite 0.2s',}}></div>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite 0.4s',}}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className='w-full max-w-3xl mx-auto sticky bottom-0 z-10 bg-[#F8FAFF] pb-1'>
                <Promptbox isloading={isloading} setisloading={setisloading} onSend={handleSend} compactMode={messages.length > 0}/>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat