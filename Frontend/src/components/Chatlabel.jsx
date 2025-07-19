import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Chatlabel = ({ onselectchat, currentchatid, chat, onrenamechat, ondeletechat }) => {
    const [openmenu, setOpenmenu] = useState(false);

    const handlemenutoggle = (e) => {
        e.stopPropagation(); 
        setOpenmenu(!openmenu);
    };

    const handlerenameclick = (e) => {
        e.stopPropagation();
        const newTitle = prompt("Enter new chat title:", chat.title);
        if (newTitle && newTitle.trim() !== chat.title) {
            onrenamechat(chat.id, newTitle.trim());
        }
        setOpenmenu(false); 
    };

    const handledeleteclick = (e) => {
        e.stopPropagation(); 
        if (window.confirm(`Are you sure you want to delete "${chat.title}"?`)) {
            ondeletechat(chat.id);
        }
        setOpenmenu(false);
    };

    return (
        <div className={`flex items-center justify-between p-2 hover:bg-white rounded-lg text-sm group cursor-pointer ${currentchatid === chat.id ? 'bg-[#A5D8FF]' : ''}`} onClick={() => onselectchat(chat.id)}> 

            <div className='flex-1 truncate'>
                {chat.title}
            </div>

            <div onClick={handlemenutoggle} className='flex relative justify-center items-center h-6 w-6 aspect-square hover:bg-[#7cbdff] rounded-lg'>
                <img src={assets.three_dots} alt="Menu" className={`w-4 ${openmenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                {openmenu && (
                    <div className='absolute right-0 top-full bg-white rounded-lg w-32 shadow-lg z-10 border border-gray-200'>
                        <div className='flex items-center gap-2 hover:bg-[#E6F0FF] px-3 py-2 rounded-t-lg cursor-pointer' onClick={handlerenameclick}>
                            <img src={assets.edit_icon} alt="Rename" className='w-4' />
                            <span>Rename</span>
                        </div>

                        <div className='flex items-center gap-2 hover:bg-[#E6F0FF] px-3 py-2 rounded-b-lg cursor-pointer' onClick={handledeleteclick}>
                            <img src={assets.delete_icon} alt="Delete" className='w-4' />
                            <span>Delete</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chatlabel