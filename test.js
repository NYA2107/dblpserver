axios.get(persons[0])
	.then(response =>{
		parseString(response.data, (err, result) => {
			//all data
			let data = result.dblpperson

			//person
			let person = getPerson(data)

			//inproceeding
			let inproceedings = getInproceedings(data)
			let inproceedingsTitle = getTitle(inproceedings)
			let uniqueInproceedingBooktitle = getUniqueBooktitle(inproceedings)

			let proceedings = getProceedings(data)
			//incollection
			let incollection = getIncollection(data)
			let incollectionTitle = getTitle(incollection)
			let uniqueIncollectionBooktitle = getUniqueBooktitle(incollection)

			//book
			let book = getBook(data)
			let bookTitle = getTitle(book)
			let uniquePublisher = getUniquePublisher(book)

			//article
			let article = getArticle(data)
			let articleTitle = getTitle(article)
			let uniqueJournal = getUniqueJournal(article)
			let temp = []
			res.send(inproceedings)
		});
	})
	.catch(err =>{
		res.send(err)
	})