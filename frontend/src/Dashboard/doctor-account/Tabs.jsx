import React, { useContext } from "react";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Tabs = ({ tab, setTab }) => {


    const handleLogout = () =>  {
        dispatch({ type: 'LOGOUT' })
        navigate('/')
    }
    const {dispatch} = useContext(authContext)
    const navigate = useNavigate()


    return (
        <div>
            <span className="lg:hidden">
                <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
            <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md ">
                <button
                    onClick={() => setTab('overview')}
                    className={` ${tab === "overview"
                        ? "bg-indigo-100 text-primaryColor"
                        : "bg-transparent text-headingColor"
                        } w-full btn mt-0 rounded-md `}
                >
                    Overview
                </button>
                <button
                    onClick={() => setTab('appointment')}
                    className={` ${tab === "appointment"
                        ? "bg-indigo-100 text-primaryColor"
                        : "bg-transparent text-headingColor"
                        } w-full btn mt-0 rounded-md `}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setTab('settings')}
                    className={` ${tab === "settings"
                        ? "bg-indigo-100 text-primaryColor"
                        : "bg-transparent text-headingColor"
                        } w-full btn mt-0 rounded-md `}
                >
                    Profile
                </button>
                <div className='mt-[50px] md:mt-[100px] w-full'>
                    <button onClick={handleLogout} className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#3e3f42] p-3 text-[15px] leading-7 rounded-md text-white'>Log Out</button>
                    <button className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#e6592a] p-3 text-[15px] leading-7 rounded-md text-white mt-5 '>Delete Account</button>
                </div>

            </div>
        </div >
    );
};

export default Tabs;