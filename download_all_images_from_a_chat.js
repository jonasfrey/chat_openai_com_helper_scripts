// this will generate a curl file
// you have to be fast and generate and execute the curl file quickly otherwise images wont be accessable
Array.from(document.querySelectorAll('img')).map(o=>o.src).filter(s=>s.includes('oai')).map(s=>{
    let s_name_file = s.split("filename%3").pop().split('.webp').shift()
    return `curl "${s}" -o ${s_name_file}.webp`
}).join('\n')