const fs = require('fs');

module.exports = {
    addTaskPage: (req, res) => {
        res.render('add-task.ejs', {
            title: "TO DO LIST | Add a new task"
            , message: ''
        });
},
    addTask: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let task_name = req.body.task_name;
        let task_description = req.body.task_description;
        let priority = req.body.priority;
        let deadline = req.body.deadline;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `tasks` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-task.ejs', {
                    message,
                    title: "TO DO LIST | Add a new task"
                });
    } else {
    // check the filetype before uploading it
    if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
        // upload the file to the /public/assets/img directory
        uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            // send the task's details to the database
            let query = "INSERT INTO `tasks` (task_name, task_description, priority, deadline, image, user_name) VALUES ('" +
                task_name + "', '" + task_description + "', '" + priority + "', '" + deadline + "', '" + image_name + "', '" + username + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/todolist/');
            });
        });
    } else {
        message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
        res.render('add-task.ejs', {
            message,
            title: "TO DO LIST | Add a new task"
                    });
}
            }
        });
    },
editTaskPage: (req, res) => {
    let taskId = req.params.id;
    let query = "SELECT * FROM `tasks` WHERE id = '" + taskId + "' ";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-task.ejs', {
            title: "Edit  Task"
            , task: result[0]
            , message: ''
        });
    });
},
    editTask: (req, res) => {
        let taskId = req.params.id;
        let task_name = req.body.task_name;
        let task_description = req.body.task_description;
        let priority = req.body.priority;
        let deadline = req.body.deadline;

        let query = "UPDATE `tasks` SET `task_name` = '" + task_name + "', `task_description` = '" + task_description + "', `priority` = '" + priority + "', `deadline` = '" + deadline + "' WHERE `tasks`.`id` = '" + taskId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/todolist/');
        });
    },
        deleteTask: (req, res) => {
            let taskId = req.params.id;
            let getImageQuery = 'SELECT image from `tasks` WHERE id = "' + taskId + '"';
            let deleteUserQuery = 'DELETE FROM tasks WHERE id = "' + taskId + '"';

            db.query(getImageQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                let image = result[0].image;

                fs.unlink(`public/assets/img/${image}`, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    db.query(deleteUserQuery, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/todolist/');
                    });
                });
            });
        }
};
