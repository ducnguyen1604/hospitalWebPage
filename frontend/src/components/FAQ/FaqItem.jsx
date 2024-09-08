import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'


const FaqItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleAccordition = () => {
        setIsOpen(!isOpen)
    }


    return (
        <div className='p-3 lg:p-5 rounded-[12px] border border-solid border-[#d9dce1] mb-5 cursor-pointer'>
            <div className='flex items-center justify-between gap-5' onClick={toggleAccordition}>
                <h4 className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor'>
                    {item.question}
                </h4>
                <div className={`w-7 h-7 items-center justify-center`}>
                    {isOpen ? <AiOutlineMinus className='text-[#FF6B01] text-[24px]' /> : <AiOutlinePlus className='text-[#FF6B01] text-[24px]' />}
                </div>
            </div>
            {isOpen && (
                <p className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor mt-3'>
                {item.content}</p>
            )}
        </div>
    )
}

export default FaqItem