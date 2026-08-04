import { Link, useParams } from 'react-router-dom'


function LiveCrawl(){

const {id}=useParams()


return(

<div style={styles.container}>

<h1>📍 Live Crawl</h1>


<div style={styles.card}>

<h2>
Crawl Code
</h2>

<p style={styles.code}>
{id}
</p>


<p>
Your route and friends will appear here.
</p>


</div>


<Link to="/">
Leave Crawl
</Link>


</div>

)

}



const styles={

container:{
textAlign:'center' as const,
padding:'40px'
},

card:{
padding:'30px',
border:'1px solid #ddd',
borderRadius:'12px',
marginBottom:'30px'
},

code:{
fontSize:'32px',
fontWeight:'bold'
}

}


export default LiveCrawl
