import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  handleDescriptionChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  return (
    <>
      {values  && 
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="red">
                * 
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
      
          <div className="form-group">
            <textarea
              name="description"
              cols="7"
              rows="7"
              maxLength={200}
              value={values.description}
              placeholder='Description (maximum 200 characters)'
              className="form-control"              
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
      
          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={values.free}
                  onChange={(v) => setValues({ ...values, free: !values.free })}
                >
                  <Option value={true}>Free</Option>
                </Select>
              </div>
            </div>
          </div>
      
          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>
      
            {preview &&  (
              <Badge 
                count='X'
                onClick={handleImageRemove}
                className='pointer'
              >
                <Avatar width={200} src={preview}/>
              </Badge>
            )}
            
            {editPage && values.image && <Avatar width={200} src={values.image.Location}/>}
          </div>
      
          <div className="form-group">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            />
          </div>
      
          <div className="form-row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={!values.name || values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
      </form>  
      }
    </>
  );
};

export default CourseCreateForm;