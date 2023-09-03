export default class APIService{
    static Register(body){
        return fetch('http://127.0.0.1:8000/register/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(body)
        })
        .then(resp => resp.json())
    }

    static Login(body){
        return fetch('http://127.0.0.1:8000/api/token/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(body)
        })
        .then(resp => resp.json())
    }

    static UpdateProfile(id,body,token){

        return fetch(`http://127.0.0.1:8000/updateProfile/${id}/`,
        {
            'method':'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
              },
              body:JSON.stringify(body)
    
        })
        .then(resp => resp.json())
        .then(()=>window.location.reload())
    }

    static UpdateCOver(id,formData,token){
        
        return fetch(`http://127.0.0.1:8000/profile/cover/${id}/`,
        {
            method:'PUT',
            body:formData,
            headers:{
                
                'Authorization':`Bearer ${token}`
              },
            
    
        })
        .then(resp => resp.json())
        .then(()=>window.location.reload())
        
    }
}