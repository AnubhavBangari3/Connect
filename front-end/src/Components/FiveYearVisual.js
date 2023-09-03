import React,{ useEffect, useState } from 'react'
import Navbar from './Navbar.js'
import {useCookies} from 'react-cookie';
import {useParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import Image from 'react-bootstrap/Image';
import { PDFViewer, PDFDownloadLink, Page, Text, View, Document, StyleSheet,Image as PDFImage } from '@react-pdf/renderer';

function FiveYearVisual() {
  const params = useParams();
  const [token]=useCookies(["access_token"])
  const [goal,setGoal]=useState([])
  const [feeling,setFeeling]=useState([])
  const [vision,setVision]=useState(null)
  const [data, setData] = useState([]);
  
  const [showform,setform]=useState(null);

  useEffect(()=>{

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/lifeplan/getvision5year/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token["access_token"]}`
          },
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const jsonData = await response.json();
        
        setData(jsonData);
        console.log("Data:",jsonData)
        const anyInactive = jsonData.some((item) => !item.five_year);
        setform(anyInactive);
        console.log("anyInactive:",anyInactive);
        console.log("showform:",showform)

      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchData();
  },[params.id,token])

  
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('why_goal', goal);
    formData.append('goal_photo', vision);
    formData.append('feeling', feeling);

    fetch(`http://127.0.0.1:8000/lifeplan/vision5year/${params.id}`, {
      method: 'POST',
      body: formData,
      headers: {
        
        'Authorization':`Bearer ${token["access_token"]}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful response
        console.log('Vision created successfully:', data);
        window.location.reload();
        
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating poVisionst:', error);
      });
  };


{/* code for pdf start */}
const [pdfUrl, setPdfUrl] = useState(null);
const [dataUrl, setDataUrl] = useState([]);
{/* code for pdf end */}

{/* code for pdf start */}
const handleGeneratePDF = () => {
  fetch(`http://127.0.0.1:8000/lifeplan/generate-five-year-vision-pdf/${params.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token["access_token"]}`
    }
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
    });
};

const handleCancelDownload = () => {
  setPdfUrl(null);
};

const fetchDataUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};


useEffect(() => {
  const fetchImages = async () => {
    const imageUrls = await Promise.all(data.map(item => fetchDataUrl(`http://localhost:8000${item.goal_photo}`)));
    setDataUrl(imageUrls);
  };

  fetchImages();
}, [data]);
{/* code for pdf end */}


  return (
    <div>
      <Navbar/>
      <br/>
      <div className="onemonthvision">
      <h1>Five Year Vision Board</h1>
      </div>
      
      <div className="visionBoard my-2">

      {showform ? (
          <h1>Plan is not active</h1>
        ):(
       
        
      
      <form onSubmit={handleSubmit}>
        <div>
        <h4><b>What is your goal?</b></h4>
        </div>
        <textarea className="textonemonth" value={goal} onChange={e => setGoal(e.target.value)}></textarea>
        <br/>
        <div>
        <h4><b>Post your desire goal</b></h4>
        </div>
        <input
                type="file"
                className="form-control-file my-2"
                name="thumbnail"
                onChange={e => setVision(e.target.files[0])}
                required
                />

            <br/>
         <div>
        <h4><b>How would you feel after you acheive your goal?</b></h4>
        </div>
        <textarea className="textonemonth my-2" value={feeling} onChange={e => setFeeling(e.target.value)}></textarea>
        <br/>
        <Button className="visionCreate my-2" type="submit">Create</Button>

      </form>)}

      </div>
      <div className="seeYourVision">
 
          

      {data.map(item => (

                <div key={item.id} className="vis">
                  
                      <br/>
                      <span><h6><b>Goal:</b> {item.why_goal}</h6></span>
                      <br/>
                      <Image src={"http://localhost:8000"+item.goal_photo} fluid />
                      <br/>
                      <span><h6><b>Outcome:</b> {item.feeling}</h6></span>
                      <br/>
                   
                
                </div>

             
              
            ))}
      

       

      </div>

        {/* code for pdf start */}
        {data.length > 0 && (
          <div className="generateVision">
          <Button className="visionCreate my-2" onClick={handleGeneratePDF}>Generate PDF</Button>
          </div>
        )}
      {pdfUrl && (
        <div>
          <div className="generateVision">
          <Button className="visionCreate my-2" onClick={handleCancelDownload}>Cancel Download</Button>
          </div>
          
          <PDFViewer width="100%" height={600}>
          <Document>
            <Page>
              {/* Customize the PDF layout here */}
              <View>
                <Text style={styles.heading}>Five Year Vision Board</Text>
                {data.map((item, index) => (
                    <View key={item.id}>
                      <Text style={styles.goal}>Goal: {item.why_goal}</Text>
                      {dataUrl[index] && <PDFImage src={dataUrl[index]} style={styles.image} />}
                      <Text style={styles.feeling}>Outcome: {item.feeling}</Text>
                    </View>
                  ))}
              </View>
            </Page>
          </Document>
        </PDFViewer>
        </div>
        
       
      )}
      {pdfUrl && (
        <PDFDownloadLink document={
          <Document>
            <Page>
              <View>
                <Text style={styles.heading}>Five Year Vision Board</Text>
                {data.map((item, index) => (
                    <View key={item.id}>
                      <Text style={styles.goal}>Goal: {item.why_goal}</Text>
                      {dataUrl[index] && <PDFImage src={dataUrl[index]} style={styles.image} />}
                      <Text style={styles.feeling}>Outcome: {item.feeling}</Text>
                    </View>
                  ))}
              </View>
            </Page>
          </Document>
        } fileName="five_year_vision.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
        </PDFDownloadLink>
      )}
{/* code for pdf end */}
	  

    </div>

  )
}

	  
{/* code for pdf start */}
const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  goal: {
    fontSize: 14,
    marginBottom: 10,
  },
  feeling: {
    fontSize: 12,
    marginBottom: 5,
  },
  image: {
    width: '200px',
    height: 'auto',
    marginBottom: '10px',
  },
});

{/* code for pdf end */}

export default FiveYearVisual
