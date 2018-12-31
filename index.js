const bodyParser = require('body-parser')
const sql = require('mysql')
const async = require("async");
const express = require('express')
const app = express()
const port = process.env.PORT || 2100
const User = require('./user.js')
const type = require('./typegetter.js')
const axios = require('axios')
var parseString = require('xml2js').parseString;


//CREATE CONNECTION
const conn = sql.createConnection({
	host     : 'localhost',
  	user     : 'root',
  	password : '',
  	database : 'relation_dblp'
})

//ESTABILISH CONNECTION
conn.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + conn.threadId);
});

//JSON PARSER MIDLEWARE
app.use(bodyParser.json());

//DATA DBLP PERSONS
const persons = [
	'https://dblp.uni-trier.de/pers/xx/u/Uzsoy:Reha.xml',
	'https://dblp.uni-trier.de/pers/xx/k/Kowalski:Matthieu.xml',
	'https://dblp.uni-trier.de/pers/xx/s/Strohmeier:Daniel.xml',
	'https://dblp.uni-trier.de/pers/xx/m/Moshkov:Mikhail_Ju=.xml',
	'https://dblp.uni-trier.de/pers/xx/f/Faucher:Colette.xml',
	'https://dblp.uni-trier.de/pers/xx/t/Tolba:Mohamed_F=.xml',
	'https://dblp.uni-trier.de/pers/xx/a/AbouEisha:Hassan.xml',
	'https://dblp.uni-trier.de/pers/xx/p/Paszynska:Anna.xml',
	'https://dblp.uni-trier.de/pers/xx/j/Jopek:Konrad.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Calo:Victor_M=.xml',
	'https://dblp.uni-trier.de/pers/xx/w/Wozniak:Maciej.xml',
	'https://dblp.uni-trier.de/pers/xx/d/Dalc=iacute=n:Lisandro.xml',
	'https://dblp.uni-trier.de/pers/xx/p/Pardo:David.xml',
	'https://dblp.uni-trier.de/pers/xx/=/=Aacute=lvarez=Aramberri:Julen.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Coutinho:Alvaro_L=_G=_A=.xml',
	'https://dblp.uni-trier.de/pers/xx/c/C=ocirc=rtes:Adriano_M=_A=.xml',
	'https://dblp.uni-trier.de/pers/xx/v/Vignal:Philippe_A=.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Costarelli:Santiago_D=.xml',
	'https://dblp.uni-trier.de/pers/xx/i/Idelsohn:Sergio_R=.xml',
	'https://dblp.uni-trier.de/pers/xx/p/Paz:Rodrigo.xml',
	'https://dblp.uni-trier.de/pers/xx/s/Sarmiento:Adel.xml',
	'https://dblp.uni-trier.de/pers/xx/g/Garc=iacute=a:Daniel.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Collier:Nathan_O=.xml',
	'https://dblp.uni-trier.de/pers/xx/b/Behnel:Stefan.xml',
	'https://dblp.uni-trier.de/pers/xx/b/Bradshaw:Robert.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Citro:Craig.xml',
	'https://dblp.uni-trier.de/pers/xx/s/Seljebotn:Dag_Sverre.xml',
	'https://dblp.uni-trier.de/pers/xx/s/Smith:Kurt.xml',
	'https://dblp.uni-trier.de/pers/xx/c/Clavero:Carmelo.xml',
	'https://dblp.uni-trier.de/pers/xx/j/Jorge:Juan_Carlos.xml'
]

//METHOD
const getPerson = (data)=>{
	temp=[]
	if(data.person[0].note == undefined){
		return ({
			person:data.person[0].author[0],
			affiliation:null
		})
	}
	return ({
		person:data.person[0].author[0],
		affiliation:data.person[0].note[0]._
	})
	
}

const getArticle = (data) =>{
	let temp = []
	data.r.forEach((value,i) => {
		if(value.article != undefined){
			temp.push(value.article[0])
		}
	});
	return temp
}

const getBook = (data) =>{
	let temp = []
	data.r.forEach((value,i) => {
		if(value.book != undefined){
			temp.push(value.book[0])
		}
	});
	return temp
}

const getIncollection = (data) =>{
	let temp = []
	data.r.forEach((value,i) => {
		if(value.incollection != undefined){
			temp.push(value.incollection[0])
		}
	});
	return temp
}

const getInproceedings = (data) =>{
	let temp = []
	data.r.forEach((value,i) => {
		if(value.inproceedings != undefined){
			temp.push(value.inproceedings[0])
		}
	});
	return temp
}
const getProceedings = (data) =>{
	let temp = []
	data.r.forEach((value,i) => {
		if(value.proceedings != undefined){
			temp.push(value.proceedings[0])
		}
	});
	return temp
}

/////////////////////////////////
const getTitle = (array) =>{
    let temp = []
    array.forEach(value =>{
        temp.push(value.title[0])
    })	
    return temp
}

