import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-card-nav-link">
      <li className="job-card">
        <div className="title-section-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="description-text">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
