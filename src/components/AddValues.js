import React, { useState } from 'react'
import ValueComp from './Item';
import Modals from './Modals';
import html2Canvas from 'html2canvas';
import { FiDelete } from 'react-icons/fi'
import { useDispatch } from 'react-redux';
import actionCreators from '../state';

function AddValues() {

    const dispatch = useDispatch();
    const [Items, setItems] = useState([]);
    const [numbox, setNumbox] = useState(1);
    const [nameHolder, NameEditor] = useState('');
    const [PrevPosition, setPosition] = useState();
    const [item, setItem] = useState({ name: '', value: 0, id: '', prevName: '' });


    const DownloadDiv = (id, name, DivToBeHide) => {

        const box = document.getElementById(id);
        const hidingBox = document.getElementById(DivToBeHide);
        const badges = document.getElementsByClassName('badge');
        const DToggler = document.getElementsByClassName('DopdownToggler')

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Code for mobile view
            box.setAttribute('style', 'width:500px;');
            Array.from(DToggler).forEach(ele => {
                ele.style.display = 'none';
            })
        } else {
            Array.from(badges).forEach(badge => {
                badge.setAttribute('style', 'display:none;')
            })
            box.setAttribute('style', 'width:500px;color:white;');
        }



        const prevDisp = hidingBox.style.display;
        hidingBox.style.display = 'none';

        const CloseButton = document.getElementsByClassName('close-button');
        Array.from(CloseButton).forEach(ele => {
            ele.style.display = 'none';
        })


        html2Canvas(box).then((canvas) => {
            const URL = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = URL;
            link.download = name ? name + '.jpg' : 'UnnamedBox.jpg';
            link.click();
        })

        box.removeAttribute('style');
        hidingBox.style.display = prevDisp;
        Array.from(CloseButton).forEach(ele => {
            ele.style.display = 'inline';
        })
        
        if (isMobile) {
            // Code for mobile view
            Array.from(DToggler).forEach(ele => {
                ele.style.display = 'flex';
            })
        } else {
            Array.from(badges).forEach(badge => {
                badge.removeAttribute('style');
            })
        }

    }

    const OpenModal = (index) => {

        const reqModal = document.getElementById(index);
        if (reqModal) {
            document.getElementById('Home').classList.add('blur-box')
            document.getElementById('AllValuesHolder').classList.add('blur-box')
            reqModal.style.display = 'flex';
            setPosition(window.scrollY);
            reqModal.scrollIntoView({ behavior: 'smooth' });
            reqModal.focus()
        } else {
            alert('Modal cannot be found !');
        }

    }

    const AddNewBox = () => {
        setItems(Items.concat({ id: `box${numbox}`, name: '', items: [], total: 0 }));
        setNumbox(numbox + 1);
    }

    const DeleteBox = id => {

        let totalToBeDetect = 0;
        Items.forEach(tempItem => {
            if (tempItem.id === id) {
                totalToBeDetect = parseInt(tempItem.total);
                return;
            }
        })
        setItems(Items.filter(ele => ele.id !== id));
        dispatch(actionCreators.subtractMoney(totalToBeDetect));
    }

    const letItemEdit = (ItemName, ItemValue, id) => {

        setItem({ name: ItemName, value: ItemValue, id: id, prevName: ItemName });
        OpenModal('itemEditor');

    }

    const DeleteItem = (name, id) => {

        const updatedOne = [...Items];

        updatedOne.forEach(item => {
            if (item.id === id) {
                item.items = item.items.filter(ele => ele.name !== name);
                return;
            }
        })

        setItems(updatedOne);
    }

    return (
        <>

            <div className='addValues' id='AllValuesHolder'>
                {
                    Items.map((Item, index) => {
                        return <div key={Item.id} className='covering-box' id={`Cover-${Item.id}`}>
                            <div className='rightValues' key={Item.id} id={Item.id}>
                                <span className='badge'>{Item.name ? Item.name : 'Enter name'}</span>
                                <span className='icon close-button'><FiDelete size='1.75rem' onClick={e => { e.preventDefault(); DeleteBox(Item.id); }} /></span>
                                <div className='listHeader'>
                                    <li >Names</li>
                                    <li >Values</li>
                                </div>

                                {
                                    Item.items.length > 0 ?
                                        Item.items.map(
                                            ele => {
                                                return <ValueComp name={ele.name} value={ele.value} id={Item.id} letItemEdit={letItemEdit} DeleteItem={DeleteItem} />
                                            }
                                        )
                                        : <div className='listValues'><li><p>Kindly, Enter values</p></li></div>
                                }
                                <hr />
                                <div className='listValues' >
                                    <li >Total</li>
                                    <li id='values'>{Item.total}</li>
                                </div>
                                <div className='listValues' id={`Button-holder-${Item.id}`}>
                                    <li><button id={`Addbtn${numbox}`} className='submitButton' onClick={() => { OpenModal(`modal${index + 1}`) }}>Add Values</button></li>
                                    <li><button className='submitButton' onClick={e => {
                                        e.preventDefault();
                                        NameEditor(Item.name);
                                        OpenModal(`NameEditor${index + 1}`);
                                    }}>{Item.name ? 'Rename' : 'Add Name'}</button></li>
                                    <li><button className='submitButton' onClick={e => { e.preventDefault(); DownloadDiv(`Cover-${Item.id}`, Item.name, `Button-holder-${Item.id}`) }}>Dowload</button></li>
                                </div>
                            </div>
                        </div>
                    })
                }

            </div>

            <div className='addValues'>
                <button className='submitButton' onClick={AddNewBox}>Add new box</button>
            </div>

            <Modals NameEditor={NameEditor} nameHolder={nameHolder} Items={Items} setItems={setItems} PrevPosition={PrevPosition} item={item} setItem={setItem} />


        </>


    )
}

export default AddValues
