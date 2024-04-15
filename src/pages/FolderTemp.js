import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiDocumentArrowUp } from "react-icons/hi2";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaTimes } from 'react-icons/fa';
import { BsQuestionCircle } from "react-icons/bs";
import "../pages/folderttemp.css";
import { CiMenuKebab } from "react-icons/ci";
import { Navigate, useNavigate } from 'react-router-dom';
import { SlOptionsVertical } from "react-icons/sl";


const FolderTemp = () => {

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };


  const [showForm, setShowForm] = useState(false);
  const [tempName, setTempName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);


  const handleCreateTemplate = () => {
    setShowForm(true);
  };

  const handleSaveTemplate = async () => {
    // Check if the template name is empty
    if (tempName.trim() === '') {
      // Display a toast error message if the template name is empty
      toast.error("Template name cannot be empty");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempName
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8080/common/folder", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Display success toast
        toast.success("Template saved successfully");
        // Reset the form
        setShowForm(false);
        setTempName('');
      })
      .catch((error) => {
        console.error(error);
        // Display error toast
        toast.error("Failed to save template");
      });
      
        setTimeout(() => {
          window.location.reload();
        }, 1000);
     
  };
  const handleCancel = () => {
    setShowForm(false);
    setTempName('');
  };





  //get all templateName Record 
  const [folderTemplates, setFolderTemplates] = useState([]);

  useEffect(() => {
    async function fetchFolderTemplates() {
      try {
        const response = await fetch('http://127.0.0.1:8080/common/folder');
        if (!response.ok) {
          throw new Error('Failed to fetch folder templates');
        }
        const data = await response.json();
        setFolderTemplates(data.folderTemplates);
      } catch (error) {
        console.error('Error fetching folder templates:', error);
      }
    }

    fetchFolderTemplates();
  }, []);




 








  //documents Upload

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };



  const handleButtonClick = () => {
    fileInputRef.current.click();
    folderInputRef.current.click();
  };


  //folder Upload
  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.files[0]);
  };

  const handleUploadFolder = async () => {
    if (!selectedFolder) {
      alert('Please select a folder to upload');
      return;
    }
  }





  //create folder

  const [folderName, setFolderName] = useState("");

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };




  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };


  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenufolder = (menuId) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  const handleCreateFolder = () => {
    // Handle create folder action
  };

  const handleEditFolder = () => {
    // Handle edit folder action
  };

  const handleDeleteFolder = () => {
    // Handle delete folder action
  };


  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
  };

  const handleEdit = (_id) => {
    // Implement logic for editing here
    // console.log("Edit action triggered for template id: ", templateId);
    navigate('FoldertempUpdate/'+_id)
  };


//delete template
const handleDelete = (_id) => {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow"
  };

  fetch("http://127.0.0.1:8080/common/folder/" + _id, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);
      toast.success('Item deleted successfully');
    })
    .catch((error) => {
      console.error(error);
      toast.error('Failed to delete item');
    })
    .finally(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
};

///Folderstructure
const [tempvalues, setTempValues] = useState();
const [foldersvalue, setfoldervalue] = useState();
const [tempNameNew, setTempNameNew] = useState();
const [templateData, setTemplateData] = useState(null);



useEffect(() => {


  getfolders();

}, []);


const getfolders = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8080/common/folder-structure/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();


    // console.log('Fetched data:', data);
    setTemplateData(data)
   
  setfoldervalue(data.folderStructure)
    tempallvalue()

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


console.log(foldersvalue)


const [selectedFolderget, setSelectedFolderget] = useState(null);


const handleFolderClick = (folderName) => {
  if (selectedFolderget === folderName) {
    setSelectedFolderget(null); // Hide children if folder is already selected
  } else {
    setSelectedFolderget(folderName); // Show folder name data
  }
};

const tempallvalue=()=>{
  setTempNameNew(tempvalues)
    }

    const itemsPerPage = 2;
