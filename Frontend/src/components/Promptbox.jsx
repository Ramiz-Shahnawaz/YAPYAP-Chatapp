import React, { useState, useRef } from 'react';
import { assets } from '../assets/assets'
import '../index.css'

const Promptbox = ({ isloading, onSend, compactMode }) => {

  const [prompt, setprompt] = useState('')
  const [image, setimage] = useState(null)
  const fileinput = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() && !image) return;
    onSend(prompt, image);
    setprompt('');
    setimage(null)
    if (fileinput.current) {
      fileinput.current.value = ''
    }
  };

  const handleimagechange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setimage(file)
    } else {
      setimage(null)
      alert('please select an image')
    }
  }

  const handleremoveimage = () => {
    setimage(null)
    if (fileinput.current) {
      fileinput.current.value = ''
    }
  }

  const handleupload = () => {
    fileinput.current.click()
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${compactMode ? 'max-w-3xl' : 'max-w-2xl'} bg-[#E6F0FF] p-4 rounded-3xl mt-4 transition-all`}>
      {image && (
        <div className='relative mb-2 flex justify-start'>
          <img src={URL.createObjectURL(image)} alt="preview" className="max-h-28 rounded-lg object-contain" />
          <button type="button" onClick={handleremoveimage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs cursor-pointer">
            X
          </button>
        </div>
      )}
      <textarea
        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent placeholder:text-black'
        rows={2}
        placeholder='Ask YapYap' required
        onChange={(e) => setprompt(e.target.value)} value={prompt} />

      <div className='flex items-center justify-between text-sm -mt-3'>
        <input type="file" accept='image/' className='hidden' ref={fileinput} onChange={handleimagechange} />
        <img className='w-5 cursor-pointer' src={assets.upload_icon} alt="" onClick={handleupload} />
        <button
          type="submit"
          disabled={isloading}
          className={`${prompt ? 'bg-[#5D9CEC]' : 'bg-[#9eceff]'} rounded-full p-2 cursor-pointer disabled:opacity-50`}>
          <img className='w-4 aspect-square' src={assets.arrow_icon} alt="" />
        </button>
      </div>
    </form>
  )
}

export default Promptbox