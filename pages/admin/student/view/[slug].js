import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import AdminRoute from "../../../../components/routes/AdminRoute"
import { Avatar, Button} from "antd";
import {toast} from 'react-toastify'
import { FireOutlined, InfoOutlined,FlagOutlined, EditOutlined } from "@ant-design/icons";


const StudentView = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    }

    const [student, setStudent] = useState({})

    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadStudent()
    }, [slug])

    const loadStudent = async () => {
        const { data } = await axios.get(`/student/${slug}`)
        setStudent(data)
    }

    const handleRemoveStudent = async () => {
        const {data} = await axios.delete(`/student/delete/${slug}`)
        setStudent(data)
        toast(`Great! You have successfully deleted ${slug}`)
        router.push(`/admin`)
    }

    console.log(student,'student details')

    return (
        <AdminRoute>
            <div className="container-fluid pt-3">
                {
                    student && (
                        <div className="user">
                            <div className="container profile">
                                <div className="user-details row">
                                    <div className="col-md-2 item-left">
                                        <Avatar         
                                            className='icon'           
                                            size={100}
                                            // icon={<UserOutlined/>}
                                            src={student.image ? student.image.Location : "/course.png"}
                                        />                    
                                    </div>
                                    
                                    <div className="col-md-4 item-right">
                                        <h1>{student.name}</h1>
                                        <div className="row">
                                            {/* <h5>Created by admin</h5>                        */}
                                        </div>                    
                                    </div>

                                    <div className="col-md-3 save-button">
                                        <Button className='btn' type='primary'
                                                    onClick={() => router.push(`/admin/instructor/edit/${slug}`)}
                                        >Update</Button>
                                        <Button className='btn' type='primary' danger onClick={handleRemoveStudent}>Delete</Button>
                                    </div>

                                </div>  

                                <form>
                                    <div className="form-group row">                                   
                                        <label htmlFor="" className='col-md-2 col-form-label'>Username:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={student.name}/>
                                        </div>
                                    </div>
                                
                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Email:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={student.email}/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Password:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item" id='passwd'>
                                            <input type={passwordShown ? 'text' : 'password'}  className='form-control-plaintext' value={student.password}/>
                                            <Button className='btn'  onClick={togglePassword}>Show</Button>                        
                                        </div>                    
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Age:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={student.age}/>                        
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Country:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={student.country}/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="" className='col-md-2 col-form-label'>Created By:</label>
                                        <span className="col-md-3"></span>
                                        <div className="col-md-4 item">
                                            <input type="text" readOnly className='form-control-plaintext' value={student.student?.name}/>
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

export default StudentView