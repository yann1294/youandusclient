import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "../../../../api/axios";
import { Avatar, Tooltip, Button, Modal , List} from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined, QuestionCircleOutlined, QuestionOutlined, CloseOutlined } from "@ant-design/icons";
import MarkDownRenderer from 'react-markdown-renderer'
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";
import { validateVideoFile } from "../../../../utils/validation";


const CourseView = () => {
  const [course, setCourse] = useState({});
  // for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/course/${slug}`);
    setCourse(data);
  };

  // FUNCTIONS FOR ADD LESSON
  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log(values);
   try{
    const {data} = await axios.post(`/course/lesson/${slug}/${course.instructor._id}`,
    values
    )
    // console.log(data)
    setValues({
      ...values,
      title: '',
      content: '',
      video: {}
    })
    if(values.title == ''){
      toast('Title must not be empty', {autoClose: 8000})
    }
    else{
      setProgress(0)
      setUploadButtonText('Upload video')
      setVisible(false)
      setCourse(data)
      toast('Lesson added', {autoClose: 8000})
    }
   }catch(err){
     console.log(err)
     toast('Lesson add failed', {autoClose: 8000})
   }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];      
      if(validateVideoFile(file)){
        toast('Video uploaded successfully')
        
        setUploadButtonText(file.name);
        setUploading(true);

        const videoData = new FormData();
        videoData.append("video", file);
        // save progress bar and send video as form data to backend
        const { data } = await axios.post(`/course/video-upload/${course.instructor._id}`, videoData, {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        });
        // once response is received
        console.log(data);
        setValues({ ...values, video: data });
        setUploading(false);
      }
      // else{
      //   toast('File unsupported. Please upload a video file', {autoClose: 8000})
      // }
      
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast("Video upload failed", {autoClose: 8000});
    }
  };

  const handleVideoRemove = async () => {
    try{
      setUploading(true)
      const {data} = await axios.post(
        `/course/video-remove/${course.instructor._id}`,
        values.video
      )
      console.log(data)
      setValues({
        ...values,
        video: {}
      })
      setUploading(false)
      setUploadButtonText('Upload another video', {autoClose: 8000})
    }catch(err){
      console.log(err)
      setUploading(false);
      toast("Video remove failed", {autoClose: 8000});
    }
  }

  const handlePublish = async (e, courseId) =>{
    try {
      let answer = window.confirm(
        'Once you publish your course, it will be live in the marketplace for users to enroll'
      )
      if(!answer) return;
      const {data} = await axios.put(`/course/publish/${courseId}`)
      setCourse(data)
      toast('Congrats! Your course is now live', {autoClose: 8000})
    } catch (error) {
      toast('Course publishing failed. Try again', {autoClose: 8000})
    }
  }

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you unpublish your course, it will not be available for users to enroll'
      )
      if(!answer) return;
      const {data} = await axios.put(`/course/unpublish/${courseId}`)
      setCourse(data)
      toast('Congrats! Your course is unpublished', {autoClose: 8000})
    } catch (error) {

      toast('Course unpublishing failed. Try again', {autoClose: 8000})
    }

  }

  return (
    <InstructorRoute>
      <div className="contianer-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>

                  <div className="d-flex pt-4">
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={
                          () => router.push(`/instructor/course/edit/${slug}`)
                        }
                        className="h5 pointer text-warning mr-4" />
                    </Tooltip>

                    {
                    course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title='Min 5 lessons required to publish'>
                        <QuestionOutlined className="h5 pointer text-danger"/>
                      </Tooltip>
                    ) : course.published ? ( <Tooltip title='Unpublish'>
                      <CloseOutlined
                      onClick={
                        (e) => handleUnpublish(e,course._id)
                      }
                      className="h5 pointer text-danger"
                      />
                    </Tooltip>
                     ) : (
                    <Tooltip title='Publish'>
                    <CheckOutlined
                    onClick={
                      (e) => handlePublish(e,course._id)
                    }
                    className="h5 pointer text-success"
                    />
                  </Tooltip>
                     )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
              <MarkDownRenderer markdown={course.description}/>
              </div>
            </div>
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
            </div>

            <br />

            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>

            <div className='row pb-5'>
              <div className='col lesson-list'>
                <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;