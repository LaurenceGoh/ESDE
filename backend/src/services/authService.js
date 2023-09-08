config = require('../config/config');
const pool = require('../config/database')

//sql injection
module.exports.authenticate = (email,callback) => {

        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    /* original sql query
                    
                     */
                    /*`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`, [email], */
                    connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                    FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`,[email], (err, rows) => {
                        if (err) {
                            console.log(err)
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                return callback(null, rows);
                            } else {
                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); //End of getConnection

    } //End of authenticate 

