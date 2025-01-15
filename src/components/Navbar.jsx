import { useState } from "react";

const Navbar = () => {

    const navLinks = [
        {label : 'Home', ref : '#hero'},
        {label : 'Value Adder', ref : '#valueAdder'},
        // {label : 'Stats', ref : '#stats'},
    ]
    const [visible,setVisible] = useState(false);
    
    return(
        <section id='navbar'>
            <div className="wrapper shadow shadow-gray-300">
                <nav className="flex justify-between items-center innerWrapper p-4 font-normal">
                    <div className="cursor-pointer px-2 hover:underline hover:underline-offset-8 transform duration-200">BillEase</div>
                    <div className="hidden min-[450px]:flex min-[550px]:gap-4 gap-2">
                        {navLinks.map((link,ind) => (
                            <li key={'navLink' + ind} className="cursor-pointer list-none px-2 hover:underline hover:underline-offset-8 transform duration-200"><a href={link.ref}>{link.label}</a> </li>
                        ))}
                    </div>
                    <div className="px-2 py-1 bg-gray-500 text-white rounded-md cursor-pointer" onClick={()=>{ setVisible(prev => !prev)}}>|||
                        <div className={`absolute p-4 bg-gradient-to-r shadow-md rounded-ss-3xl rounded-ee-3xl text-gray-50 from-gray-400 to-gray-600/80 right-2 top-14 transform duration-200 ${visible ? 'block' : 'hidden'}`}>
                            New features Soon !
                        </div>
                    </div>
                </nav>
            </div>
            
        </section>
    );
}

export default Navbar;