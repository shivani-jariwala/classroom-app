## Classroom App

 **Virtual classroom that has two users:**

 - Tutor
 - Student

 **And has the following functionalities :**
 
 - Assignments are the work assigned to students by the tutor.
 - Assignment can only be created, updated and deleted by the tutor
 - The assignment consists of description, list of students, published at
   and a deadline date
 - Assignment published at is a date-time field at which the assignment
   needs to be published, if the assignment is scheduled for future then
   its status is SCHEDULED else ONGOING.
 - A student can add only one submission for an assignment.
 - A submission consists of a remark which will be a text field.
 - If a student has added any submission for an assignment, then the
   status of the assignment for that student gets updated to
   SUBMITTED

 ## API Contracts

 ---

 #### SERVER URL -> https://toddle-class.herokuapp.com

 ---

 GET /
 
 - opens the root route of the project

 #### URL params

 None

 #### Headers

 None

 #### Data params

 None

 #### Content

```
 {
   msg: "Welcome to toddle assignment mainframe api"
 }
```

---

### _Auth Endpoints_

- Authentication library - jwt
- Role based auth used -> Route accessibility table
 ```
 tutor                |    student
 -----------------------|--------------------
 Add assignment         | Assignment feed
 Update assignment      | Submit assignment 
 Delete assignment      | Get Assignment details
 Assignment feed        | 
 Get Assignment details |
 ```

 ---

 POST /auth/login/
 
 - logs in the user
 - Open route. Can be accessed by anyone

 #### URL params
 
 None
 
 #### Headers
 
 None
 
 #### Data params
 
 ```
 {
    email: String,
    password: String
 }
 ```
 
 #### Content

 - Success Response

 ```
 {
    status: 200,
    data: {
              message: success,
              token: String
          }
 }
 ```

 ---

 ### _Restricted API Endpoints_

 POST /assignment/create/
 
 - Only Tutor cann add an assignment

 #### URL params
 
 None
 
 #### Headers
 
 `authorization: JWT <token>`
 
 #### Data params
 
 ```
 {
    "id": Integer,
    "studentIds": [String],
    "description": Text,
    "publishedAt": Date,
    "deadline": Date
 }
 ```
 
 #### Content

 - Successful Response

 ```
 {
    "status": 200,
    "data": {
        "message" : "success"
    }
}
 ```

 --- 

 PATCH /assignment/update/:id

 - Only tutor is allowed to make this request

 #### URL params
 
 - Assignment ID
 
 #### Headers

 `authorization: JWT <token>`
 
 #### Data params

 ```
 {
    "student_ids": [String],
    "description": String,
    "publishedAt": Date,
    "deadline": Date
 }
 ```
 
 #### Content
 
 ```
 {
    "status": 200,
    "data": {
        "message" : "success"
    }
}
 ```
--- 

 DELETE  /assignment/delete/

 - Only Tutor is allowed to make this request

 #### URL params
 
 - Assignment ID
 
 #### Headers

 `authorization: JWT <token>`
 
 #### Data params
 
 None
 
 #### Content

 ```
 {
    status: 200,
    data: {
        "message":"success"
    }
 }
 ```
 --- 

 GET /user/fetch_all/

 - Both tutor and Student can make the request.
 - Hit by a student will return the submission made by the student.
 - Hit by the tutor will return all the assignments created by the tutor.
 - Has two filters namely **publish** and **status**.
 - Publish can be applied on both tutor and student.
 - While status can be applied only on the student.

 #### URL params
 
 None
 
 #### Headers

 `authorization: Bearer <token>`
 
 #### Data params
 
 ```
 {
    publish: "String", // [SCHEDULED, ONGOING]
    status: String, // [ALL, PENDING, OVERDUE, SUBMITTED]
 }
 ```
 
 #### Content

 - Success Response

 ```
 {
    status: 200,
    data: [
             {
                id: Integer,
                student_ids: [String], // Array of student ids that are assigned the assignment.
                tutor_id: String, // tutor id 
                description: String,
                published_at: Date,
                deadline: Date,
                created_at: Date,
                updated_at: Date,
                deleted_at: Date
             }
          ]
 }
 ``` 

 --- 
 
 POST /user/submit/

 - Can only be made by the Student
 - Will only be allowed to make a submission if that assignment has been assigned to the student.

 #### URL params
 
 None
 
 #### Headers

 `authorization: JWT <token>`
 
 #### Data params
 
 ```
 {
    assignmentId: Integer,
    remark: String
 }
 ```
 
 #### Content

 - Success Response

 ```
    status: 200,
    data: {
        "message" : "success"
    }
 ```

 --- 
 
 GET /user/fetch_assignment_details/:id

 - Both the student and the tutor could make this request
 - For Student, the api will return the submission made for the respective assignment
 - For Tutor, the api will return all the submissions made for the respective assignment

 #### URL params
 
 - Assignment ID
 
 #### Headers

 `authorization: JWT <token>`
 
 #### Data params
 
 None
 
 #### Content

 ```
 {
    submissionRemark: String,
    assignmentDesc: String,
    assignmentPublishedAt: Date,
    assignmentDeadline: Date,
    studentEmail: String
 }
 ```
