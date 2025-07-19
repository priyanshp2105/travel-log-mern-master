import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {MdAdd} from 'react-icons/md';
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories,setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [filterType, setFilterType] = useState('');

  const [dateRange, setDateRange] = useState({from:null , to:null});

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
        if(error.response.status === 401)
        {
            //Clear Storage if unauthorized
            localStorage.clear();
            navigate("/login"); // Redirect to login
        }
    }
  };

  //Get all Travel Stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
    }
  };
  
  //Handle Edit Story Click
  const handleEdit = (data) => {
    setOpenAddEditModal({isShown: true , type : "edit",data: data});
  };

  //Handle TravelStory Click
  const handleViewStory = (data) => {
    setOpenViewModal({isShown: true, data });
  };

  //Handle Update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id; // Fixed the space in "_id"
  
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
  
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories(); // Refresh the stories after updating
      }

      if(filterType === "Search" && searchQuery) {
        onSearchStory(searchQuery);
      }
      else if (filterType === "date") {
        filterStoriesByDate(dateRange);
      }
      else {
        getAllTravelStories();
      }
    } catch (error) {
    }
  };
  
  //Delete Story
  const deleteTravelStory = async(data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if(response.data && !response.data.error)
      {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({...prevState,isShown: false}));
        getAllTravelStories();
      }
    }
    catch (error) {
    }
  };

  //Search Story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if(response.data && response.data.stories)
      {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    }
    catch (error) {
  }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  //Handle Filter Travel Story by date
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null; // Fixed valueOf() typo
      const endDate = day.to ? moment(day.to).valueOf() : null; // Fixed valueOf() typo
  
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
  
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
    }
  };
  

  //Handle Date Range Select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({from: null, to:null});
    setFilterType("");
    getAllTravelStories();

  };
  // Fetch user info when component mounts
  useEffect(() => {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto py-10">

        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />
        <div className="flex gap-7">
            <div className="flex-1">
              {allStories.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allStories.map((item) => {
                    return (
                      <TravelStoryCard
                        key={item._id}
                        imgUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                        />
                    );
                  })}
                  </div>
              ) : (
                <EmptyCard message={getEmptyCardMessage(filterType)} />
              )}
            </div>
                
              <div className="w-[340px]">
                <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
                <div className="p-3">
                  <DayPicker
                    captionLayout="dropdown-buttons"
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDayClick}
                    pageNavigation
                    />
                </div>
              </div>
            </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
        type={openAddEditModal.type}
        storyInfo={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({isShown: false, type: "add", data: null});
        }}
        getAllTravelStories={getAllTravelStories}
        />
        </Modal>

        {/* View Travel Story Model */}
        <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory storyInfo={openViewModal.data || null} 
        onClose={() => {
          setOpenViewModal((prevState) => ({ ...prevState, isShown: false}));
        }}
        onEditClick={() => {
          setOpenViewModal((prevState) => ({ ...prevState, isShown: false}));
          handleEdit(openViewModal.data || null);
        }}
        onDeleteClick={() => {
          deleteTravelStory(openViewModal.data || null);
        }}
        />
      </Modal>


      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-700 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>


      <ToastContainer />
    </>
  );
};

export default Home;
