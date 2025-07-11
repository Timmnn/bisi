import { diff } from 'json-diff-ts'

const oldData = { name: 'Luke', level: 1, skills: ['piloting', 'force'] }

const newData = {
  name: 'Luke Skywalker',
  level: 5,
  skills: ['piloting', 'x', 'force'],
}

oldData.skills = oldData.skills.sort()
newData.skills = newData.skills.sort()

// Calculate differences
const changes = diff(oldData, newData)
console.log(JSON.stringify(changes, null, 2))
