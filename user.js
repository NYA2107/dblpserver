
class User{
	constructor(conn){
		this.conn = conn;
	}
	runQuery(query, resolve, reject){
		this.conn.query(query,(error, results, fields) => {
			if(error){
				reject({msg:error})
			}else{
				resolve(results);	
			}
		});
	}
	getAllUser(){
		const query = `SELECT * FROM user`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getUser(username, password){
		const query = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	addUser(username, password){
		const query = `INSERT INTO user (username, password) VALUES ('${username}', '${password}');`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
} 
module.exports = User;
