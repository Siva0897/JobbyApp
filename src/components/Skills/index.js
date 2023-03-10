import './index.css'

const Skills = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails

  return (
    <li className="skill">
      <img src={imageUrl} alt={name} className="skill-img" />
      <p>{name}</p>
    </li>
  )
}

export default Skills
