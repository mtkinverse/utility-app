function reducer(amount = 0,action){

    if(action.type === 'add'){
        return amount + action.payload;
    }else if(action.type === 'subtract'){
        return amount - action.payload;
    }else{
        return amount;
    }
}

export default reducer;