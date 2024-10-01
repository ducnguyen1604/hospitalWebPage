import React from 'react'
import userImg from '../../assets/images/doctor-img01.png'
import { useContext, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import Tabs from './Tabs';


const Dashboard = () => {

  //API co the bi sai
  const { data, loading, error } = useGetProfile(`${BASE_URL}/doctors/profile/me`)
  const [tab, setTab] = useState('overview')

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">

        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <Tabs tab={tab} setTab={setTab} />
            <div className='lg:col-span-2'>
              {/* Change !== to === when the data can be fetched. Change to !== for testing only */}
              {data.isApproved !== 'pending' && (
                <div className='flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg'>
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0 1 1 0 001 1h11a1 1 0 100-2v3a1 1 0 001 1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className='sr-only'>Info</span>
                  <div className='ml-3 text-sm font-medium'>To get approval, please complete your profile. We&apos;ll review manullay and approve within 3 days.</div>
                </div>
              )}

              <div>
                {tab === 'overview'}
              </div>
            </div>
          </div>
        )}

      </div>

    </section>


  )
}

export default Dashboard