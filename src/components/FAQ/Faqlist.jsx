import React from 'react'
import { Link } from 'react-router-dom'
import FaqItem from './FaqItem'
import { faqs } from '../../assets/data/faqs'


const Faqlist = () => {
  return (
    <ul className='mt-[38px]'>
        {faqs.map((items, index) => ( 
            <FaqItem key={index} item={items} />))}
    </ul>
  )
}

export default Faqlist