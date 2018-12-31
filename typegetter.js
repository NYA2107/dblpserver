class TypeGetter{

    constructor(data){
        this.data = data
    }

    getPerson(){
        console.log('a')
        return this.data.$.name
    }

    getBook(){
        let temp = []
        this.data.r.forEach((value,i) => {
            if(value.book != undefined){
                temp.push(value.book[0])
            }
        });
        return temp
    }
    
    getArticle(){
        let temp = []
        this.data.forEach((value,i) => {
            if(value.article != undefined){
                temp.push(value.article[0])
            }
        });
        return temp
    }
    
    getInproceedings(){
        let temp = []
        this.data.forEach((value,i) => {
            if(value.inproceedings != undefined){
                temp.push(value.inproceedings[0])
            }
        });
        return temp
    }    

}

module.exports = TypeGetter;

// getTitle = (array) =>{
//     let temp = []
//     array.forEach(value =>{
//         temp.push(value.title[0])
//     })	
//     return temp
// }


