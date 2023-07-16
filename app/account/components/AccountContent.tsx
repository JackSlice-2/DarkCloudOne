"use client"

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdCodeWorking, IoMdContact } from "react-icons/io";

const AccountContent = () => {

     return (
        <div>
            <div className="py-5 px-5 text-3xl font-semibold"> 
                Welcome to my App!
            </div>
            <p className="py-7 px-7 text-neutral-500">
                There are currently no user settings  :( 
            </p>
            <p className="py-9 px-7">
                Hey everyone, Welcome and enjoy. 
                It is free to use for now, i will update it periodicly, 
                When i perfect it there will be premium fetures, 
                but we will always have a free tier !
            </p>
            <p className="py-2 px-7">
                The Icon below is a link to my GitHub: 
                    <a href="https://github.com/JackSlice-2"> <IoMdCodeWorking className="" size={35}/></a>
            </p>
            <p className="py-2 px-7">
            The Icon below is a link to my LinkedIn: 
                    <a href="https://www.linkedin.com/in/paulo-nunes-8a26a2248/"><IoMdContact size={35}/></a>
            </p>
        </div>
        
    )
}
export default AccountContent;