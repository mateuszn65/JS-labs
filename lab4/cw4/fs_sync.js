import * as fs from 'fs'



export function check(name){
    let found = false
    let msg = 'Does not exist'
    let path = '.'
    const files = fs.readdirSync(path)
        files.forEach(file =>{
            if (found)
                return
            const new_path = path + '\\' + file
            if (fs.statSync(new_path).isDirectory()){
                if (file == name){
                    found = true
                    msg = "It's a directory, path: " + new_path
                }
            }else{
                if (fs.statSync(new_path).isFile()){
                    if (file == name){
                        const data = fs.readFileSync(new_path, {encoding:'utf8', flag:'r'})
                        found = true
                        msg = "It's a file, path: " + new_path + '\n' + data
                    }
                }
            }
        })

    return msg

}
if (process.argv[2])
    check(process.argv[2])
