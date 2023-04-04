const HttpStatus = require("http-status-codes");
const db = require("../../db/user/get-all");
const logger = require("../../log");

exports.getAllAssignments = async (req, res) => {
  try {
    const {publishedAt, status} = req.body;
    const { userId, type } = req.user;
    logger.debug({publishedAt, status}, '[controller/user/get-all.js] [getAllAssignments] ');

    if(type === 'tutor'){
        //for tutor
        let assignments = []
        // get all assignments
        try {
            [assignments] = await db.getAllAssignments(userId);
        } catch (e) { 
            throw e;
        }
        // filter by publish status
        switch(publishedAt) {
            case 'SCHEDULED':
                return res.status(HttpStatus.OK)
                .json({
                  message: "success",
                  data : assignments && assignments.length ? assignments.filter(a => new Date() < new Date(a['published_at'])) : []
                });
            case 'ONGOING':
                return res.status(HttpStatus.OK)
                .json({
                    message: "success",
                    data : assignments && assignments.length ? assignments.filter(a => new Date(a['published_at']) <= new Date() && new Date() <= new Date(a['deadline'])) : []
                });
            default:
                return res.status(HttpStatus.OK)
                .json({
                    message: "success",
                    data : assignments && assignments.length ? assignments : []
                });
        }
    }else{
        //for student
        let submitted_assignments_list = [];
        // get all the assignments that are allotted to the student
        const [res1] = await db.findAssignmentForStudent(userId);
        const s_assignments = res1.filter(task => task.student_ids.includes(userId))
        // get all submissions that are made by the student
        const [submissions] = await db.getStudentSubmission(userId);

        // get ids of all the assignments that are submitted by the student
        for (let i = 0; i < submissions.length; i++) {
            submitted_assignments_list.push(submissions[i].assignment_id)
        }
        logger.debug({s_assignments}, '[controller/user/get-all.js] [s_assignments] ');
        logger.debug({submitted_assignments_list}, '[controller/user/get-all.js] [submitted_assignments_list] ');

        switch (status) {
            case "SUBMITTED":
                // scheduled assignments can't be submitted only those in ongoing state can be submitted
                if (publishedAt === "SCHEDULED")
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : []
                    });
                else if (publishedAt === "ONGOING") {
                    //find out submitted assignments that are between publishedAt and deadline date
                    const submitted_assignments = s_assignments.filter(task => submitted_assignments_list.includes(task.id) && (new Date(task['published_at']) <= new Date() && new Date() <= new Date(task['deadline'])))
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : submitted_assignments ? submitted_assignments : []
                    });
                } else {
                    //no filters on date, all submitted assignment 
                    const submitted_assignments = s_assignments.filter(task => submitted_assignments_list.includes(task.id))
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : submitted_assignments ? submitted_assignments : []
                    });
                }
            case "PENDING": 
                // scheduled assignments can be on pending --- ongoing assignments can be pending
                if (publishedAt === "SCHEDULED") {
                    //not submitted assignments whose publishedAt date is greater than current date
                    const pending_assignments = s_assignments.filter(task => !submitted_assignments_list.includes(task.id) && (new Date() < new Date(task['published_at'])));
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : pending_assignments ? pending_assignments : []
                    });
                } else if (publishedAt === "ONGOING") {
                    //not submitted assignments that are between publishedAt and deadline date
                    const pending_assignments = s_assignments.filter(task => !submitted_assignments_list.includes(task.id) && (new Date(task['published_at']) <= new Date() && new Date() <= new Date(task['deadline'])))
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : pending_assignments ? pending_assignments : []
                    });
                } else {
                    //no date filters, bring all non submitted assignments
                    const pending_assignments = s_assignments.filter(task => !submitted_assignments_list.includes(task.id))
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : pending_assignments ? pending_assignments : []
                    });
                }
            case "OVERDUE": 
                //future or present assignments can't be overdue only past assignment can be
                if (publishedAt === "SCHEDULED" || publishedAt === "ONGOING") 
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({
                    message: "failure",
                    errorMessage : 'Scheduled/Ongoing assigment can\'t be overdue'
                    });
                // assignments which are not submitted and deadline has been crossed
                const overdue_assignments = s_assignments.filter(task => !submitted_assignments_list.includes(task.id) && (new Date() > new Date(task['deadline'])))
                return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : overdue_assignments ? overdue_assignments : []
                    });
            default:
                //show all assignments
                if (publishedAt === "SCHEDULED")
                return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : s_assignments.filter(a => new Date() < new Date(a['published_at'])) //scheduled assignments
                    });
                else if (publishedAt === "ONGOING")
                    return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : s_assignments.filter(a => new Date(a['published_at']) <= new Date() && new Date() <= new Date(a['deadline'])) //ongoing assignments
                    });
                else
                return res.status(HttpStatus.OK)
                    .json({
                    message: "success",
                    data : s_assignments ? s_assignments : [] 
                    });
        }
    }
  } catch (err) {
    logger.error({err}, '[controller/user/get-all.js] [getAllAssignments] ');
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errors.randomError(err.message));
  }
};
