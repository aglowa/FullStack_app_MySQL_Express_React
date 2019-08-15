module.exports = {
    getHomePage: (req, res) => {
        // query database to get all the tasks
        let query = "SELECT * FROM `tasks` ORDER BY id ASC"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/todolist/');
            }
            res.render('index.ejs', {
                title: "TO DO LIST | View all tasks",
                tasks: result
            });
    });
},
};
