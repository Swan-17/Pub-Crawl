import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function JoinCrawl(){

  const [code,setCode] = useState('')
  const navigate = useNavigate()


  function joinCrawl(){

    if(code.trim()){
      navigate(`/crawl/${code.toUpperCase()}`)
    }

  }


  return(

    <div style={styles.container}>

      <h1>🔑 Join Crawl</h1>

      <p>
        Enter your friend's crawl code.
      </p>


      <input
        style={styles.input}
        placeholder="Enter code e.g ABC123"
        value={code}
        onChange={(e)=>setCode(e.target.value)}
      />


      <button
        style={styles.button}
        onClick={joinCrawl}
      >
        Join Crawl
      </button>


      <br/><br/>

      <Link to="/">
        Back Home
      </Link>

    </div>

  )

}


const styles={

container:{
textAlign:'center' as const,
padding:'40px'
},

input:{
padding:'12px',
width:'300px',
borderRadius:'8px'
},

button:{
marginTop:'20px',
padding:'12px 30px',
background:'#444',
color:'white',
border:'none',
borderRadius:'8px'
}

}


export default JoinCrawl
 