
let o_mod = await import ('https://deno.land/x/handyhelpers@3.4/mod.js')
let a_o = Array.from(document.querySelectorAll('[data-message-author-role="user"]')).map(o=>{

    console.log(o.textContent)
    let s_src_img = o?.closest('.w-full')?.parentElement?.parentElement?.parentElement?.nextSibling?.querySelector('img')?.src;
    console.log(s_src_img)
    return {
        s_prompt: o.textContent,
        s_src_img: s_src_img
    }
}).filter(o=>o.s_prompt && o.s_src_img)

let a_s_src = Array.from(document.querySelectorAll('img')).map(o=>o.src).filter(s=>s.includes('oai')).map(s=>{
    let s_name_file = s.split("filename%3").pop().split('.webp').shift()
    return `curl "${s}" -o ${s_name_file}.webp`
}).join('\r\n')





let f_a_s = function(s_string){
    return a_o
    .filter(o=>o.s_prompt?.toLowerCase().includes(s_string))
    .map(o=>{
            let s_name_file = o.s_src_img.split("filename%3").pop().split('.webp').shift()
            return [
                `curl "${o.s_src_img}" -o ${s_name_file}.webp`,
                `ffmpeg -i ${s_name_file}.webp ${s_name_file}_${s_string}.png`
            ].join('\n')
    }).join('\r\n')
}
let s_keyword = 'elephants'
let a_s2 = f_a_s(s_keyword)
console.log(a_s2)

await o_mod.f_download_text_file(
    `${s_keyword}.sh`,
    a_s2.join('\n')
)