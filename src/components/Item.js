import React from 'react';
import { MdModeEdit } from 'react-icons/md';
import { CgTrash } from 'react-icons/cg';

function Item(props) {
   
    const ShowIcons = (id) => {
        const reqDiv = document.getElementById('iconBox-'+id);
        if(reqDiv.style.display === 'flex') {reqDiv.style.display = 'none';}
        else{ reqDiv.style.display = 'flex';}
    }
    return (
        <>
            <div className='DopdownToggler' >
                <span onClick={()=>{ShowIcons(props.name)}}>.</span>
                <span onClick={()=>{ShowIcons(props.name)}}>.</span>
                <span onClick={()=>{ShowIcons(props.name)}}>.</span>
            </div>
            <div className='listValues' key={props.name} id={props.name}>
                <li >{props.name}</li>
                <li id='values'>{props.value}</li>
            </div>
            <div className='icon-holder'>
                <span className='icon pen-editor'><MdModeEdit size='1rem' color='rgb(83,83,83)' onClick={e => { e.preventDefault(); props.letItemEdit(props.name, props.value, props.id) }} /></span>
                <span className='icon trash-button'><CgTrash size='1rem' color='rgb(83,83,83)' onClick={e => { e.preventDefault(); props.DeleteItem(props.name, props.id) }} /></span>
            </div>
            <div className='clear-both'></div>
            <div className='newDropdown' id={'iconBox-'+props.name}>
                <ul>
                    <li className='icon'><MdModeEdit size='1rem' color='white' onClick={e => { e.preventDefault(); ShowIcons(props.name); props.letItemEdit(props.name, props.value, props.id) }} /></li>
                    <li className='icon'><CgTrash size='1rem' color='white' onClick={e => { e.preventDefault(); ShowIcons(props.name); props.DeleteItem(props.name, props.id) }} /></li>
                </ul>
            </div>
        </>
    )
}

export default Item
