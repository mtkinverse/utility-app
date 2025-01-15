import { useEffect, useRef, useState } from "react"
import { FaSearch, FaPlusCircle, FaCalendarTimes, FaPager, FaTrash } from 'react-icons/fa'
import { UseRecordContext } from "../contexts/RecordContext"

const ValueAdder = ({displayButton, targetRef}) => {
    const monthNames = [
        'January','Febuary','March','April','May','June','July','August','September','October','November','December'
    ]

    const RecordContext = UseRecordContext();
    const[data,setData] = useState([]);
    const[filteredData,filterData] = useState([]);
    const[searchedText,setSearchedText] = useState("");
    const [fromDate,setFromDate] = useState(null);
    const [toDate,setToDate] = useState(null);
    
    const [renderRec, setRec] = useState([])
    const [filteredRenderRec, setFilteredRenderRec] = useState([])
    const [newMonth,setNewMonth] = useState({id:-1, month:'January',year:0,slips:[]});
    const [month, setMonth] = useState({})
    const newMonthRef = useRef(null);

    const initItem = { id: null, slipId: null, name: '', value: 0 }
    const [modal, setModal] = useState(initItem)
    const modalRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const data = await RecordContext.getAllData();
            setData(data);
            filterData(data);
        }
        fetchData();
    }, [])

    useEffect(()=>{
        filterData(data.filter(ele => (ele.month + ele.year).toLowerCase().includes(searchedText.toLowerCase())));
    },[searchedText,data])

    const addThisItem = async (e) => {
        e.preventDefault();        
        if (modal.id !== undefined) {

            const tempEle = renderRec
                .filter((ele) => ele.id === modal.slipId)
                .map((ele) => ({
                    ...ele,
                    items: ele.items.map((item) => ({ ...item }))
                }));

            const tempItem = tempEle[0].items.filter((item) => item.id === modal.id);

            const upcomingTotal = tempEle[0].total - tempItem[0].value + parseInt(modal.value);

            tempItem[0].name = modal.name;
            tempItem[0].value = parseInt(modal.value);

            tempEle[0].items = tempEle[0].items.map((item) =>
                item.id === modal.id ? tempItem[0] : item
            );

            tempEle[0].total = upcomingTotal;

            const updatedSlips = renderRec.map((slip) =>
                slip.id === modal.slipId ? tempEle[0] : slip
            );

            let updatedMonth = {...data.filter(ele => ele.id === month.id)[0], slips : updatedSlips}

            const updatedData = data.map(ele => ele.id === month.id ?  updatedMonth: ele);
            
            await RecordContext.updateData(month.id, updatedMonth)
            
            setData(updatedData)
            setRec(updatedSlips);
            
        } else {

            const length = renderRec.length;
            const id = length > 0 ? renderRec[length - 1].id + 1 : 1;

            let tempSlip = renderRec
                .filter((ele) => ele.id === modal.slipId)
                .map((ele) => ({
                    ...ele,
                    items: ele.items.map((item) => ({ ...item }))
                }));
            const { slipId, ...updatedItem } = modal;
            const itemLength = tempSlip[0].items.length;
            const newId = itemLength > 0 ? tempSlip[0].items[itemLength - 1].id + 1 : 0;
            tempSlip[0].items = tempSlip[0].items.concat({ ...updatedItem, id: newId });
            tempSlip[0].total += parseInt(modal.value)

            const updatedSlips = renderRec.map(rec => (rec.id === slipId ? tempSlip[0] : rec));
            const updatedMonth = {...data.filter(ele => ele.id === month.id)[0], slips : updatedSlips}
            const updatedData = data.map(ele => ele.id === month.id ? updatedMonth : ele);

            await RecordContext.updateData(month.id, updatedMonth)
            
            setData(updatedData);
            setRec(updatedSlips);
        }
        
        setModal(initItem);
        modalRef.current.style.display = "none";

    };
    
    const deleteItem = async (slipId, itemId, value) => {
        let tempSlip = renderRec
        .filter(ele => ele.id === slipId)
        .map(ele => (
            {
                ...ele,
                items: ele.items.filter(item => item.id !== itemId).map(item => ({ ...item }))
            }
        ))
        tempSlip[0].total -= value;
        const updatedSlips = renderRec.map(slip => (slip.id === slipId ? tempSlip[0] : slip));
        const updatedMonth = {...data.filter(ele => ele.id === month.id)[0], slips : updatedSlips}
        const updatedData = data.map(ele => ele.id === month.id ? updatedMonth : ele);

        await RecordContext.updateData(month.id, updatedMonth);
        
        setData(updatedData);
        setRec(updatedSlips);
        
    }
    
    const deleteRecord = async (slipId) => {
        const tempSlips = renderRec.filter(slip => slip.id != slipId).map(slip => ({ ...slip }));
        const updatedMonth = {...data.filter(ele => ele.id === month.id)[0], slips : tempSlips}
        const updatedData = data.map(ele => ele.id === month.id ? updatedMonth : ele);
        
        await RecordContext.updateData(month.id,updatedMonth);
        
        setData(updatedData);
        setRec(tempSlips);
    }
    
    const addRecord = async () => {
        const genrateId = renderRec.length > 0 ? renderRec.at(-1).id + 1 : 0;
        const updatedSlips = renderRec.concat({id:genrateId, name : 'Slip' + (genrateId + 1), items : [], total : 0,date:new Date()});
        const updatedMonth = {...data.filter(ele => ele.id === month.id)[0],slips: updatedSlips}
        const updatedData = data.map(ele => ele.id === month.id ? updatedMonth : ele);
        
        await RecordContext.updateData(month.id,updatedMonth);
        
        setData(updatedData);
        setRec(updatedSlips);
    }
    
    const removeMonth = async (monthId) => {
        const filterData = data.filter(ele => ele.id != monthId);
        await RecordContext.deleteData(monthId);
        setData(filterData);
        setRec([]);
        setMonth({})
    }
    
    const updateTheSlip = async (slipId,name) => {
        const updatedSlips = renderRec.map(receipt => (receipt.id === slipId ? {...receipt, name:name} : receipt));
        const updatedMonth = {...data.filter(ele => ele.id === month.id)[0], slips : updatedSlips}
        const updatedData = data.map(ele => ele.id === month.id ? updatedMonth : ele);
        
        await RecordContext.updateData(month.id, updatedMonth);
        
        setData(updatedData);
        setRec(updatedSlips)
    }

    const handleStateChange = e => {
        setModal({ ...modal, [e.target.name]: e.target.name === 'year' ? parseInt(e.target.value) : e.target.value });
    }

    const addMonth = () => {
        newMonthRef.current.style.display = 'flex';
    }

    const addNewMonth = async (e) => {
        e.preventDefault();
        
        
        
        const id = await RecordContext.addData(newMonth);
        const newData = {...newMonth,id:id};
        const updatedData = [...data, newData];

        setData(updatedData);
        newMonthRef.current.style.display = 'none';
        
    }

    const changeNewMonth = (e) => {
        setNewMonth(prev => ({...prev,[e.target.name]:e.target.value}))
    }

    const filterSlips = () => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit'
          };

        const filtered = renderRec.filter((item) => {

          const createdOnDate = new Date(item.date).toLocaleDateString('en-CA', options).replace(/-/g, '/');;
          const from = fromDate ? new Date(fromDate).toLocaleDateString('en-CA', options).replace(/-/g, '/') : null;
          const to = toDate ? new Date(toDate).toLocaleDateString('en-CA', options).replace(/-/g, '/') : null; 

          if (from && to) {
            return createdOnDate >= from && createdOnDate <= to;
          } else if (from) {
            return createdOnDate >= from;
          } else if (to) {
            return createdOnDate <= to;
          }
          return true; // No filters applied
        });
        
        setFilteredRenderRec(filtered);
    };
    
    useEffect(()=>{
        filterSlips();
    },[renderRec,toDate,fromDate])

    return (
        <>
            <section id="valueAdder">
                <div className="py-2" ref={targetRef}>

                    <div className="bg-gradient-to-l from-gray-200 to-gray-100 border border-gray-300 w-full mx-auto p-4 rounded-r-3xl rounded-l-3xl flex justify-between items-center">
                        <div className="flex flex-row max-[600px]:flex-col max-[600px]:w-full max-[600px]:mb-2 items-center justify-center min-w-[70%] space-x-2 p-2 rounded-lg ">
                            <label htmlFor="searchBar" className="text-gray-700 font-medium px-2">
                                Search Records:
                            </label>
                            <div className="flex justify-start max-[600px]:w-full  w-[75%] border-2 border-gray-300 rounded-md overflow-hidden focus-within:border-gray-500 transition-all duration-300">
                                <input
                                    type="search"
                                    id="searchBar"
                                    placeholder={`Search among ${data.length} months (month-year)`}
                                    className="flex-1 py-2 px-4 outline-none text-gray-600"
                                    value={searchedText}
                                    onChange={e => { setSearchedText(e.target.value);}}
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-500 text-white px-4 hover:bg-gray-600 transition-colors duration-300">
                                    <FaSearch className="text-lg" />
                                </button>
                            </div>
                        </div>

                        <div className="px-2 max-[600px]:hidden">
                            <button className="mr-0 p-2 bg-gray-500 text-white hover:bg-gray-600 rounded-md flex items-center gap-2"
                            onClick={addMonth}
                            >New <FaPlusCircle /></button>
                        </div>
                    </div>

                    <div className={`flex flex-wrap gap-4 w-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-md px-2 py-4 my-4 max-h-screen overflow-y-scroll ${(data.length <= 0 || filteredData.length <= 0) && 'justify-center'}`}>
                        {data.length > 0 ?
                            filteredData.length > 0 ?
                            filteredData.map(month => (
                                <button key={month.id} className="bg-gray-100 border-2 hover:border-gray-700 border-gray-500 p-2 rounded-md hover:shadow-md duration-100 m-2 max-[610px]:w-full" onClick={() => { setRec([...month.slips]); setMonth({...month}) }}>
                                    <div className="flex items-center justify-center">
                                        <FaCalendarTimes className="text-gray-700 mx-2" />
                                        <p>{month.month} - {month.year}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <FaPager className="text-gray-700 mx-2" />
                                        <p>{`${month.slips.length} Records`}</p>
                                    </div>
                                </button>
                            ))
                            :
                            <p className="text-center text-gray-700">No items matched your search!</p>
                        :
                        <button 
                            className="bg-gray-500 p-2 text-white hover:bg-gray-50 hover:text-gray-700 hover:outline outline-gray-700 active:bg-gray-200 transform duration-200"
                            onClick={addMonth}
                        >
                            Track your first month</button>
                    }
                    </div>
                </div>
            </section>
            {month.id ?
                <section id="recordDashboard">
                    <span className="relative top-3 left-4 bg-gray-600 text-gray-50 p-2 rounded-t-lg shadow-lg">{month.month}</span>
                    <div className="bg-gray-300 border-4 border-gray-600 mt-2 mb-4 py-4 mx-2 max-h-screen overflow-y-scroll">
                        <div className="flex flex-wrap justify-between gap-2 max-[580px]:flex-col max-[580px]:items-center  mr-2 mb-2 sm:px-6">
                            <div className="flex gap-2 flex-wrap max-[350px]:flex-col max-[350px]:items-center">
                                <div className="">
                                    <label htmlFor="fromDate" className="block text-gray-700 font-medium">From</label>
                                    <input
                                        id="fromDate"
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="block w-full border-gray-700 rounded-md shadow-sm bg-gradient-to-r from-gray-50 to-gray-100 px-2"
                                        />
                                </div>
                                <div className="">
                                <label htmlFor="toDate" className="block text-gray-700 font-medium">
                                  To Date:
                                </label>
                                <input
                                    id="toDate"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="block w-full border-gray-700 rounded-md shadow-sm bg-gradient-to-r from-gray-50 to-gray-100 px-2"
                                />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="max-[400px]:w-9/12"><button className="flex max-[400px]:justify-center justify-around rounded shadow-md shadow-black/70 w-full bg-gray-600 hover:bg-gray-700 active:outline outline-gray-800 mx-2 p-2 text-gray-100"
                                onClick={()=>{removeMonth(month.id)}}
                                >Remove <FaTrash className="ml-2 my-auto text-white"/></button></span>
                                <span className="max-[400px]:w-9/12"><button className="flex max-[400px]:justify-center justify-around rounded shadow-md shadow-black/70 w-full bg-gray-600 hover:bg-gray-700 active:outline outline-gray-800 mx-2 p-2 text-gray-100"
                                onClick={addRecord}
                                >Record <FaPlusCircle className="ml-2 my-auto text-white"/></button></span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-around items-start max-h-[90vh]">


                            {renderRec.length > 0 ?
                                
                                (filteredRenderRec.map(receipt => (
                                    <ol key={'slip'+month.month+month.year+receipt.id} className="transform duration-300 hover:shadow-md shadow-black outline hover:outline-none outline-gray-500 bg-gray-100 mx-2 my-4 p-2 text-center min-w-[25%] h-full max-[400px]:w-full">
                                        <div className="flex justify-between mb-2">
                                            <input
                                                type="text"
                                                id={month.name + "Slip" + receipt.id}
                                                className="bg-gray-600 rounded-sm px-2 py-1 text-white max-w-24"
                                                onBlur={()=>{updateTheSlip(receipt.id,receipt.name)}}
                                                value={receipt.name.length > 5 && document.getElementById(month.name+'Slip'+receipt.id) !== document.activeElement ? receipt.name.slice(0, 5) + '...' : receipt.name}
                                                onChange={e=>{setRec(prev => (prev.map(slip => (slip.id === receipt.id ? {...slip, name:e.target.value} : slip))))}}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button htmlFor={"receipts" + receipt.name} className=" rounded-full p-0 text-gray-500 hover:text-gray-700"
                                                    onClick={() => { setModal({ ...initItem, slipId: receipt.id }); modalRef.current.style.display = 'flex' }}
                                                ><FaPlusCircle className="my-auto" /></button>
                                                <button htmlFor={"receipts" + receipt.name} className=" rounded-full p-0 text-gray-500 hover:text-gray-700"
                                                    onClick={() => { deleteRecord(receipt.id) }}
                                                ><FaTrash className="my-auto" /></button>
                                            </div>
                                        </div>

                                        {receipt.items.map((item, ind) => (
                                            <li
                                                key={item.id}
                                                className={`group flex justify-around hover ${ind > 0 && 'border-t'} ${ind < receipt.items.length - 1 && 'border-b'} hover:border-gray-600 cursor-pointer`}
                                                onClick={() => { setModal({ slipId: receipt.id, ...item }); modalRef.current.style.display = 'flex'; modalRef.current.scrollIntoView(); modalRef.current.focus() }}
                                            >
                                                <div className="w-11/12 flex justify-around">
                                                    <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}</p>
                                                    <p>{item.value}</p>
                                                </div>
                                                <span
                                                    className="relative text-gray-400 lg:text-gray-100 group-hover:text-gray-400 hover:text-gray-700 py-0 cursor-pointer size-0 right-4 top-1 text-base"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent the click from triggering the 
                                                        deleteItem(receipt.id, item.id, item.value);
                                                    }}
                                                >
                                                    ✖
                                                </span>
                                            </li>
                                        ))}
                                        <hr className="size-1 bg-gray-500 w-full my-2" />
                                        <li className="flex justify-between gap-2 flex-wrap">
                                            <div>Total : {receipt.total}</div>
                                            <div>{receipt.date.toLocaleDateString('en-CA',  {year: 'numeric',month: '2-digit',day: '2-digit'}).replace(/-/g, '/')}</div>
                                        </li>
                                    </ol>
                                )))
                                :
                                <p className="text-gray-700 m-2">You have no records for this month</p>
                            }
                        </div>
                    </div>
                    
                    {/* This is new item editor/inserter */}

                    <div className="hidden justify-center items-center fixed top-0 w-screen h-screen filter bg-[rgba(255,255,255,0.8)] z-0" ref={modalRef}>
                        <div id="itemEditor" className="border-2 border-gray-500 shadow-lg hover:shadow-2xl transform duration-100 fixed z-10">
                            <div className="inset-0 bg-gradient-to-t from-gray-100 to-gray-200/80 border">
                                <h1 className="text-2xl text-center mt-4">{modal.id ? 'Update' : 'Enter'} Details Here</h1>
                                <form onSubmit={addThisItem} className="p-4">
                                    <div>
                                        <label htmlFor="itemName" className="p-2">Name</label>
                                        <input type="text" name="name" value={modal.name} onChange={handleStateChange} className="p-2 m-2 border-2 text-gray-700" />
                                    </div>
                                    <div>
                                        <label htmlFor="itemValue" className="p-2" >Value</label>
                                        <input id='valueEditor' type="number" name="value" value={modal.value} onChange={handleStateChange} className="p-2 m-2 border-2 text-gray-700" />
                                    </div>
                                    <div className="flex justify-end gap-2 my-4">
                                        <button type="reset" className="px-2 bg-white text-gray-500 hover:bg-gray-400 hover:text-white duration-200 active:bg-gray-700 border-gray-600 border" onClick={() => { modalRef.current.style.display = 'none' }}>Cancle</button>
                                        <button type="submit" className="px-2 bg-white text-gray-500 hover:bg-gray-400 hover:text-white duration-200 active:bg-gray-700 border-gray-600 border">Done</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </section>
                :
                <p className="text-center text-gray-400">Select any month to view record ....</p>
            }

            {/* The item new month input */}

            <div className="hidden justify-center items-center fixed top-0 w-screen h-screen filter bg-[rgba(255,255,255,0.8)] z-0" ref={newMonthRef}>
                <div id="itemEditor" className="border-2 border-gray-500 shadow-lg hover:shadow-2xl transform duration-100 z-10 mx-auto my-auto">
                    <div className="bg-gradient-to-t from-gray-100 to-gray-200/80 border">
                        <h1 className="text-2xl text-center mt-4">Enter Details Here</h1>
                        <form onSubmit={addNewMonth} className="p-4">
                            <div>
                                <label htmlFor="newMonthName" className="p-2">Name</label>
                                <select id="newMonthName" type="text" name="month" value={newMonth.month} onChange={changeNewMonth} className="p-2 m-2 border-2 text-gray-700">
                                    {monthNames.map(ele => (
                                        <option key={'monthOption'+ele} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="newMonthYear" className="p-2" >Year</label>
                                <input id='newMonthYear' type="number" name="year" value={newMonth.year} onChange={changeNewMonth} className="p-2 m-2 border-2 text-gray-700" />
                            </div>
                            <div className="flex justify-end gap-2 my-4">
                                <button type="reset" className="px-2 bg-white text-gray-500 hover:bg-gray-400 hover:text-white duration-200 active:bg-gray-700 border-gray-600 border" onClick={() => { newMonthRef.current.style.display = 'none' }}>Cancle</button>
                                <button type="submit" className="px-2 bg-white text-gray-500 hover:bg-gray-400 hover:text-white duration-200 active:bg-gray-700 border-gray-600 border">Done</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                data.length > 0 &&
                <button
                    className={`max-[600px]:flex hidden fixed rounded-l-lg right-0 bottom-4 ${displayButton ? 'translate-x-0' : 'translate-x-full'} p-2 bg-gradient-to-r from-gray-500 to-gray-500/90 active:to-gray-600 items-center gap-2 text-gray-50 transform duration-700`}
                    onClick={addMonth}
                    >
                    Month
                    <FaPlusCircle/>
                </button>
            }
            
        </>
    );
}

export default ValueAdder;