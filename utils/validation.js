import { toast } from "react-toastify";

export const validateLogin = (email, password) => {
  //Email pattern
  const pattern = new RegExp(/^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);      
  if (!email)
    toast('Email is required', {autoClose: 8000})
  
  else if(!pattern.test(email))
    toast('Email should be of the form user@example.com', {autoClose: 8000})
  
  else if(!password)
    toast('Password is required', {autoClose: 8000})  

  else
      return true;
}

export const validateSubmit = (email, name, password) =>{
    //Email pattern
    const pattern = new RegExp(/^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);      
    if(!name)
      toast('Name is required', {autoClose: 8000})

    else if(!password)
      toast('Password is required', {autoClose: 8000})
    
    else if(password.length < 6)
      toast('Password should be longer than 6 characters', {autoClose: 8000})
    
    else if(!pattern.test(email))
      toast('Email should be of the form user@example.com', {autoClose: 8000})

    else
        return true;
}

export const validateImageFile = (file) => {
  //console.log({file})
  try{
    //Array of allowed files
    const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif']
    const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    const allowed_file_size = 2
    // console.log(file.name)
    //Get the extension of the uploaded file
    const file_extension = file.name.split('.').filter(Boolean).slice(1).join('.')
    // console.log(file_extension)
    // console.log(file.type)

    //Check if the uploaded file is allowed
    if(!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(file.type)){    
      toast('File is not valid. Please ensure it is a valid image file', {autoClose: 8000})
      return false
    }

    else if((file.size / (1024 * 1024)) > allowed_file_size){
      toast('File is too large. Image should be less than 2MB', {autoClose:8000})
      return false
    }

    else{
      return true
    }
  }
  catch(err){
    toast('An error occurred. Please try again later', {autoClose:8000})
  }
}

export const validateVideoFile = (file) =>{
  // console.log({file})
  try{
    //Array of allowed files
    const array_of_allowed_files = ['mp4', 'mkv', 'mov', 'avi']
    const array_of_allowed_file_types = ['video/mp4', 'video/mkv', 'video/mov', 'video/avi']
    const allowed_file_size = 300
    // console.log(file.name)
    //Get the extension of the uploaded file
    const file_extension = file.name.split('.').filter(Boolean).slice(1).join('.')
    // console.log(file_extension)
    // console.log(file.type)

    //Check if the uploaded file is allowed
    if(!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(file.type)){    
      toast('Invalid file. Please upload a video', {autoClose: 8000})
      return false
    }
    
    else if((file.size / (1024 * 1024)) > allowed_file_size){
      toast('File is too large. Video should be less than 300MB', {autoClose:8000})
      return false
    }
    
    else{
      return true
    }
  }
  catch(err){
    toast('An error occurred. Please try again later', {autoClose:8000})
  }
}