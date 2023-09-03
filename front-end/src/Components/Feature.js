import React,{useState,useEffect} from 'react'
import Navbar from './Navbar.js'
import {useParams} from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {useCookies} from 'react-cookie';

function Feature() {
  const params = useParams();
  const [feature,setFeature]=useState("")
  const [token]=useCookies(["access_token"])
  console.log(params.id);
  const [value, onChange] = useState(new Date());

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //one moth plan
  const [active1M,setactive1M]=useState(null);

  //2nd
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  //3rd
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  //4th
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  //5th
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  //6th
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  //1 month not active
  const [notactive1m,setnotactive1m]=useState('');
  //6 month not active
  const [notactive6m,setnotactive6m]=useState('');
  //1 year not active
  const [notactive1Y,setnotactive1Y]=useState('');
  //3 year not active
  const [notactive3Y,setnotactive3Y]=useState('');
  
  //5 year not active
  const [notactive5Y,setnotactive5Y]=useState('');
  
  //10 year not active
  const [notactive10Y,setnotactive10Y]=useState('');

  const [oneMonthSdt, setOneMonthSdt] = useState('');
  const [formattedOneMonthSdt, setFormattedOneMonthSdt] = useState('');
  const [formattedOneMonthEdt, setFormattedOneMonthEdt] = useState('');
  //6 months
  //active6M use it for fetching
  const [active6M,setactive6M]=useState(null);
  const [sixMonthSdt, setSixMonthSdt] = useState('');
  const [formattedSixMonthSdt, setFormattedSixMonthSdt] = useState('');
  const [formattedSixMonthEdt, setFormattedSixMonthEdt] = useState('');
  //1 year
  //active1Y use it for fetching
  const [active1Y,setactive1Y]=useState(null);
  const [oneYearSdt, setOneYearSdt] = useState('');
  const [formattedOneYearSdt, setFormattedOneYearSdt] = useState('');
  const [formattedOneYearthEdt, setFormattedOneYearEdt] = useState('');
  //3 year
  //active3Y use it for fetching
  const [active3Y,setactive3Y]=useState(null);
  const [threeYearSdt, setThreeYearSdt] = useState('');
  const [formattedthreeYearSdt, setFormattedthreeYearSdt] = useState('');
  const [formattedthreeYearEdt, setFormattedthreeYearEdt] = useState('');
  
  //5 year
  const [active5Y,setactive5Y]=useState(null);
  const [fiveYearSdt, setFiveYearSdt] = useState('');
  const [formattedfiveYearSdt, setFormattedfiveYearSdt] = useState('');
  const [formattedfiveYearEdt, setFormattedfiveYearEdt] = useState('');

  //10 year
  const [active10Y,setactive10Y]=useState(null);
  const [tenYearSdt, setTenYearSdt] = useState('');
  const [formattedtenyear, setFormattedtenyear] = useState('');
  const [formattedtenYearEdt, setFormattedtenYearEdt] = useState('');

  useEffect(() => {
    switch (params.id) {
      case '1':
        setFeature('Health & Fitness');
        break;
      case '2':
        setFeature('Knowledge');
        break;
      case '3':
        setFeature('Emotional');
        break;
      case '4':
        setFeature('Character');
        break;
      case '5':
        setFeature('Spiritual');
        break;
      case '6':
        setFeature('Love & Relationship');
        break;
      case '7':
        setFeature('Parenting');
        break;
      case '8':
        setFeature('Social');
        break;
      case '9':
        setFeature('Career');
        break;
      case '10':
        setFeature('Financial');
        break;
      case '11':
        setFeature('Quality Of Life');
        break;
      case '12':
        setFeature('Life Vision');
        break;
      default:
        setFeature('');
    }

const fetchActivePlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeOnemonthPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive1M(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive1M(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive1M(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};

//Not active 1 month Plan

const fetchNotActivePlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/notactiveOnemonthPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setnotactive1m(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setnotactive1m(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setnotactive1m(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch non active plan:', error);
  }
};

fetchNotActivePlan();   

//get 6 months
const fetchActive6MPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getactiveSixmonthPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive6M(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive6M(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive6M(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};
fetchActive6MPlan()

const fetchNotActive6MPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/notactiveSixmonthPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setnotactive6m(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setnotactive6m(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setnotactive6m(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch non active plan:', error);
  }
};
fetchNotActive6MPlan();

//get 1 year
const fetchActive1YPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getactiveOneyearPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive1Y(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive1Y(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive1Y(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};
fetchActive1YPlan()


const fetchNotActive1YPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getnotactiveOneyearPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setnotactive1Y(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setnotactive1Y(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setnotactive1Y(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch non active plan:', error);
  }
};

fetchNotActive1YPlan();

//get 3 year
const fetchActive3YPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getactiveThreeYearPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive3Y(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive3Y(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive3Y(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};
fetchActive3YPlan();
//get 5 year
const fetchActive5YPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getactiveFiveYearPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive5Y(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive5Y(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive5Y(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};
fetchActive5YPlan();
//get 10 year
const fetchActive10YPlan = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getactiveTenYearPlan`, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Plan does not exist for the record.');
        setactive10Y(null); // Set the state to null or any other default value
      } else {
        throw new Error('Request failed');
      }
    } else {
      const responseData = await response.text();
      try {
        const jsonData = JSON.parse(responseData);
        setactive10Y(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setactive10Y(null); // Set the state to null or any other default value
      }
    }
    
    
  } catch (error) {
    console.error('Failed to fetch active plan:', error);
  }
};

fetchActive10YPlan();
    fetchActivePlan();

    const fetchNotActive3YPlan = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getnotactiveThreeYearPlan`, {
          method: 'GET',
          headers: {
            'Authorization':`Bearer ${token["access_token"]}`
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Plan does not exist for the record.');
            setnotactive3Y(null); // Set the state to null or any other default value
          } else {
            throw new Error('Request failed');
          }
        } else {
          const responseData = await response.text();
          try {
            const jsonData = JSON.parse(responseData);
            setnotactive3Y(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            setnotactive3Y(null); // Set the state to null or any other default value
          }
        }
        
        
      } catch (error) {
        console.error('Failed to fetch Non active plan:', error);
      }
    };
    fetchNotActive3YPlan();
    //get 5 year
    const fetchNotActive5YPlan = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getnotactiveFiveYearPlan`, {
          method: 'GET',
          headers: {
            'Authorization':`Bearer ${token["access_token"]}`
          },
        });
        
    
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Plan does not exist for the record.');
            setnotactive5Y(null); // Set the state to null or any other default value
          } else {
            throw new Error('Request failed');
          }
        } else {
          const responseData = await response.text();
          try {
            const jsonData = JSON.parse(responseData);
            setnotactive5Y(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            setnotactive5Y(null); // Set the state to null or any other default value
          }
        }
        
        
      } catch (error) {
        console.error('Failed to fetch non active plan:', error);
      }
    };
    fetchNotActive5YPlan();
    
    const fetchNotActive10YPlan = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/getnotactiveTenYearPlan`, {
          method: 'GET',
          headers: {
            'Authorization':`Bearer ${token["access_token"]}`
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Plan does not exist for the record.');
            setnotactive10Y(null); // Set the state to null or any other default value
          } else {
            throw new Error('Request failed');
          }
        } else {
          const responseData = await response.text();
          try {
            const jsonData = JSON.parse(responseData);
            setnotactive10Y(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            setnotactive10Y(null); // Set the state to null or any other default value
          }
        }
        
        
      } catch (error) {
        console.error('Failed to fetch non active plan:', error);
      }
    };
    fetchNotActive10YPlan();

  }, [params.id]);

 



  //This will take input from calender and set the selected date and the plan end date month wise
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'oneMonthSdt':
        const inputDate = new Date(value);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const startDate = new Date(inputDate);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        const formattedEndDate = endDate.toISOString().slice(0, 10);
        
        setOneMonthSdt(formattedDate);
        setFormattedOneMonthSdt(formattedDate);
        setFormattedOneMonthEdt(formattedEndDate)
        break;
        case 'sixMonthSdt':
          const inputDate1 = new Date(value);
          const year1 = inputDate1.getFullYear();
          const month1= String(inputDate1.getMonth() + 1).padStart(2, '0');
          const day1 = String(inputDate1.getDate()).padStart(2, '0');
          const formattedDate1 = `${year1}-${month1}-${day1}`;
  
          const startDate1 = new Date(inputDate1);
          const endDate1 = new Date(startDate1.getFullYear(), startDate1.getMonth() + 6, startDate1.getDate());
          const formattedEndDate1 = endDate1.toISOString().slice(0, 10);
          
          setSixMonthSdt(formattedDate1);
          setFormattedSixMonthSdt(formattedDate1);
          setFormattedSixMonthEdt(formattedEndDate1)
          break;
          case 'oneYearSdt':
            const inputDate2 = new Date(value);
            const year2 = inputDate2.getFullYear();
            const month2= String(inputDate2.getMonth() + 1).padStart(2, '0');
            const day2 = String(inputDate2.getDate()).padStart(2, '0');
            const formattedDate2 = `${year2}-${month2}-${day2}`;
    
            const startDate2 = new Date(inputDate2);
            const endDate2 = new Date(startDate2.getFullYear()+1, startDate2.getMonth(), startDate2.getDate());
            const formattedEndDate2 = endDate2.toISOString().slice(0, 10);
            
            setOneYearSdt(formattedDate2);
            setFormattedOneYearSdt(formattedDate2);
            setFormattedOneYearEdt(formattedEndDate2)
            break;
          case 'threeYearSdt':
            const inputDate3 = new Date(value);
            const year3 = inputDate3.getFullYear();
            const month3= String(inputDate3.getMonth() + 1).padStart(2, '0');
            const day3 = String(inputDate3.getDate()).padStart(2, '0');
            const formattedDate3 = `${year3}-${month3}-${day3}`;
    
            const startDate3 = new Date(inputDate3);
            const endDate3 = new Date(startDate3.getFullYear()+3, startDate3.getMonth(), startDate3.getDate());
            const formattedEndDate3 = endDate3.toISOString().slice(0, 10);
            
            setThreeYearSdt(formattedDate3);
            setFormattedthreeYearSdt(formattedDate3);
            setFormattedthreeYearEdt(formattedEndDate3)
            break;
          case 'fiveYearSdt':
              const inputDate4 = new Date(value);
              const year4 = inputDate4.getFullYear();
              const month4= String(inputDate4.getMonth() + 1).padStart(2, '0');
              const day4 = String(inputDate4.getDate()).padStart(2, '0');
              const formattedDate4= `${year4}-${month4}-${day4}`;
      
              const startDate4 = new Date(inputDate4);
              const endDate4= new Date(startDate4.getFullYear()+5, startDate4.getMonth(), startDate4.getDate());
              const formattedEndDate4= endDate4.toISOString().slice(0, 10);
              
              setFiveYearSdt(formattedDate4);
              setFormattedfiveYearSdt(formattedDate4);
              setFormattedfiveYearEdt(formattedEndDate4)
              break;
            case 'tenYearSdt':
              const inputDate5 = new Date(value);
              const year5= inputDate5.getFullYear();
              const month5= String(inputDate5.getMonth() + 1).padStart(2, '0');
              const day5=String(inputDate5.getDate()).padStart(2, '0');
              const formattedDate5= `${year5}-${month5}-${day5}`;
      
              const startDate5 = new Date(inputDate5);
              const endDate5= new Date(startDate5.getFullYear()+10, startDate5.getMonth(), startDate5.getDate());
              const formattedEndDate5= endDate5.toISOString().slice(0, 10);
              
              setTenYearSdt(formattedDate5);
              setFormattedtenyear(formattedDate5);
              setFormattedtenYearEdt(formattedEndDate5)
              break;
        default:
      
        break;
    }
  };
  //For posting one month Plan
  const createOneMonthPlan = () =>{

    
    const data ={
      oneMonth:true,
      oneMonthSdt:formattedOneMonthSdt,
      oneMonthEdt: formattedOneMonthEdt,
    }
    console.log(data)
    try {
      const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token["access_token"]}`
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // Plan created successfully
        console.log('Plan created');
        alert("One Month Plan Created Successfully");
        window.location.reload();
      } else {
        // Handle error response
        console.error('Failed to create plan');
        alert("One Month Plan is already active")
        window.location.reload();
        
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error creating plan:', error);
    }
  }


  const createSixMonthPlan = () =>{

    
    const data ={
      sixMonth:true,
      sixMonthSdt:formattedSixMonthSdt,
      sixMonthEdt: formattedSixMonthEdt,
    }
    console.log(data)
    try {
      const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeSixmonthPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token["access_token"]}`
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // Plan created successfully
        console.log('Plan created');
        alert("Six Month Plan Created Successfully");
        window.location.reload();
      } else {
        // Handle error response
        console.error('Failed to create plan');
        alert("Six Month Plan is already active");
        window.location.reload();
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error creating plan:', error);
    }
  }

  //For posting one Year Plan
  const createOneYearPlan = () =>{

    
    const data ={
      oneyear:true,
      oneYearSdt:formattedOneYearSdt,
      oneYearEdt:formattedOneYearthEdt,
    }
    console.log(data)
    try {
      const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeOneyearPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token["access_token"]}`
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // Plan created successfully
        console.log('Plan created');
        alert("One Year Plan created successfully.")
        window.location.reload();
      } else {
        // Handle error response
        console.error('Failed to create plan');
        alert("One Year Plan is already active");
        window.location.reload();
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error creating plan:', error);
    }
  }
 


   //For posting three Year Plan
   const createThreeYearPlan = () =>{

    
    const data ={
      threeyear:true,
      threeYearSdt:formattedthreeYearSdt,
      threeYearEdt:formattedthreeYearEdt,
    }
    console.log(data)
    try {
      const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeThreeYearPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token["access_token"]}`
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // Plan created successfully
        console.log('3 year Plan created');
        alert("Three year Plan Created Sucessfully.");
        window.location.reload();
      } else {
        // Handle error response
        console.error('Failed to create plan');
        alert("Three Year Plan is already active");
        window.location.reload();
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error creating plan:', error);
    }
  }


//For posting five Year Plan
const createFiveYearPlan = () =>{

    
  const data ={
    fiveyear:true,
    fiveYearSdt:formattedfiveYearSdt,
    fiveYearEdt:formattedfiveYearEdt,
  }
  console.log(data)
  try {
    const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeFiveYearPlan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token["access_token"]}`
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Plan created successfully
      console.log('5 year Plan created');
      alert("Five Year Plan created Successfully");
      window.location.reload();
    } else {
      // Handle error response
      console.error('Failed to create plan');
      alert("Five Year Plan is already active");
      window.location.reload();
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error creating plan:', error);
  }
}


//For posting ten Year Plan
const createTenYearPlan = () =>{

    
  const data ={
    tenyear:true,
    tenYearSdt:formattedtenyear,
    tenYearEdt:formattedtenYearEdt,
  }
  console.log(data)
  try {
    const response = fetch(`http://127.0.0.1:8000/lifeplan/${params.id}/activeTenYearPlan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token["access_token"]}`
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Plan created successfully
      console.log('10 year Plan created');
      alert("10 Year Plan Created Successfully.")
      window.location.reload();
    } else {
      // Handle error response
      console.error('Failed to create plan');
      alert("10 Year Plan is already active")
      window.location.reload();
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error creating plan:', error);
  }
}





  return (
    <div>
        <Navbar/>
        <br/>
        {feature && <h1 className="feature">{feature}</h1>}
        <hr/>
        <div className="cal my-2">
        <Calendar onChange={onChange} value={value} />
        </div>
        <hr/>
        <div className="createLifeP">
          <h2 className="createLP"><b>Set you goal for your {feature} health.</b></h2>

          <div className="allfeatures my-4">

              <Button className="creaate-active-plan" onClick={handleShow}>
              1 Month Plan
              </Button>
              {/* One month plan start */}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header className="active-plan-title" closeButton>
                
                </Modal.Header>
                <Modal.Body>
                <div className="activate-the-plan">
                  <label>
                    <h6><b>One Month Start Date:</b></h6>
                    <input
                      type="date"
                      name="oneMonthSdt"
                      value={oneMonthSdt}
                      onChange={handleInputChange}
                    />
                  </label>
                  <Button onClick={()=>createOneMonthPlan()}>Create One Month Plan</Button>
                </div>
                </Modal.Body>
                {/* <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer> */}
              </Modal>
              {/* One moth plan ends */}

              <Button className="creaate-active-plan" onClick={handleShow1}>
                6 Months Plan
              </Button>

                    <Modal show={show1} onHide={handleClose1}>
                      <Modal.Header className="active-plan-title" closeButton>
                      
                      </Modal.Header>
                      <Modal.Body>
                      <div className="activate-the-plan">
                      <label>
                        <h6><b>6 Month Start Date:</b></h6>
                        <input
                          type="date"
                          name="sixMonthSdt"
                          value={sixMonthSdt}
                          onChange={handleInputChange}
                        />
                      </label>
                      <Button onClick={()=>createSixMonthPlan()}>Create 6 Month Plan</Button>
                    </div>
                      </Modal.Body>
                      {/* <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose1}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleClose1}>
                          Save Changes
                        </Button>
                      </Modal.Footer> */}
                    </Modal>


                    <Button className="creaate-active-plan" onClick={handleShow2}>
                          1 Year Plan 
                  </Button>

                        <Modal show={show2} onHide={handleClose2}>
                          <Modal.Header className="active-plan-title" closeButton>
                          
                          </Modal.Header>
                          <Modal.Body>
                          <div className="activate-the-plan">
                              <label>
                                <h6><b>One Year Start Date:</b></h6>
                                <input
                                  type="date"
                                  name="oneYearSdt"
                                  value={oneYearSdt}
                                  onChange={handleInputChange}
                                />
                              </label>
                              <Button onClick={()=>createOneYearPlan()}>Create 1 Year Plan</Button>
                            </div>
                          </Modal.Body>
                          {/* <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose2}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={handleClose2}>
                              Save Changes
                            </Button>
                          </Modal.Footer> */}
                        </Modal>


                        <Button className="creaate-active-plan" onClick={handleShow3}>
                                3 Year Plan
                        </Button>

                              <Modal show={show3} onHide={handleClose3}>
                                <Modal.Header className="active-plan-title" closeButton>
                                
                                </Modal.Header>
                                <Modal.Body>

                                <div className="activate-the-plan">
                                    <label>
                                      <h6><b>Three Year Start Date:</b></h6>
                                      <input
                                        type="date"
                                        name="threeYearSdt"
                                        value={threeYearSdt}
                                        onChange={handleInputChange}
                                      />
                                    </label>
                                    <Button onClick={()=>createThreeYearPlan()}>Create 3 Year Plan</Button>
                                  </div>
                                </Modal.Body>
                                {/* <Modal.Footer>
                                  <Button variant="secondary" onClick={handleClose3}>
                                    Close
                                  </Button>
                                  <Button variant="primary" onClick={handleClose3}>
                                    Save Changes
                                  </Button>
                                </Modal.Footer> */}
                              </Modal>

                              <Button className="creaate-active-plan" onClick={handleShow4}>
                                      5 year Plan
                              </Button>

                              <Modal show={show4} onHide={handleClose4}>
                                <Modal.Header className="active-plan-title" closeButton>
                                
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="activate-the-plan">
                                      <label>
                                        <h6><b>Five Year Start Date:</b></h6>
                                        <input
                                          type="date"
                                          name="fiveYearSdt"
                                          value={fiveYearSdt}
                                          onChange={handleInputChange}
                                        />
                                      </label>
                                      <Button onClick={()=>createFiveYearPlan()}>Create 5 Year Plan</Button>
                                    </div>
                                </Modal.Body>
                                {/* <Modal.Footer>
                                  <Button variant="secondary" onClick={handleClose4}>
                                    Close
                                  </Button>
                                  <Button variant="primary" onClick={handleClose4}>
                                    Save Changes
                                  </Button>
                                </Modal.Footer> */}
                              </Modal>

                              <Button className="creaate-active-plan" onClick={handleShow5}>
                                10 Year Plan
                              </Button>

                            <Modal show={show5} onHide={handleClose5}>
                              <Modal.Header className="active-plan-title" closeButton>
                               
                              </Modal.Header>
                              <Modal.Body>
                              <div className="activate-the-plan">
                                    <label>
                                      <h6><b>10 Year Start Date:</b></h6>
                                      <input
                                        type="date"
                                        name="tenYearSdt"
                                        value={tenYearSdt}
                                        onChange={handleInputChange}
                                      />
                                    </label>
                                    <Button onClick={()=>createTenYearPlan()}>Create 10 Year Plan</Button>
                                  </div>
                              </Modal.Body>
                              {/* <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose5}>
                                  Close
                                </Button>
                                <Button variant="primary" onClick={handleClose5}>
                                  Save Changes
                                </Button>
                              </Modal.Footer> */}
                            </Modal>
          </div>
          <hr/>
            {active1M &&!active1M.oneMonth &&
             active6M && !active6M.sixMonth && 
             active1Y && !active1Y.oneyear && 
             active3Y && !active3Y.threeyear && 
             active5Y && !active5Y.fiveyear && active10Y && !active10Y.tenyear ? (
              <div className="ap">
                <h1>No Active Plan</h1>
              </div>
            ) : (
              <div className="ap">
                <h1>Active Plan</h1>
              </div>
            )}

            
          <div className="active-Plans my-2">

            
            {active1M && active1M.oneMonth === true && (
                <div className="activePlan mx-2 my-2">
                 
                    <div className="aPlan">
                      <h6>Active Plan: <b>1 Month Plan</b></h6>
                      <h6>Start date: {active1M.oneMonthSdt}</h6>
                      <h6>End date: {active1M.oneMonthEdt}</h6>

                      <Button variant="light"><a href={`/vision/${active1M.id}`}>Make a vision board</a></Button>{' '}
                    </div>
               
                </div>
             
              )}

            {active6M && active6M.sixMonth === true && (
                <div className="activePlan mx-2 my-2">
                 
                    <div className="aPlan">
                      <h6>Active Plan: <b>6 Months Plan</b></h6>
                      <h6>Start date: {active6M.sixMonthSdt}</h6>
                      <h6>End date: {active6M.sixMonthEdt}</h6>

                      <Button variant="light"><a href={`/vision2/${active6M.id}`}>Make a vision board</a></Button>{' '}
                    </div>
                 
                </div>
            
              )}


            {active1Y && active1Y.oneyear === true && (
                  <div className="activePlan mx-2 my-2">
                  
                      <div className="aPlan">
                        <h6>Active Plan: <b>1 Year Plan</b></h6>
                        <h6>Start date: {active1Y.oneYearSdt}</h6>
                        <h6>End date: {active1Y.oneYearEdt}</h6>

                        <Button variant="light"><a href={`/vision3/${active1Y.id}`}>Make a vision board</a></Button>{' '}
                      </div>
                  
                  </div>
                
                )}

            {active3Y && active3Y.threeyear === true && (
                <div className="activePlan mx-2 my-2">
                 
                    <div className="aPlan">
                      <h6>Active Plan: <b>3 Year Plan</b></h6>
                      <h6>Start date: {active3Y.threeYearSdt}</h6>
                      <h6>End date: {active3Y.threeYearEdt}</h6>

                      <Button variant="light"><a href={`/vision4/${active3Y.id}`}>Make a vision board</a></Button>{' '}
                    </div>
               
                </div>
              )}


            {active5Y && active5Y.fiveyear === true  && (
                <div className="activePlan mx-2 my-2">
         
                    <div className="aPlan">
                      <h6>Active Plan: <b>5 Year Plan</b></h6>
                      <h6>Start date: {active5Y.fiveYearSdt}</h6>
                      <h6>End date: {active5Y.fiveYearEdt}</h6>

                      <Button variant="light"><a href={`/vision5/${active5Y.id}`}>Make a vision board</a></Button>{' '}
                    </div>

                </div>

              )}



              {active10Y && active10Y.tenyear === true && (
                <div className="activePlan mx-2 my-2">

                    <div className="aPlan">
                      <h6>Active Plan: <b>10 Year Plan</b></h6>
                      <h6>Start date: {active10Y.tenYearSdt}</h6>
                      <h6>End date: {active10Y.tenYearEdt}</h6>

                      <Button variant="light"><a href={`/vision6/${active10Y.id}`}>Make a vision board</a></Button>{' '}
                    </div>

                </div>

              )}

          </div>
          <hr/>
          <h1 className="not-active-heading my-4">Old Plans</h1>
          <div className="not-active-plan my-2">
            
            
            {notactive1m && notactive1m.oneMonth === false && (
                <div className="not-active mx-2 my-2">
                 
                    <div className="notactivePlan">
                      <h6>Old Plan: <b>1 Month Plan</b></h6>
                      <h6>Start date: {notactive1m.oneMonthSdt}</h6>
                      <h6>End date: {notactive1m.oneMonthEdt}</h6>

                      <Button variant="light"><a href={`/vision/${notactive1m.id}`}>View vision board</a></Button>{' '}
                    </div>
               
                </div>
             
              )}
              
              {notactive6m && notactive6m.sixMonth === false && (
                <div className="not-active mx-2 my-2">
                 
                    <div className="notactivePlan">
                      <h6>Old Plan: <b>6 Month Plan</b></h6>
                      <h6>Start date: {notactive6m.sixMonthSdt}</h6>
                      <h6>End date: {notactive6m.sixMonthEdt}</h6>

                      <Button variant="light"><a href={`/vision/${notactive6m.id}`}>View vision board</a></Button>{' '}
                    </div>
               
                </div>
             
              )}

              {notactive1Y && notactive1Y.oneyear === false && (
                      <div className="not-active mx-2 my-2">
                      
                          <div className="notactivePlan">
                            <h6>Old Plan: <b>1 Year Plan</b></h6>
                            <h6>Start date: {notactive1Y.oneYearSdt}</h6>
                            <h6>End date: {notactive1Y.oneYearEdt}</h6>

                            <Button variant="light"><a href={`/vision3/${notactive1Y.id}`}>View  vision board</a></Button>{' '}
                          </div>
                      
                      </div>
                              
             )}

{notactive3Y && notactive3Y.threeyear === false && (
                <div className="not-active mx-2 my-2">
                 
                    <div className="notactivePlan">
                      <h6>Old Plan: <b>3 Year Plan</b></h6>
                      <h6>Start date: {notactive3Y.threeYearSdt}</h6>
                      <h6>End date: {notactive3Y.threeYearEdt}</h6>

                      <Button variant="light"><a href={`/vision4/${notactive3Y.id}`}>View vision board</a></Button>{' '}
                    </div>
               
                </div>
              )}


            {notactive5Y && notactive5Y.fiveyear === false  && (
                <div className="not-active mx-2 my-2">
         
                    <div className="notactivePlan">
                      <h6>Old Plan: <b>5 Year Plan</b></h6>
                      <h6>Start date: {notactive5Y.fiveYearSdt}</h6>
                      <h6>End date: {notactive5Y.fiveYearEdt}</h6>

                      <Button variant="light"><a href={`/vision5/${notactive5Y.id}`}>View vision board</a></Button>{' '}
                    </div>

                </div>

              )}



              {notactive10Y && notactive10Y.tenyear === false && (
                <div className="not-active mx-2 my-2">

                    <div className="notactivePlan">
                      <h6>Old Plan: <b>10 Year Plan</b></h6>
                      <h6>Start date: {notactive10Y.tenYearSdt}</h6>
                      <h6>End date: {notactive10Y.tenYearEdt}</h6>

                      <Button variant="light"><a href={`/vision6/${notactive10Y.id}`}>View vision board</a></Button>{' '}
                    </div>

                </div>

              )}
          </div>

        </div>
      
    </div>
  )
}

export default Feature
