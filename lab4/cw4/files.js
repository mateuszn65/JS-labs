// import * as mime from 'mime'
import * as fs from 'fs'
import mime from 'mime'
export class Files{
    constructor(){
        this._msg = ''
    }
    get msg(){
        return this._msg
    }
    rec(path){
        const files = fs.readdirSync(path)
        files.forEach(file =>{
            const new_path = path + '\\' + file
            if (fs.statSync(new_path).isDirectory()){
                this.rec(new_path)
            }else{
                if (fs.statSync(new_path).isFile()){
                    if (mime.getType(new_path) == 'text/plain'){
                        this.info(new_path)
                    }else{
                        this.statistics(new_path)
                    }
                    
                }
            }
        })
    }
    info(filePath){
        const map = new Map()
        const data = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'})
        let dataArr = data.split(' ')
        dataArr.forEach(work=>{
            if (map.has(work)){
                map.set(work, map.get(work) + 1)
            }else{
                map.set(work, 1)
            }
        })
        this._msg += '\n' + filePath + '\n'
        map.forEach((value, key)=>{
            this._msg += key + ': ' + value + '\n'
        })
    }
    statistics(filePath){
        const ctime = fs.statSync(filePath).ctime
        const mtime = fs.statSync(filePath).mtime
        this._msg += '\n' + filePath + '\nCreation time: ' + ctime + '\nModification time: ' + mtime + '\n' 
    }
}