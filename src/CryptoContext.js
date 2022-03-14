import axios from 'axios';
import React, { createContext, useEffect, useState, useContext } from 'react'
import { CoinList } from './config/api';
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";


const Crypto = createContext();
const CryptoContext = ({children}) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [symobol, setSymobol] = useState("&#8377;");
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({open: false, message: '', type: 'success'});
  const [watchlist, setwatchlist] = useState([]);

  useEffect(() => {
    if(user){
      const coinRef = doc(db, "watchlist", user.uid);
      var unsubscribe = onSnapshot(coinRef, coin => {
        if(coin.exists()){
          setwatchlist(coin.data().coins);
        }else{
          
        }
      })
      return () => {
        unsubscribe();
      } 
    }  
  }, [user])
  

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if(user) setUser(user);
      else setUser(null);
    })
  }, [])
  

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };

  useEffect(()=>{
      if(currency==="INR") setSymobol("&#8377;");
      else if(currency==="USD") setSymobol("$");
  }, [currency]);
  return (
    <Crypto.Provider value={{currency, symobol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist}}>   
        {children}
    </Crypto.Provider>
  )
}

export default CryptoContext;

export const CryptoState = () =>{
    return useContext(Crypto);
}