const getUniquePublisher = (array) =>{
	let temp = []
    array.forEach(value =>{
		if(value.publisher != null){
			temp.push(value.publisher[0])
		}
	})	
	var uniqueItems = Array.from(new Set(temp))
    return uniqueItems
}
const getUniqueJournal = (array) =>{
	let temp = []
    array.forEach(value =>{
		if(value.journal != null){
			temp.push(value.journal[0])
		}
	})	
	var uniqueItems = Array.from(new Set(temp))
    return uniqueItems
}
const getUniqueBooktitle = (array) =>{
	let temp = []
    array.forEach(value =>{
		if(value.booktitle != null){
			temp.push({booktitle: value.booktitle[0], year:value.year[0]})
		}
	})	
	var uniqueItems = Array.from(new Set(temp))
    return uniqueItems
}

//SQL EXECUTION METHOD
const executeSQL = (personR, inproceedings, proceedings, incollection, book, article)=>{
	conn.query(`INSERT INTO person (name, affiliation) VALUES ('${personR.person}', '${personR.affiliation}')`, function (error, results, fields) {
		book.forEach((v,i)=>{
			if(v != undefined && v.publisher != undefined){
				conn.query(`INSERT INTO publisher (name) VALUES ('${v.publisher[0]}')`, function (error, results, fields) {
					conn.query(`INSERT INTO book (title,publisher,year) VALUES ('${v.title[0]}','${v.publisher[0]}','${v.year[0]}')`, function (error, results, fields) {
						conn.query(`INSERT INTO membuat_buku (person,book) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
						
						})	
					})
				})
			}
		})
		proceedings.forEach((v,i)=>{
			if(v != undefined && v.publisher != undefined){
				conn.query(`INSERT INTO publisher (name) VALUES ('${v.publisher[0]}')`, function (error, results, fields) {
					conn.query(`INSERT INTO book (title,publisher,year) VALUES ('${v.title[0]}','${v.publisher[0]}','${v.year[0]}')`, function (error, results, fields) {
						conn.query(`INSERT INTO mengeditori (person,book) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
						
						})	
					})
				})
			}else if(v != undefined && v.publisher == undefined){
				conn.query(`INSERT INTO book (title,year) VALUES ('${v.title[0]}','${v.year[0]}')`, function (error, results, fields) {
					conn.query(`INSERT INTO mengeditori (person,book) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
					
					})	
				})
			}
		})
		article.forEach((v,i)=>{
			if(v != undefined && v.journal != undefined){
				conn.query(`INSERT INTO journal (title) VALUES ('${v.journal[0]}')`, function (error, results, fields) {
					conn.query(`INSERT INTO article (title,journal,year) VALUES ('${v.title[0]}','${v.journal[0]}','${v.year[0]}')`, function (error, results, fields) {
						conn.query(`INSERT INTO membuat_article (person,article) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
						
						})	
					})
				})
			}
		})
		inproceedings.forEach((v,i)=>{
			if(v != undefined){
				conn.query(`INSERT INTO book (title,year) VALUES ('${v.booktitle[0]}','${v.year[0]}')`, function (error, results, fields) {
					if(v.volume != undefined){
						conn.query(`INSERT INTO proceeding (title,volume,book) VALUES ('${v.title[0]}','${v.volume[0]}','${v.booktitle[0]}')`, function (error, results, fields) {
							conn.query(`INSERT INTO membuat_proceeding (person,proceeding) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
							
							})	
						})
					}else{
						conn.query(`INSERT INTO proceeding (title,book) VALUES ('${v.title[0]}','${v.booktitle[0]}')`, function (error, results, fields) {
							conn.query(`INSERT INTO membuat_proceeding (person,proceeding) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
							
							})	
						})
					}
				})
			}
		})
		incollection.forEach((v,i)=>{
			if(v != undefined){
				conn.query(`INSERT INTO book (title,year) VALUES ('${v.booktitle[0]}','${v.year[0]}')`, function (error, results, fields) {
					conn.query(`INSERT INTO incollection (title,book) VALUES ('${v.title[0]}','${v.booktitle[0]}')`, function (error, results, fields) {
						conn.query(`INSERT INTO membuat_incollection (person,proceeding) VALUES ('${personR.person}','${v.title[0]}')`, function (error, results, fields) {
						
						})	
					})
					
				})
			}
		})

	});
}

//API GET '/'
app.get('/',(req, res)=>{
	let personDB=[]
	async.each(persons, (person, next) => {
		axios.get(person)
		.then(response =>{
			parseString(response.data, (err, result) => {
				//all data
				let data = result.dblpperson

				//person
				let personR = getPerson(data)

				//inproceeding
				let inproceedings = getInproceedings(data)

				//proceeding
				let proceedings = getProceedings(data)

				//incollection
				let incollection = getIncollection(data)

				//book
				let book = getBook(data)
		
				//article
				let article = getArticle(data)

				personDB.push(personR)
				executeSQL(personR, inproceedings, proceedings, incollection, book, article);
			});
		}).then(result =>{
			next()
		})
	}, (err) => {
		if( err ) {
		  res.send(err)
		} else {
			console.log('SUKSES BROOOO')
			res.send(personDB)	
		}
	});

})

//PORT LISTENER
app.listen(port, () => console.log(`Example app listening on port ${port}!`))