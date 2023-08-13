export const subtractMoney = amount =>{
    return dispatch =>{
        dispatch({
            type:'subtract',
            payload : amount
        })
    }
}

export const AddMoney = amount =>{
    return dispatch =>{
        dispatch({
            type:'add',
            payload:amount
        })
    }
}