import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom'

const ViewPaste = () => {
    const [title, setTitle] = useState('');
const [value, setValue] = useState("");

  const {id}=useParams();

  const allPaste =useSelector((state)=>state.paste.pastes);

  const paste = allPaste.filter((p)=>p._id === id )[0];

  console.log( paste[0]); 
  return (
    <div>
    <div className='flex flex-row gap-7 place-content-between' >
      <input
        className='p-2 rounded-2xl mt-2 bg-blue-200 w-[66%] pl-4'
        type="text"
        placeholder='enter title here'
        value={paste.title}
        disabled
        onChange={(e) => setTitle(e.target.value)} />

      {/* <button
        onClick={createPaste}
        className='p-2 rounded-2xl mt-2 bg-blue-200'>
        {pasteId ? "Updated My Paste" : "Create My Paste"}
      </button> */}
    </div>
    <div>
      <textarea
        className='mt-8 rounded-2xl mt-4, min-w-[500px] p-4 bg-blue-300'
        value={paste.content}
        placeholder='enter content here'
        disabled
        onChange={(e) => setValue(e.target.value)}
        rows={20}
      />
    </div>
  </div>
  )
}

export default ViewPaste
