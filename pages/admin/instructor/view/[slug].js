import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import AdminRoute from "../../../../components/routes/AdminRoute"
import { Avatar, Button} from "antd";
import {toast} from 'react-toastify'
import { FireOutlined, InfoOutlined,FlagOutlined, EditOutlined } from "@ant-design/icons";

const InstructorView = () => {
    
    //This section toggles the show password
    const [passwordShown, setPasswordShown] = useState(false);
    
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    }
    
    const [instructor, setInstructor] = useState({})

    const router = useRouter()
    const {slug} = router.query;

    useEffect(() => {
        loadInstructor()
    }, [slug])

    const loadInstructor = async () => {
        const { data } = await axios.get(`/instructor/${slug}`)
        setInstructor(data)
    }

    const handleDeleteInstructor = async () => {
        const {data} = await axios.delete(`/instructor/delete/${slug}`)
        setInstructor(data)
        toast(`Great! You have successfully deleted ${slug}`, {autoClose: 8000})
        router.push(`/admin`)
    }

    console.log(instructor,'instructor details')

    return (
        <AdminRoute>
            <div className="container-fluid pt-3">
                {
                    instructor && (
                        <div className="user">
                            <div className="container profile">
                                <div className="user-details row">
                                    <div className="col-md-2 item-left">
                                        <Avatar         
                                            className='icon'           
                                            size={100}
                                            // icon={<UserOutlined/>}
                                            src={instructor.image ? instructor.image.Location : "/course.png"}
                                        />                    
                                    </div>
                                    
                                    <div className="col-md-4 item-right">
                                        <h1>{instructor.name}</h1>
                                        <div className="row">
                                            {/* <h5>Created by admin</h5>                        */}
                                        </div>                    
                                    </div>

                                    <div className="col-md-3 save-button">
                                        <Button className='btn' type='primary'
                                                    onClick={() => router.push(`/admin/instructor/edit/${slug}`)}
                                        >Update</Button>
                                        <Button className='btn' type='primary' danger onClick={handleDeleteInstructor}>Delete</Button>
                                    </div>

                                </div>  

                                <form>
                                    <div className="form-group row">                                   
                                        <label htmlFor="" className='col-md-2 col-form-label'>Username:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={instructor.name}/>
                                        </div>
                                    </div>
                                
                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Email:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={instructor.email}/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Password:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item" id='passwd'>
                                            <input type={passwordShown ? 'text' : 'password'}  className='form-control-plaintext' value={instructor.password}/>
                                            <Button className='btn'  onClick={togglePassword}>Show</Button>                        
                                        </div>                    
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Age:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={instructor.age}/>                        
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Country:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={instructor.country}/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Created By:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={instructor.instructor?.name}/>
                                        </div>
                                    </div>                            
                                </form>
                            </div>
                        </div>
                        
                    )
                }
            </div>
        </AdminRoute>
    )
}

export default InstructorView