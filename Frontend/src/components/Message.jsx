import React from 'react';
import { assets } from '../assets/assets';
import Reactmarkdown from 'react-markdown';

const Message = ({ role, content, imageurl, onregenerate }) => {

  const copymessage = () => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className='flex flex-col items-center w-full max-w-3xl text-base'>
      <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
        <div className={` max-w-2xl rounded-xl relative group flex flex-col py-3  ${role === 'user' ? 'bg-[#E6F0FF] px-5' : 'gap-3'}`}>
          <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-16 top-2.5' : 'left-2 -bottom-3'} transition-all`}>
            <div className='flex gap-2 items-center'>
              {role == 'user' ? (<>
                <img onClick={copymessage} src={assets.copy_icon} alt="" className='w-5 cursor-pointer' />
                <img src={assets.edit_icon} alt="" className='w-5 cursor-pointer' />
              </>) : (
                <>
                  <img onClick={copymessage} src={assets.copy_icon} alt="" className='w-[17px] cursor-pointer' />
                  <img onClick={onregenerate} src={assets.regenerate_icon} alt="" className='w-[17px] cursor-pointer' />
                </>
              )}
            </div>
          </div>
          {imageurl && (
            <div className="mb-2 md:mr-3 md:mb-0">
              <img src={imageurl} alt="User Upload" className="max-w-xs max-h-48 rounded-lg object-contain border border-gray-300" />
            </div>
          )}
          {
            role === 'user' ? (
              <span>{content}</span>
            ) : (
              <>
                <img src="logo.png" alt="" className='h-9 w-9 rounded-full p-1 bprder border-primary' />
                <div>
                  <Reactmarkdown>
                    {content}
                  </Reactmarkdown>
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Message;