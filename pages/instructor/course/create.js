import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import { validateImageFile } from "../../../utils/validation";


const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    uploading: false,
    free: true,
    category: '',
    loading: false,
  });

  const [image, setImage] = useState({});

  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload image')

  // router
  const router = useRouter()

  const handleDescriptionChange = (e) =>{    
    // console.log(e.target.value.length)
    // console.log(e.target.maxLength)
    try{
      if(e.target.value.length == e.target.maxLength){
        toast('Description cannot be longer than 200 characters', {autoClose: 8000})
      }
      setValues({ ...values, [e.target.name]: e.target.value })
    }
    catch(err){
      toast('An error occurred. Please try again later', {autoClose: 8000})
    }
  }

  const handleChange = (e) => {
    try{
      setValues({ ...values, [e.target.name]: e.target.value });
    }
    catch(err){
      toast('An error occurred. Please try again later', {autoClose: 8000})
    }
  };

  const handleImage = (e) => {
    let file = e.target.files[0]
    //File validation 
    if(validateImageFile(file)){
      setPreview(window.URL.createObjectURL(file))
      setUploadButtonText(file.name)
      setValues({...values, loading: true})

      // resize
      Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async(uri)=>{
        try {
          let {data} = await axios.post(`/course/upload-image`,{
            image: uri,
          })
          console.log('IMAGE UPLOADED', data)
          // set image in the state
          setImage(data)
          setValues({...values, loading: false})
        } catch (error) {
          // console.log(error)
          setValues({...values, loading: false})
          toast('Image upload failed. Try later.')
        }
      })
    }
    // else{
    //   toast('File is not valid. Please ensure it is a valid image file', {autoClose: 8000})
    // }        
  };

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({...values, loading: true})
      const res = await axios.post(`/course/remove-image`,{image})
      setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      setValues({...values, loading: false})
      } catch (error) {
          // console.log(error)
          setValues({...values, loading: false})
          toast('Remove Image upload failed. Try later.', {autoClose: 8000})
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values)
    const {data} = await axios.post(`/course`,{
      ...values,
      image,
    })
    
    toast('Great! Now you can start adding lessons')
    router.push('/instructor')
    } catch (error) {
      if(!values.name)
        toast('Name is required', {autoClose: 8000})
      else
        // toast('An error occurred. Please try again later')  
      toast(error.response?.data, {autoClose: 8000})
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          handleDescriptionChange={handleDescriptionChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr/>
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
    </InstructorRoute>
  );
};

export default CourseCreate;