import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiSearch} from 'react-icons/bi'
import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsList: [],
    searchInput: '',

    minimumPackage: '',
    search: '',
    checkboxList: [],
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    const {minimumPackage, search, checkboxList} = this.state
    const employmentType = checkboxList.join(',')
    console.log(employmentType)
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookie.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`

    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const {jobs} = data
      const updatedJobs = jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: [...updatedJobs],
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getProfileDetails = async () => {
    this.setState({
      profileApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookie.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedProfileDetails = {
        profileImageUrl: profileDetails.profile_image_url,
        name: profileDetails.name,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: {...updatedProfileDetails},
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  profileSuccess = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, shortBio, name} = profileDetails
    return (
      <div className="profile-success-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  profileFailure = () => (
    <div className="profile-fail-load-container">
      <button type="button" className="retry-btn">
        Retry
      </button>
    </div>
  )

  updateCheckboxInputState = async event => {
    const {checkboxList} = this.state
    const selectedValue = event.target.value
    if (checkboxList.includes(selectedValue)) {
      const filteredResult = checkboxList.filter(each => each !== selectedValue)

      await this.setState({checkboxList: [...filteredResult]})
    } else {
      await this.setState({checkboxList: [...checkboxList, selectedValue]})
    }
    this.getJobs()
  }

  onRadioButtonClick = async event => {
    await this.setState({minimumPackage: event.target.value})
    this.getJobs()
  }

  renderTypeOfEmployment = () => (
    <>
      <h1 className="emp-type-title">Type of Employment</h1>
      {employmentTypesList.map(each => (
        <>
          <input
            type="checkbox"
            className="input"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            onClick={this.updateCheckboxInputState}
          />
          <label htmlFor="fulltime">{each.label}</label>
          <br />
          <br />
        </>
      ))}
    </>
  )

  renderSalaryRange = () => (
    <>
      <h1 className="emp-type-title">Salary Range</h1>
      {salaryRangesList.map(each => (
        <>
          <input
            type="radio"
            name="salary"
            className="input"
            id={each.salaryRangeId}
            value={each.salaryRangeId}
            onClick={this.onRadioButtonClick}
          />
          <label htmlFor="fulltime">{each.label}</label>
          <br />
          <br />
        </>
      ))}
    </>
  )

  renderLoadingView = () => (
    <div className="profile-fail-load-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.profileSuccess()
      case apiStatusConstants.failure:
        return this.profileFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  jobsSuccess = () => {
    const {jobsList} = this.state
    if (jobsList.length !== 0) {
      return (
        <ul className="job-card-container">
          {jobsList.map(each => (
            <JobCard jobDetails={each} key={each.id} />
          ))}
        </ul>
      )
    }
    return (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs, Try other filters.</p>
      </div>
    )
  }

  renderJobs = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.jobsSuccess()
      case apiStatusConstants.failure:
        return this.jobsFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSearchInputUpdate = event =>
    this.setState({searchInput: event.target.value})

  onSearchButtonClick = async () => {
    const {searchInput} = this.state
    await this.setState({search: searchInput})
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="bg-container">
          <div className="profile-filter-container">
            {this.renderProfile()}
            <hr />
            {this.renderTypeOfEmployment()}
            <hr />
            {this.renderSalaryRange()}
          </div>
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onSearchInputUpdate}
                className="search-input"
                placeholder="Search"
              />
              <button
                type="button"
                className="search-btn"
                onClick={this.onSearchButtonClick}
                data-testid="searchButton"
              >
                <BiSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
