import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css"

const CATEGORIES = [
  { name: "technology", color: "#3b82f6"},
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function App() {
  const [showState,changeState] = useState(false)
  const [facts,setFacts] =  useState([])
  const [currentCategory,setCurrentCategory] = useState("all")
  const [isLoading,setIsLoading] = useState(false)
  useEffect(function(){
    async function getFacts(){
      setIsLoading(true)
      let query = supabase.from('FACTS').select('*')
        if(currentCategory !== "all") query.eq("category",currentCategory)
      const { data: FACTS, error } = await query
      .order("votesInteresting",{ascending:false})
      if(!error) setFacts(FACTS); else alert("There was a Problem getting the Data");
    setIsLoading(false)
    } getFacts()
  },[currentCategory])
   return(
    <>
    <nav>
    <div className="logo">
    <div><pre><img src="logo.png"></img>TODAY I LEARNED</pre></div>
    <button className="btn1" onClick={()=>changeState((show)=>!show)}>{showState?"CLOSE":"SHARE A FACT"}</button>
    </div>
    {showState?<FactForm setFacts={setFacts} changeState={changeState}/>:null}
    </nav>
    <div className="main">     
    <Options setCurrentCategory={setCurrentCategory}/>
    {isLoading ? <Loader /> : <Facts facts={facts} setFacts={setFacts} isLoading ={isLoading}/>}
    
    </div>
      
    </>)
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function FactForm({setFacts,changeState}){
  const [text,setText] = useState("")
  const [source,setSource] = useState("")
  const [category,setCategory] = useState("")
  const textLen =text.length

async function handleSubmit(e){
        e.preventDefault()
        if(text && isValidHttpUrl(source) && category && textLen <=200){
        const {data:newFact} = await supabase.from("FACTS").insert([{fact:text,source,category}]).select()
        setFacts((facts)=>[newFact[0], ...facts])
        setText("")
        setSource("")
        setCategory("")
        changeState(false)
        }
  }

  return(
            <div className="submit">
            <form className="fact-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Share a fact with the world..." value={text} onChange={(e)=> setText(e.target.value)}></input>
                <span>{200-textLen}</span>
              <input type="text" placeholder="Trustworthy source..." value={source} onChange={(e)=> setSource(e.target.value)}></input>
                <select value={category} onChange={(e)=> setCategory(e.target.value)}>
                    <option value="">Choose category:</option>
                    {CATEGORIES.map((cat)=> <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option >)}
                </select>
                <button class="btn2">Post</button></form>
        </div>    
  )

}

function Options({setCurrentCategory}){
  return(
    <div className="options">
    <button className="option-btn" onClick={()=> setCurrentCategory("all")}>ALL</button>
    {CATEGORIES.map((cat)=> <button key={cat.name} className="option-btn" onClick={()=> setCurrentCategory(cat.name)}>{cat.name}</button>)}
    </div>
  )
}

function Loader(){
  return <p className="message">Loading...</p>
}

function Facts({facts,setFacts,isLoading}){

  if(facts.length === 0 && isLoading === false){
    return <p className="message">No facts for this category yet! Create the first one</p>
  }

  return(
    <div className="facts">
    <ul className="facts-list">
    {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
    ))}
    </ul>
    </div>
  )
}

function Fact({fact,setFacts}){

  async function handleVotes(column){
    const {data: updatedFact,error} = await supabase
    .from("FACTS")
    .update({[column]: fact[column]+1})
    .eq("id", fact.id)
    .select()
    if(!error) setFacts((facts)=> facts.map((f)=> f.id ===fact.id? updatedFact[0]:f))
  }

return(
        <li key = {fact.id} >
          <div className="facts">{fact.fact}
          <a className="fact-link" href={fact.source}>(Source)</a>
          </div>
          <div className="btns">                       
          <p style={{backgroundColor:CATEGORIES.find((cat)=>cat.name === fact.category).color}}>{fact.category}</p>
          <button onClick={()=>handleVotes("votesInteresting")}><pre>👍  {fact.votesInteresting}</pre></button>
          <button onClick={()=>handleVotes("votesMindblowing")}><pre>😍  {fact.votesMindblowing}</pre></button>
          <button onClick={()=>handleVotes("votesFalse")}><pre>⛔  {fact.votesFalse}</pre></button>
          </div> 
      </li>
)

}


export default App;
