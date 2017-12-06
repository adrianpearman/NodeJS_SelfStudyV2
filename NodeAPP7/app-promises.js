// covering the async await functionality in newer node platforms
const users = [
  {id: 1,
  name: 'Adrian',
  schoolId: 101},
  {id: 2,
  name: 'Roger',
  schoolId: 100}
]

const grades = [
  {id: 1,
  schoolId: 101,
  grade: 80},
  {id: 2,
  schoolId: 100,
  grade: 73},
  {id: 3,
  schoolId: 101,
  grade: 90},
]

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => {
      return user.id === id
    })

    if (user) {
      resolve(user)
    } else {
      reject(`Unable to find user with the id ${id}`)
    }
  })
}

const getGrades = (schoolId) => {
  return new Promise((resolve, reject) => {
    resolve(grades.filter((grade) => {
      return grade.schoolId === schoolId
    }))
  });
}

// this function takes advantage of the promise functions set in getGrades and getUser
const getStatus = (userId) => {
  let user;
  return getUser(userId).then((tempUser) => {
    user = tempUser
    return getGrades(user.schoolId)
  }).then((grades) => {
    let average = 0;

    if (grades.length > 0) {
      average = grades.map((grade) => {
        return grade.grade
      }).reduce((a,b) => {
        return a + b
      }) / grades.length
    }

    return `${user.name} has a ${average}% in the class`
  })
}

// refactored version of the getStatus function using the async await functionality
const getStatusAlt = async (userId) => {
  const user = await getUser(userId)
  const grades = await getGrades(user.schoolId)
  // due to when it's called. the error will be called
  // throw new Error('ERROR')
  // return 'Mike'
  let average = 0;

  if (grades.length > 0) {
    average = grades.map((grade) => {
      return grade.grade
    }).reduce((a,b) => {
      return a + b
    }) / grades.length
  }

  return `${user.name} has a ${average}% in the class`
}



getUser(2).then((user) => {
  console.log(user);
}).catch((error) => {
  console.log(error);
})

getGrades(101).then((grades) => {
  console.log(grades);
}).catch((error) => {
  console.log(error);
})

getStatus(1).then((status) => {
  console.log(status);
}).catch((error) => {
  console.log(error);
})

getStatusAlt(2).then((name) => {
  console.log(name);
}).catch((error) => {
  console.log(error);
})
