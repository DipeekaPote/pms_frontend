import React, { useState, useRef, useEffect } from "react";
import { RiAddCircleLine } from 'react-icons/ri';
import { IoIosCloseCircleOutline } from "react-icons/io";

const AccountsData = () => {
  const [acc, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showDropdownhtml, setShowDropdownhtml] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [uniqueTags, setUniqueTags] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [showSelectTags, setShowSelectTags] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://127.0.0.1:8080/admin/account/accountdetailslist/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setAccounts(result.accountlist);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/common/tag");
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allAccountIds = acc.map(account => account.id);
      setSelectedAccounts(allAccountIds);
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleRecordCheckboxChange = (accountId) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };

  function getUniqueValues(columnName) {
    return [...new Set(acc.map(item => item[columnName]))];
  }

  const uniqueTypeValues = getUniqueValues('Type');

  const filteredAccounts = acc.filter((account) => {
    return Object.values(account).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filter.toLowerCase());
      }
      return false;
    });
  });

  useEffect(() => {
    setFilteredShortcuts(shortcuts.filter(shortcut => shortcut.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, shortcuts]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddShortcut = (shortcut) => {
    if (shortcut === "Type") {
      setInputText(shortcut)
      setShowSelect(true);
    } else if (shortcut === "Tags") {
      fetchData();
      setInputText(shortcut)
      setShowSelectTags(true);
    }
  };

  useEffect(() => {
    const FilterList = [
      { title: 'Client Type', isBold: false, value: 'Type' },
      { title: 'Tags', isBold: false, value: 'Tags' },
    ]
    setShortcuts(FilterList);
  }, [selectedOption]);

  const UserInitials = ({ username }) => {
    const initials = username
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
    return initials;
  }

  // Constants for pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAccounts.length);

  // Slice the filteredAccounts to get data for the current page
  const currentPageData = filteredAccounts.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="account-data-con" style={{ padding: "20px", position: "relative"}}>
      <div>
        <button style={{ background: "none" }} type="button" className="btn  add-shortcut-button" onClick={toggleDropdown}>
          <RiAddCircleLine className="add-shortcut-icon" /> Filter
        </button>
      </div>
      <div>
        {showSelect && inputText === "Type" ? (
          <select style={{ marginTop: "10px", width: "120px" }} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Types</option>
            {getUniqueValues('Type').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        ) : (showSelectTags && inputText === "Tags" && (
          <select style={{ margin: '40px', width: '300px' }} onChange={(e) => setFilter(e.target.value)}>
            <option selected value="">All Tags </option>
            {tags.map((tag) => {
              return (
                <option key={tag.tagName} value={tag.tagName} style={{ backgroundColor: tag.tagColour, color: "#fff", borderRadius: "20px", textAlign: "center", marginBottom: '5px' }}>
                  {tag.tagName}
                </option>
              )
            })}
          </select>
        ))}

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
            <th> <input type="checkbox" checked={selectAll} onChange={handleCheckboxChange} /></th>
            <th>Name</th>
            <th>Follow</th>
            <th>Type</th>
            <th>Invoices</th>
            <th>Credits</th>
            <th>Tasks</th>
            <th>Team</th>
            <th>Tags</th>
            <th>Proposals</th>
            <th>Unread Chats</th>
            <th>Pending Organizers</th>
            <th>Pending Signature</th>
            <th>Last Login</th>
            <th>Settings</th>
          </tr>
        </thead>
        <tbody>
          {(currentPageData.length > 0 ? currentPageData : acc).map((account) => {
            const matchesFilter =
              account.Name && account.Name.toLowerCase().includes(filter.toLowerCase()) ||
              account.Follow && account.Follow.toLowerCase().includes(filter.toLowerCase()) ||
              account.Type && account.Type.toLowerCase().includes(filter.toLowerCase()) ||
              account.Invoices && account.Invoices.toLowerCase().includes(filter.toLowerCase()) ||
              account.Credits && account.Credits.toLowerCase().includes(filter.toLowerCase()) ||
              account.Tasks && account.Tasks.toLowerCase().includes(filter.toLowerCase()) ||
              account.Team && account.Team.some(team => team.username.toLowerCase().includes(filter.toLowerCase())) ||
              account.Proposals && account.Proposals.toLowerCase().includes(filter.toLowerCase()) ||
              account.Unreadchats && account.Unreadchats.toLowerCase().includes(filter.toLowerCase()) ||
              account.Pendingorganizers && account.Pendingorganizers.toLowerCase().includes(filter.toLowerCase()) ||
              account.Pendingsignatures && account.Pendingsignatures.toLowerCase().includes(filter.toLowerCase()) ||
              account.Lastlogin && account.Lastlogin.toLowerCase().includes(filter.toLowerCase()) ||
              (account.Tags &&
                account.Tags.some(
                  (tag) =>
                    tag.tagName && tag.tagName.toLowerCase().includes(filter.toLowerCase())
                ));

            if (matchesFilter) {
              return (
                <tr key={account.id}>
                  <td>
                    <input type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleRecordCheckboxChange(account.id)} />
                  </td>
                  <td>{account.Name}</td>
                  <td>{account.Follow}</td>
                  <td>{account.Type}</td>
                  <td>{account.Invoices}</td>
                  <td>{account.Credits}</td>
                  <td>{account.Tasks}</td>
                  <td style={{ width: "90px" }}>
                    {account.Team && account.Team.map((team, index) => (
                      <div key={team.id} style={{ display: 'inline-block', marginRight: '-5px' }}>
                        <div
                          style={{
                            backgroundColor: "lightgrey", color: 'Black', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                          }} title={team.username}
                        >
                          {team.username && <UserInitials username={team.username} />}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td>
                    {account.Tags && account.Tags.map(tag => (
                      <h5 style={{ fontSize: "12px", padding: "0.2rem 0.3rem", backgroundColor: tag.tagColour, color: "#fff", borderRadius: "50px", textAlign: "center", marginBottom: '5px', }}>{tag.tagName}</h5>
                    ))}
                  </td>
                  <td>{account.Proposals}</td>
                  <td>{account.Unreadchats}</td>
                  <td>{account.Pendingorganizers}</td>
                  <td>{account.Pendingsignatures}</td>
                  <td>{account.Lastlogin}</td>
                  <td> </td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>

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
