import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from './Card'
import Pagination from './Pagination'

const Franchises = () => {
  const [ franchisesArray, setFranchisesArray ] = useState()
  const [ filteredFranchises, setFilteredFranchises ] = useState()
  const [ inputValue, setInputValue ] = useState('')
  const [ activeState, setActiveState ] = useState('all')
  //Pagination
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ postsPerPage, setPostsPerPage ] = useState(6);
  const [ filteredItemsQty, setFilteredItemsQty ] = useState(100)

  const baseUrl = 'http://localhost:8000'
  // const currBaseUrl = window.location.href

  const lastPostIndex = currentPage * postsPerPage // 1 * 6 = 6
  const firstPostIndex = lastPostIndex - postsPerPage // 6 - 6 = 0

  // Load Data at document loading
  useEffect( () => {
    axios.get(`${baseUrl}/franchise/franchise_json`)
      .then(response => {
        console.log('Initial Data: ', response.data)
        setFranchisesArray(response.data.franchisesArray)
        setFilteredFranchises(response.data.franchisesArray.slice(firstPostIndex, lastPostIndex))
        setFilteredItemsQty(response.data.franchisesArray.length)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  const handleClick = (e) => {
    setActiveState(e.target.id)
    let parent = e.currentTarget.parentElement
    console.log(parent)
    let children = parent.children
    console.log(children)
    for(let child of children) {
      child.classList.remove('filter-active')
    }
    e.target.classList.add('filter-active')
  }
  
  const handleInputField = (e) => {
    setInputValue(e.target.value)
  }

  useEffect( () => {
    let dataByInput
    if(inputValue) {
      dataByInput = franchisesArray?.filter( (fr, k) => {
        return ( (fr.email.includes(inputValue)) || (fr.email_perso.includes(inputValue)) || (fr.name.includes(inputValue)))
      })
    } else {
      dataByInput = franchisesArray
    }
    console.log('Data by input:', dataByInput)

    let dataByActiveState
    if(activeState === 'active'){
      dataByActiveState = dataByInput?.filter( (fr, k) => {
        return fr.isActive === true
      })
      console.log("X :", dataByActiveState?.length)
      setFilteredItemsQty(dataByActiveState?.length)

    } else if(activeState === 'non-active') {
      dataByActiveState = dataByInput?.filter( (fr, k) => {
        return fr.isActive === false
      })
      console.log("X :", dataByActiveState?.length)
      setFilteredItemsQty(dataByActiveState?.length)
    } else {
      dataByActiveState = dataByInput
      console.log("X :", dataByActiveState?.length)
      setFilteredItemsQty(dataByActiveState?.length)
    }

    const currentPosts = dataByActiveState?.slice(firstPostIndex, lastPostIndex)

    setFilteredFranchises(currentPosts)
    //setFilteredFranchises(dataByActiveState)
  }, [activeState, inputValue, currentPage])

  return (
    <>
      <div>
        <ul className='d-flex flex-row justify-content-center active-filter'>
          <li onClick={handleClick} className="filter-active" id="all">All</li>
          <li onClick={handleClick} className="" id="active">Active</li>
          <li onClick={handleClick} className="" id="non-active">Non Active</li>
        </ul>
      </div>

      <div className="input-group mb-3">
        <input 
          id="form-input"
          type="search" 
          className="form-control" 
          placeholder="Entrez le(s) mot(s) clé(s)..." 
          aria-label="Username" 
          aria-describedby="basic-addon1" 
          onChange={handleInputField}
        />
        <span className="input-group-text bg-primary text-white" id="basic-addon1"><i className="bi bi-search"></i></span>
      </div>

      <section>
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {
          filteredFranchises?.map( (franchise, key) => {
            return(
              <Card
                key={key}
                franchiseId={franchise.id}
                franchiseName={franchise.name}
                franchiseEmail={franchise.email}
                franchiseEmailPerso={franchise.email_perso}
                permissions={franchise.permissions}
                franchiseDate={franchise.date}
                franchiseIsActive={franchise.isActive}
                franchiseImage={franchise.image}
                franchiseDescription={franchise.description}
              />
            )
          })
        }
        </div>
      </section>
      <nav className='pagination-section d-flex justify-content-center'>
        {
          filteredItemsQty > 6 ? (
            <Pagination 
            totalPosts={franchisesArray?.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
          ) : ''
        }
      </nav>
    </>
  )
}

export default Franchises