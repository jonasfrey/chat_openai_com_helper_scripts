let f_download_text_file = async function(
    s_text, 
    s_name_file = 'file_from_f_download_text_file.txt'
){
    // Create a new Blob containing the text data
    const blob = new Blob([s_text], { type: 'text/plain' });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    return f_download_file__from_s_url(
        blobUrl, 
        s_name_file
    )
}
let f_download_file__from_s_url = async function(
    s_url, 
    s_name_orand_path_file = '',
    f_callback = async function(
        n_mb_downloaded, 
        n_mb_per_sec_domwnload_speed, 
        n_mb_to_download_total
    ){
        let s_from_total = ''
        if(n_mb_to_download_total != -1){
            s_from_total = (`/${(n_mb_to_download_total).toFixed(0)}`)
        }
        let s_line = `downloaded ${(n_mb_downloaded).toFixed(0)}${s_from_total}(MB) @ ${n_mb_per_sec_domwnload_speed.toFixed(2)} MB/s`
        if(f_b_denojs()){
            await Deno.stdout.write(new TextEncoder().encode('\x1b[A'));
            await Deno.stdout.write(new TextEncoder().encode(s_line+'\n'));
        }else{
            console.log(s_line)
        }
    }, 
    n_ms_callback_interval = 333, 
){
    s_name_orand_path_file = (s_name_orand_path_file!='') ? s_name_orand_path_file : f_s_name_file__from_s_url(s_url);
    // let b_denojs = f_b_denojs();
    // console.log('');//write a empty line because cursor will get reset in with_download_speed
    // let a_n_u8 = await f_a_n_u8__from_s_url_with_download_speed_easy(s_url, f_callback, n_ms_callback_interval);
    let a_n_u8 = new Uint8Array(await(await fetch(s_url)).arrayBuffer())
    // if(b_denojs){
    //     // Write the video to the file
    //     await o_mod_fs.ensureFile(s_name_orand_path_file);
    //     return Deno.writeFile(s_name_orand_path_file, a_n_u8);
    // }
    // if(!b_denojs){
        let o_blob = new Blob(
            [a_n_u8], 
            // {type:'image/jpeg'}
            // {type:f_s_mime_type_from_s_name_file(s_name_file)}
        );
        let o_blob_url = window.URL.createObjectURL(o_blob);
        // Create an anchor link element and set the blob URL as its href
        const a = await f_o_html_element__from_s_tag('a');
        a.href = o_blob_url;
        a.download = s_name_orand_path_file;
        document.body.appendChild(a);  // This is necessary as Firefox requires the link to be in the DOM for the download to trigger
        // Trigger a click event to start the download
        a.click();
        // Clean up: remove the link from the DOM and revoke the blob URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(o_blob_url);
    // }
    return true
}


let f = async function(){

    // // Function to change the CSP directive
    // function changeCSPDirective(newDirective) {
    //     var cspMeta = document.getElementById('csp-meta');
    //     if (cspMeta) {
    //         cspMeta.setAttribute('content', newDirective);
    //     }
    // }

    // // Example: Changing the CSP directive to allow scripts from 'https://deno.land'
    // var newDirective = "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * self 'unsafe-eval' 'unsafe-inline' blob: data: gap: 'https://deno.land'; object-src * self blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;";
    // changeCSPDirective(newDirective);

    // let o_mod = await import ('https://deno.land/x/handyhelpers@3.4/mod.js')
    let a_o = Array.from(document.querySelectorAll('[data-message-author-role="user"]')).map(o=>{
    
        let s_src_img = o?.closest('.w-full')?.parentElement?.parentElement?.parentElement?.nextSibling?.querySelector('img')?.src;
        let s_name_file = s_src_img?.split("filename%3").pop().split('.webp').shift()
        return {
            s_name_file,
            s_prompt: o.textContent,
            s_src_img: s_src_img
        }
    }).filter(o=>o.s_prompt && o.s_src_img)
    
    let a_s_download_and_convert = a_o.map(o=>{
        return [
            `curl "${o.s_src_img}" -o ${o.s_name_file}.webp`,
            `ffmpeg -y -i ${o.s_name_file}.webp ${o.s_name_file}.png`
        ].join('\n')
    })
    
    
    
    
    
    // let f_a_s = function(s_string){
    //     return a_o
    //     .filter(o=>o.s_prompt?.toLowerCase().includes(s_string))
    //     .map(o=>{
    //             let s_name_file = o.s_src_img.split("filename%3").pop().split('.webp').shift()
    //             return [
    //                 `curl "${o.s_src_img}" -o ${s_name_file}.webp`,
    //                 `ffmpeg -i ${s_name_file}.webp ${s_name_file}_${s_string}.png`
    //             ].join('\n')
    //     }).join('\r\n')
    // }
    // let s_keyword = 'elephants'
    // let a_s2 = f_a_s(s_keyword)
    // console.log(a_s2)
    
    // await f_download_text_file(
    //     `${s_keyword}.sh`,
    //     a_s2.join('\n')
    // )
    console.log(a_s_download_and_convert);
    console.log(a_o)
    let s_download_and_convert = a_s_download_and_convert?.join('\n')
    // await f_download_text_file(
    //         `download_webp_and_convert_to_png.sh`,
    //         s_download_and_convert
    // )
    console.log(
        {
            s_download_and_convert
        }
    )
}
f();