const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(folderTemplates.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, folderTemplates.length);
    const currentTemplates = folderTemplates.slice(startIndex, endIndex);
    

  return (
    <div className="container">
      <h1>Folder Template</h1>
      <div className="button-container">
        {!showForm &&
          <div>
            <button onClick={handleCreateTemplate}>Create Template</button>
            <table>
              <th>Name</th>
              <th></th>
              <tbody>
                {currentTemplates.map(template => (
                  <tr key={template._id}>
                    <td onClick={() => handleEdit(template._id)} style={{cursor:"pointer",color:'blue'}} >{template.templatename}</td>

                    <td>
              <div className="ci-menu-kebab" onClick={() => toggleMenu(template._id)} style={{cursor:'pointer',fontSize:'20px'}} >
                &#8942; 
              </div>
              {openMenuId === template._id && (
                <div className="menu-options">
                  <div onClick={() => handleEdit(template._id)} style={{color:'blue',cursor:'pointer'}}>Edit</div>
                  <div onClick={(txt) => handleDelete(template._id)} style={{color:'red',cursor:'pointer'}}>Delete</div>
                </div>
              )}
            </td>
                      {/* <button style={{background:'none',color:'blue'}}><CiMenuKebab /></button>
                      onClick={()=>{ViewRegister(template._id)}}  */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
  <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
    Previous
  </button>
  <span> Page {currentPage} of {totalPages} </span>
  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
    Next
  </button>
</div>

          </div>
        }
      </div>
      {showForm && (

     
          <div >
          
            <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Template Name "
          />

          <div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button style={{ background: 'none', color: 'black' }} onClick={handleButtonClick}><HiDocumentArrowUp />Upload Documents </button>
            <input
              type="folder"
              directory=""
              webkitdirectory=""
              ref={folderInputRef}
              style={{ display: 'none' }}
              onChange={handleFolderChange}
            />
            <button style={{ background: 'none', color: 'black' }} onClick={handleButtonClick}><MdOutlineDriveFolderUpload />Upload Folder</button>


            <button style={{ background: 'none', color: 'black' }} onClick={toggleSidebar}><FaRegFolderClosed />Create Folder</button>
            {showSidebar && (
              <div className="sidebarfolder" >
                <span className="close-icon" onClick={closeSidebar}>
                  <FaTimes />
                </span>

                Create Folder
                <div>
                  <label>Folder Name</label>
                  <input type="text" value={folderName} onChange={handleInputChange} />
                </div>

                <div>
                  <span>Privacy
                  </span><BsQuestionCircle />


                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Private"
                        checked={selectedOption === "Private"}
                        onChange={() => handleOptionChange("Private")}
                      />
                      Private
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="Client Can View"
                        checked={selectedOption === "Client Can View"}
                        onChange={() => handleOptionChange("Client Can View")}
                      />
                      Client Can View
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="Client Can View and edit"
                        checked={selectedOption === "Client Can View and edit"}
                        onChange={() => handleOptionChange("Client Can View and edit")}
                      />
                      Client Can View and edit
                    </label>
                    <p>{selectedOption ? `Selected: ${selectedOption}` : 'No option selected'}</p>
                  </div>



                </div>

                <div>
                  <button onClick={handleCreateFolder}>save</button>
                  <button onClick={closeSidebar}>Cancel</button>
                </div>
              </div>

            )}


          </div>

          <div>
        {foldersvalue?
        foldersvalue.map((folder, index) => (
        <div key={index}>
          <div onClick={() => handleFolderClick(folder.name)}>
         
    
      
           
           
        
   
          <table>
            
        <tbody>
          <tr>
          
            <td> {selectedFolderget === folder.name ? folder.name :  folder.name }</td>
   
            <td>
          <div className="ci-menu-kebab" onClick={() => toggleMenufolder('folderMenu1')} style={{cursor:'pointer',fontSize:'20px'}} >
            &#8942; 
          </div>
          {openMenuId === 'folderMenu1' && ( 
            <div className="menu-options">
              <div onClick={handleCreateFolder} style={{color:'blue',cursor:'pointer'}}>Create Folder</div>
              <div onClick={handleEditFolder} style={{color:'blue',cursor:'pointer'}}>Edit</div>
              <div onClick={handleDeleteFolder} style={{color:'red',cursor:'pointer'}}>Delete</div>
            </div>
          )}
        </td>
     
          </tr>
  
        </tbody>
      </table>
           
          
         
      
   


       
    
          </div>
          {selectedFolderget === folder.name && folder.children.length > 0 && (
            <div>
              {folder.children.map((child, childIndex) => (
                <div key={childIndex}>{child.name}</div>
              ))}
            </div>
          )}
        </div>
      )):null}
        </div>



          <button onClick={handleSaveTemplate}>Save & Exit</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}


export default FolderTemp;
