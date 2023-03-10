import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import Skills from '../Skills'
import SimilarJobsCard from '../SimilarJobsCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getJobDescription()
  }

  getJobDescription = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookie.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(jobApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        skills: jobDetails.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
      }
      const updatedSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobsList: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
      console.log(updatedJobDetails)
      console.log(updatedSimilarJobs)
    }
  }

  jobSuccess = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails
    const updatedLifeAtCompany = {
      description: lifeAtCompany.description,
      lifeAtCompanyImgUrl: lifeAtCompany.image_url,
    }
    return (
      <div className="job-details-container">
        <div className="title-section-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-emp-type-package-container">
          <div className="location-emp-type-container">
            <MdLocationOn className="location-emp-type-icon" />
            <p className="location-text">{location}</p>
            <BsBriefcaseFill className="location-emp-type-icon" />
            <p>{employmentType}</p>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="description-text-container">
          <h1 className="description-text">Description</h1>
          <a href={companyWebsiteUrl} className="anchor-ele">
            <p>Visit</p>
            <FiExternalLink className="nav-link" />
          </a>
        </div>
        <p>{jobDescription}</p>
        <h1 className="description-text">Skills</h1>
        <ul className="skills-container">
          {skills.map(each => (
            <Skills skillDetails={each} key={each.id} />
          ))}
        </ul>
        <h1 className="description-text">Life at Company</h1>
        <div className="life-at-company-container">
          <p>{updatedLifeAtCompany.description}</p>
          <img
            src={updatedLifeAtCompany.lifeAtCompanyImgUrl}
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <ul className="similar-jobs-container">
        {similarJobsList.map(each => (
          <SimilarJobsCard jobDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="profile-fail-load-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobItem = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.jobSuccess()
      case apiStatusConstants.failure:
        return this.jobFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-detail-bg-container">
          {this.renderJobItem()}
          <h1 className="description-text">Similar Jobs</h1>
          {this.renderSimilarJobs()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
