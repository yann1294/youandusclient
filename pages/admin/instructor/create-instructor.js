import { useState } from "react";
import axios from "../../../api/axios";
import {useRouter} from 'next/router'
import InstructorCreateForm from "../../../components/forms/InstructorCreateForm";
import AdminRoute from "../../../components/routes/AdminRoute";
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import { validateImageFile, validateSubmit } from "../../../utils/validation";

const InstructorCreate = () => {
     // state
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    image: {},
    uploading: false,
    loading: false,
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload image')

  // router
  const router = useRouter()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  const handleImage = (e) => {
    let file = e.target.files[0]
    
    //Validate the file to ensure it's a correct format
    if(validateImageFile(file)){
      setPreview(window.URL.createObjectURL(file))
      setUploadButtonText(file.name)
      setValues({...values, loading: true})

      // resize
      Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async(uri)=>{
        try {
          let {data} = await axios.post(`/instructor/upload-image`,{
            image: uri,
          })
          console.log('IMAGE UPLOADED', data)
          // set image in the state
          setImage(data)
          setValues({...values, loading: false})
        } catch (error) {
          console.log(error)
          setValues({...values, loading: false})
          toast('Image upload failed. Try later.', {autoClose: 8000})
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
      const res = await axios.post(`/instructor/remove-image`,{image})
      setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      setValues({...values, loading: false})
    } catch (error) {
        console.log(error)
        setValues({...values, loading: false})
        toast('Remove Image upload failed. Try later.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {  
      if(validateSubmit(values.email, values.name, values.password)){
        const {data} = await axios.post(`/make-instructor`,{
          ...values,
          image,
          })         
        
          toast('Great! Now you have successfully created an Instructor')
          router.push('/admin')
      }
    } catch (error) {              
      toast('Error validating the data', {autoClose: 8000})
    }
  };

    return (
        <AdminRoute>
            <h1 className="jumbotron text-center square">Create Instructor</h1>
            <div className="pt-3 pb-3">
                <InstructorCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                />
            </div>
        </AdminRoute>
    )
}

export default InstructorCreate