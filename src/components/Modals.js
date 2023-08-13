import React from 'react';
import { useDispatch } from 'react-redux';
import actionCreators from '../state/index';

function Modals(props) {

    const dispatch = useDispatch();

    const CloseModal = (id) => {

        document.getElementById(id).style.display = 'none';
        document.getElementById('Home').classList.remove('blur-box')
        document.getElementById('AllValuesHolder').classList.remove('blur-box')
        window.scrollTo(0,props.PrevPosition)
    }
    
    const SubmitIt = (e, id, index) => {

        e.preventDefault();
        let reqInput1 = document.getElementById(`name${index}`);
        let reqInput2 = document.getElementById(`value${index}`);
        const obj = {
            name: reqInput1.value,
            value: reqInput2.value,
        }
        if (obj.value <= 0) {
            alert('Please enter a valid value ! ');
            return;
        }
        const updatedOne = [...props.Items];
        if (obj.name && obj.value) {
            updatedOne.forEach((item) => {
                if (item.id === id) {
                    item.items = item.items.concat(obj);
                    item.total += parseInt(obj.value);
                    dispatch(actionCreators.AddMoney(parseInt(obj.value)));
                    return;
                }
            })
        } else {
            alert('unable to edit the data');
        }

        props.setItems(updatedOne);
        reqInput1.value = '';
        reqInput2.value = '';
        CloseModal(`modal${index}`);
    }

    const EditName = (ItemId, ModalId) => {
        let processed = false;
        const updatedOne = [...props.Items];
        updatedOne.forEach(ele => {
            if (ele.id === ItemId) {
                ele.name = props.nameHolder;
                processed = true;
                return;
            }
        })
        CloseModal(ModalId);
        props.NameEditor('');
        if (!processed) {
            alert('cannot edit the name !');
        }
    }

    const editItem = (e) => {
        
        e.preventDefault();
        const updatedOne = [...props.Items];
        let processed = false;

        updatedOne.forEach(ele => {

            if (ele.id === props.item.id) {
                console.log('id found');
                ele.items.forEach(newEle => {
                    if (newEle.name === props.item.prevName) {
                        
                        ele.total -= parseInt(newEle.value);
                        ele.total+= parseInt(props.item.value);
                        dispatch(actionCreators.subtractMoney(parseInt(newEle.value)));
                        dispatch(actionCreators.AddMoney(parseInt(props.item.value)));
                        
                        newEle.name = props.item.name;
                        newEle.value = props.item.value;
                        processed=true;
                        
                        return;
                    }else{ console.log('item not matched',newEle.name,props.item.prevName)}
                    return;
                })
            }else {console.log('id not matched',ele.id,props.item.id);}
        })
        
        props.Items.forEach(Item=>{
            if(Item.id === props.item.id){
                
            }
        })
        props.setItem({name:'',value:0,id:'',prevName:''})
        props.setItems(updatedOne);
        CloseModal('itemEditor')
        if(processed){console.log('done')}
        else console.log("not done")
    }

    return (
        <div className='modals'>
            {//esilent-disable-next-line
                props.Items.map((item, index) => {
                    index++;
                    return <>
                        <div className='InsertValues' key={`modal${index}`} id={`modal${index}`}>
                            <form onSubmit={(e) => { SubmitIt(e, item.id, index) }}>

                                <input type='text' placeholder='Enter name' name='name' id={`name${index}`} required />
                                <input type='number' placeholder='Enter Value' name='value' id={`value${index}`} required />
                                <br />
                                <button className='submitButton' type='submit'>Add</button>
                                <button className='submitButton' onClick={(e) => { e.preventDefault(); CloseModal(`modal${index}`) }}>Cancle</button>

                            </form>
                        </div>
                        <div className='InsertValues' key={`NameEditor${index}`} id={`NameEditor${index}`}>
                            <form onSubmit={(e) => { e.preventDefault();EditName(item.id, `NameEditor${index}`) }}>
                                <label htmlFor='Name-editor-lable'>Enter name:</label>
                                <input type='text' value={props.nameHolder} onChange={e => { props.NameEditor(e.target.value) }} id={`name-box${index}`} required minLength={4}></input>
                                <br />
                                <button type='submit' className='submitButton'>Done</button>
                                <button className='submitButton' onClick={e => { e.preventDefault(); CloseModal(`NameEditor${index}`) }}>Cancle</button>
                            </form>
                        </div>
                    </>
                })
            }
            <div className='InsertValues' id={`itemEditor`}>
                <form onSubmit={editItem}>
                    <label htmlFor='itemEditor-name'>Name:</label>
                    <input type='text' value={props.item.name} onChange={e=>{const updatedOne={...props.item,name:e.target.value};props.setItem(updatedOne)}} required/>
                    
                    <label htmlFor='itemEditor-value'>Value:</label>
                    <input type='number' min={0} value={props.item.value} onChange={e=>{const updatedOne={...props.item,value:e.target.value};props.setItem(updatedOne)}} required/>
                    <br/>
                    <button className='submitButton' >Done</button>
                    <button className='submitButton' onClick={e=>{e.preventDefault();props.setItem({name:'',value:0,id:'',prevName:''});CloseModal('itemEditor')}}>Cancle</button>
                </form>
            </div>
        </div>
    )
}

export default Modals
