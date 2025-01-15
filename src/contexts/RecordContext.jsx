import React, { createContext, useContext, useState } from "react";
import {openDB} from 'idb'
const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
    const [user, setUser] = useState({});
    let db = undefined;
    const storeName = 'NewStore';
    const dbName = 'temp13';

    const initializeIndexedDB = async () => {
        try{
            db = await openDB(dbName, 1, {
                upgrade(db) {
                    // Create object store if it doesn't exist
                    if (!db.objectStoreNames.contains(storeName)) {                        
                        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                    }
                },
            });
            return db; // Return the database instance for further use
        }
        catch(err){
            console.error(err.message);
        }
    };

    const getDB = async () => {
        try{
            if(!db) db = await initializeIndexedDB();
            return db;
        }catch(err) {
            console.error(err.message);
        }
    }

    const getTransaction = async () => {
        try{
            const db = await getDB();
            const tx = db.transaction(storeName,'readwrite');
            return tx;
        }
        catch(err){ console.error(err.message)}
    }
    
    const addData = async (data) => {
        try{
            const tx = await getTransaction()
            const store = tx.objectStore(storeName);
            const {id,...other} = data;
            const newId = await store.add(other);
            await tx.done;            
            return newId;
        }
        catch(err){
            console.error(err.message);
        }
    }; 

    const getData = async (id) => {
        try{
            return await getDB().get(storeName, id);
        }catch(err){
            console.error(err.message);
        }
    };      

    const getAllData = async () => {
        try{
            const db = await getDB();
            const tx = db.transaction(storeName,'readonly');
            const store = tx.objectStore(storeName)
            const data = await store.getAll();
            await tx.done;
            return data;
        }
        catch(err){ console.error(err.message); }
    };
      
    const updateData = async (id, updatedMonth) => {
        try{            
            const tx = await getTransaction();
            const store = tx.objectStore(storeName);

            const existingRec = await store.get(id);
            if(existingRec){
                await store.put(updatedMonth);                
            }
            
            await tx.done;
        }catch(err){
            console.error(err.message);
        }
    };
    
    const deleteData = async (id) => {
        try{
            const tx = await getTransaction();
            const store = tx.objectStore(storeName);
            
            await store.delete(id);
            await tx.done;
        }
        catch(err){ 
            console.error(err.message);
        }
    };

    return (
        <RecordContext.Provider value={{ addData,getData,getAllData,updateData,deleteData }}>
        {children}
        </RecordContext.Provider>
    );
};

export const UseRecordContext = () => {
    const context = useContext(RecordContext);
    if(!context) throw new Error("context out of scope");
    return context;
}

/*
  
  initializeDB();

  import { openDB } from "idb";

const loadDB = async () => {
  return await openDB("MyDatabase", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("MyStore")) {
        db.createObjectStore("MyStore", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Get all records



  
  */