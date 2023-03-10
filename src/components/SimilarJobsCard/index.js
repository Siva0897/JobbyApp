import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobsCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    jobDescription,
    location,
    employmentType,
  } = jobDetails
  return (
    <li className="similar-job-card">
      <div className="title-section-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="similar-jobs-description-title">Description</h1>
      <p>{jobDescription}</p>
      <div className="location-emp-type-package-container">
        <div className="location-emp-type-container">
          <MdLocationOn className="location-emp-type-icon" />
          <p className="location-text">{location}</p>
          <BsBriefcaseFill className="location-emp-type-icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobsCard
