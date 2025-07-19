import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";
import moment from "moment";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {

  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);

  const [error, setError] = useState("");

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;  // Get the story ID
  
    try {
      // Prepare the data to update the travel story
      let postData = {
        title,
        story,  // Assuming 'story' is the description you're editing
        imageUrl: storyInfo.imageUrl || null,  // Use the existing image URL if available
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()  // Convert date to timestamp if provided
          : moment().valueOf(),  // Default to current time if no date is provided
      };
  
      // Check if a new image is provided for upload
      if (storyImg && typeof storyImg === 'object') {
        // Upload the new image
        const imgUploadsRes = await uploadImage(storyImg);
  
        // If image upload succeeds, update the image URL in postData
        postData.imageUrl = imgUploadsRes.imageUrl || storyInfo.imageUrl;
      }
  
      // Make a PUT request to update the travel story
      const response = await axiosInstance.put("/edit-story/" + storyId, postData);
  
      // Handle the response after a successful update
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        
        // Refresh the list of travel stories
        getAllTravelStories();
  
        // Close the modal or form after update
        onClose();
      }
    } catch (error) {
      // Error handling
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);  // Show specific error message
      } else {
        setError("An unexpected Error Occurred. Please try again.");  // Generic error message
      }
    }
  };
  

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      //Upload image if Present
      if(storyImg) {
        const imgUploadsRes = await uploadImage(storyImg);
        //Get image URL
        imageUrl = imgUploadsRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        //Refresh Stories
        getAllTravelStories();
        //Close modal or form
        onClose();
      }
    } catch (error) 
    {
      if (error.response && error.response.data && error.response.message)
        {
          setError(error.response.data.message);
        } else {
          setError("An unexpected Error Occured. Please try again.");
        }
    }
  };
 
    const handleAddOrUpdateClick = () => {

      if(!title) {
        setError("Please enter the title");
        return;
      }

      if(!story) {
        setError("Please enter the story");
        return;
      }

      setError("");

      if(type === "edit") {
        updateTravelStory();
      } else {
        addNewTravelStory();
      }
    };

    //Delete story image and Update the story
    const handleDeleteStoryImg = async () => {
      //deleteing the image
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: {
          imageUrl: storyInfo.imageUrl,
        },
      });

      if(deleteImgRes.data) {
        const storyId = storyInfo._id;

        const postData = {
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "",
        };

        //Updating story
        const response = await axiosInstance.put(
          "/edit-story/" + storyId, postData );
          setStoryImg(null);
      }
    };


  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                {type === 'add' ? <button className="btn-small" onClick={handleAddOrUpdateClick}>
                    <MdAdd className="text-lg" /> ADD STORY
                </button> : 
                <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                    <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
                </>}

                <button
                className=""
                onClick={onClose}
                >
                    <MdClose className="text-xl text-slate-400" />
                </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
            )}
        </div>
        </div>

        <div>
            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="A Day at the Great Wall"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />

                <div className="my-3">
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />

                <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">STORY</label>
                <textarea
                  className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                  placeholder="Your Story"
                  rows={10}
                  value={story}
                  onChange={({ target }) => setStory(target.value)}
                />
                </div>

                <div className="pt-3">
                  <label className="input-label">VISITED LOCATIONS</label>
                  <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>

            </div>
        </div>

    </div>
  );
};

export default AddEditTravelStory;
