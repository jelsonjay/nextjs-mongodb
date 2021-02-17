import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ myData }) {
  console.log(myData, '===No Data===')
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
      <h1>Next Mongodb App</h1>
      {myData && myData.map(item => (
      
      <div>
      <img src={item.images} />
      <div>{item.name} (up to {item.guests})</div>
      <p>{item.address.street}</p>
      <p>{item.summary}</p>

      <di>
      <span>{item.price}</span>
      </di>
      </div>

      ))}
      </main>


    </div>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase()

 const data = await db.collection('listingsAndReviews').find().sort({_id: 1}).limit(20).toArray()
 
 console.log(data, '===nodata===')

 const myData = data.map(item =>{
   
  const price = JSON.parse(JSON.stringify(item.price))

  let cleaningFee = 0;

  if(item.cleaning_fee !== undefined){
    cleaningFee = JSON.parse(JSON.stringify(item.cleaning_fee))
    cleaningFee = cleaningFee.$numberDecimal
  }
   return {
    name: item.name,
    image: item.images.pictures_url,
    address: item.address,
    guests: item.accomodates,
    price: price.$numberDecimal,
    summary: item.summary,
    cleaning_fee: cleaningFee
   }
 })
  return {
    props: { myData },
   
  }
}
