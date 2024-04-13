import React, { useState, useEffect } from "react";
import accounts from "./AccountDumy";
import "./accountsdata.css";
import { RiDeleteBin5Line } from 'react-icons/ri';
import DropdownMenu from './FilterDropdown';

const AccountsData = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://127.0.0.1:8080/common/contact/contactlist/list/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.contactlist);
        setContacts(result.contactlist);
      })
      .catch((error) => console.error(error));
  }, []);

  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  // Calculate index range for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, contacts.length);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  //delete template
  const handleDelete = (_id) => {

    console.log(_id)

    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8080/common/contact/" + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete item');
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);

      })
      .finally(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  };

  // Handler function to toggle selection of a contact
  const handleRecordCheckboxChange = (id) => {
    setSelectedContacts((prevSelectedContacts) => {
      if (prevSelectedContacts.includes(id)) {
        // If the ID is already in the selectedContacts array, remove it
        return prevSelectedContacts.filter((contactId) => contactId !== id);
      } else {
        // Otherwise, add the ID to the selectedContacts array
        return [...prevSelectedContacts, id];
      }
    });
  };

  const handleCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // If selectAll is false, set all accounts as selected
      const allcontactIds = contacts.map(contact => contact.id);
      console.log(allcontactIds)
      setSelectedContacts(allcontactIds);
    } else {
      // If selectAll is true, deselect all accounts
      setSelectedContacts([]);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    (contact.Name && contact.Name.toLowerCase().includes(filter.toLowerCase())) ||
    (contact.Email && contact.Email.toLowerCase().includes(filter.toLowerCase())) ||
    (contact.phoneNumber && contact.phoneNumber.some(number => number.phoneNumber && number.phoneNumber.toLowerCase().includes(filter.toLowerCase()))) ||
    (contact.companyName && contact.companyName.toLowerCase().includes(filter.toLowerCase())) ||
    (contact.Tags && contact.Tags.some(tagArray => tagArray.some(tag => tag.tagName && tag.tagName.toLowerCase().includes(filter.toLowerCase()))))
  );

  console.log(selectedContacts)

  
  // Define your columns here
  const columns = ['Client Type', 'Tags', 'Team', 'Pipeline and Stages', 'Invoices'];


  return (

    <div style={{ padding: "20px" }}>

   <div style={{ marginLeft: "20px", width: "25%", height: "10px", padding: "15px 10px", borderRadius: "20px" }}>
      <DropdownMenu columns={columns} />
      </div>

      <div style={{ position: "relative", textAlign: "right" }}>
        <input
          className="searchText"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search"
          style={{ width: "25%", height: "10px", padding: "15px 10px", borderRadius: "20px" }}
        />
      </div>

      <table className="my-table col-12 ">

        <thead>
          <tr>
            <th><input type="checkbox"   checked={selectAll}
              onChange={handleCheckboxChange} /> </th> {/* Empty header for checkbox */}
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Company Name</th>
            <th>Tags</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                <input type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleRecordCheckboxChange(contact.id)} />
              </td> {/* Checkbox column */}
              <td>{contact.Name}</td>
              <td>{contact.Email}</td>
              <td>
                {contact.phoneNumber ? (
                  contact.phoneNumber.map((number, index) => (
                    <div key={index}>{number.phoneNumber}</div>
                  ))
                ) : (
                  <span> </span>
                )}
              </td>
              <td>{contact.companyName}</td>
              <td>
                {contact.Tags && contact.Tags.map(tagArray => (
                  <div key={tagArray[0]._id}>
                    {tagArray.map(tag => (
                      <span key={tag._id} style={{fontSize:"12px", padding: "0.2rem 0.5rem", backgroundColor: tag.tagColour, color: "#fff", borderRadius: "50px", textAlign: "center", marginBottom: '5px', }}>
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                ))}
              </td>
              <td style={{ color: "red" }}> <RiDeleteBin5Line onClick={(txt) => handleDelete(contact.id)} /> </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>

  );
};

export default AccountsData;
