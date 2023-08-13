import { combineReducers } from "redux";
import reducer from './money-discarder';

const reducers = combineReducers({
    amount : reducer
})

export default reducers;